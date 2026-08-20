/**
 * Motor de piano de Chordia.
 *
 * Sustituye al Tone.Sampler de 3 muestras que habia antes. Puntos clave:
 *
 *  - Web Audio API directa: latencia minima (latencyHint 'interactive') y
 *    programacion de notas con tiempos absolutos del reloj de audio, que es lo
 *    que permite reproducir un MIDI sin desfases.
 *  - 31 muestras del Salamander Grand Piano, asi que el pitch-shifting nunca
 *    pasa de un semitono.
 *  - Sintetizador de respaldo: si una muestra aun no ha llegado (o falla la
 *    red) la nota suena igualmente, nunca hay silencio.
 *  - Dinamica real: la velocidad controla ganancia y brillo (filtro), como en
 *    un piano acustico.
 *  - Pedal de sustain (CC64), robo de voces, paneo estereo por altura, reverb
 *    por convolucion con impulso generado, compresor y limitador.
 */

import { SampleBank, type LoadProgress } from './samples';
import { clampToPiano, midiToFrequency } from './notes';

export type PianoEngineStatus = 'idle' | 'loading' | 'sampled' | 'synth';

export interface PianoEngineState {
  status: PianoEngineStatus;
  progress: LoadProgress | null;
  /** Se puede tocar ya, aunque las muestras sigan cargando. */
  playable: boolean;
  error: string | null;
}

interface Voice {
  id: number;
  midi: number;
  gain: GainNode;
  filter: BiquadFilterNode;
  nodes: AudioScheduledSourceNode[];
  startTime: number;
  /** true cuando ya se ha programado la suelta de la nota. */
  released: boolean;
  /** Momento (reloj de audio) en el que empieza a apagarse. */
  releaseAt: number | null;
  sustained: boolean;
  peak: number;
}

const MAX_VOICES = 48;
const DEFAULT_VOLUME = 0.8;
const DEFAULT_REVERB = 0.18;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Impulso sintetico para la reverb: ruido con decaimiento exponencial. */
function createImpulseResponse(ctx: BaseAudioContext, seconds = 2.4, decay = 2.8): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(rate * seconds));
  const impulse = ctx.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      // Pequeno retardo inicial para que el ataque quede seco y definido.
      const early = i < rate * 0.012 ? 0.25 : 1;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * early;
    }
  }
  return impulse;
}

/** Curva de saturacion suave: evita recortes duros en acordes densos. */
function createSoftClipCurve(amount = 1.6): Float32Array {
  const samples = 1024;
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = Math.tanh(x * amount) / Math.tanh(amount);
  }
  return curve;
}

function createNoiseBuffer(ctx: BaseAudioContext, seconds = 0.12): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  return buffer;
}

export class PianoEngine {
  private ctx: AudioContext | null = null;
  private bank = new SampleBank();
  private noiseBuffer: AudioBuffer | null = null;

  private voiceBus: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;

  private voices: Voice[] = [];
  private voiceId = 0;

  private sustainDown = false;
  private volume = DEFAULT_VOLUME;
  private reverbMix = DEFAULT_REVERB;

  private state: PianoEngineState = {
    status: 'idle',
    progress: null,
    playable: false,
    error: null,
  };
  private listeners = new Set<(state: PianoEngineState) => void>();

  // ---------------------------------------------------------------- contexto

  /** Crea (o devuelve) el AudioContext. Debe llamarse tras un gesto de usuario. */
  getContext(): AudioContext {
    if (this.ctx) return this.ctx;

    const Ctor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor({ latencyHint: 'interactive' });
    this.ctx = ctx;
    this.buildGraph(ctx);
    return ctx;
  }

  private buildGraph(ctx: AudioContext): void {
    const voiceBus = ctx.createGain();
    voiceBus.gain.value = 1;

    const dryGain = ctx.createGain();
    dryGain.gain.value = 1 - this.reverbMix * 0.5;

    const convolver = ctx.createConvolver();
    convolver.buffer = createImpulseResponse(ctx);

    const wetGain = ctx.createGain();
    wetGain.gain.value = this.reverbMix;

    const masterGain = ctx.createGain();
    masterGain.gain.value = this.volumeToGain(this.volume);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 12;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.22;

    const limiter = ctx.createWaveShaper();
    limiter.curve = createSoftClipCurve();
    limiter.oversample = '2x';

    voiceBus.connect(dryGain);
    voiceBus.connect(convolver);
    convolver.connect(wetGain);
    dryGain.connect(masterGain);
    wetGain.connect(masterGain);
    masterGain.connect(compressor);
    compressor.connect(limiter);
    limiter.connect(ctx.destination);

    this.voiceBus = voiceBus;
    this.dryGain = dryGain;
    this.wetGain = wetGain;
    this.convolver = convolver;
    this.masterGain = masterGain;
    this.noiseBuffer = createNoiseBuffer(ctx);
  }

  /** Reanuda el contexto: los navegadores lo suspenden hasta un gesto real. */
  async resume(): Promise<void> {
    const ctx = this.getContext();
    if (ctx.state !== 'running') {
      try {
        await ctx.resume();
      } catch {
        /* el navegador lo reintentara en el siguiente gesto */
      }
    }
  }

  now(): number {
    return this.getContext().currentTime;
  }

  // ------------------------------------------------------------------ estado

  subscribe(listener: (state: PianoEngineState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): PianoEngineState {
    return this.state;
  }

  private setState(patch: Partial<PianoEngineState>): void {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Descarga las muestras. Se puede tocar desde el primer instante: hasta que
   * llegan, las notas suenan con el sintetizador de respaldo.
   */
  async load(): Promise<void> {
    await this.resume();
    if (this.state.status === 'sampled' || this.state.status === 'loading') return;

    this.setState({ status: 'loading', playable: true, error: null });
    try {
      await this.bank.load(this.getContext(), (progress) => this.setState({ progress }));
      this.setState({ status: 'sampled', playable: true, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error cargando el piano';
      // Sin muestras seguimos siendo tocables con el sintetizador.
      this.setState({ status: 'synth', playable: true, error: message });
    }
  }

  isReady(): boolean {
    return this.state.playable;
  }

  // ------------------------------------------------------------------- notas

  /** Dinamica: la ganancia crece mas despacio que la velocidad. */
  private velocityToGain(velocity: number): number {
    const v = clamp(velocity, 0.02, 1);
    return 0.06 + 0.94 * Math.pow(v, 1.6);
  }

  /** Cuanto mas fuerte se pulsa, mas brillante suena. */
  private velocityToCutoff(velocity: number, midi: number): number {
    const v = clamp(velocity, 0.02, 1);
    const base = midiToFrequency(midi);
    const harmonics = 6 + 22 * Math.pow(v, 1.3);
    return clamp(base * harmonics, 700, 18000);
  }

  /** Los graves a la izquierda, los agudos a la derecha, como un piano real. */
  private pitchPan(midi: number): number {
    return clamp((midi - 60) / 48, -1, 1) * 0.32;
  }

  /** Tiempo de apagado del apagador: los graves resuenan mas. */
  private releaseTime(midi: number, sustained: boolean): number {
    if (sustained) return 2.2 + (108 - midi) / 60;
    return 0.16 + 0.55 * (1 - clamp((midi - 21) / 87, 0, 1));
  }

  private volumeToGain(volume: number): number {
    return Math.pow(clamp(volume, 0, 1), 1.6) * 1.1;
  }

  /**
   * Arranca una voz. startTime en segundos del reloj de audio; duration
   * (opcional) programa la suelta, lo que da timing exacto al reproducir MIDI.
   */
  private startVoice(midi: number, velocity: number, startTime: number, duration?: number): Voice | null {
    const ctx = this.getContext();
    const bus = this.voiceBus;
    if (!bus) return null;

    // La primera nota dispara la descarga de muestras en segundo plano: hasta
    // que llegan se oye el sintetizador, pero nunca hay que esperar a nada.
    if (this.state.status === 'idle') void this.load();

    const note = clampToPiano(Math.round(midi));
    const t = Math.max(startTime, ctx.currentTime);
    const v = clamp(velocity, 0.02, 1);
    const peak = this.velocityToGain(v);

    this.enforcePolyphony(t);

    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.velocityToCutoff(v, note), t);
    filter.Q.value = 0.4;

    const panner = ctx.createStereoPanner();
    panner.pan.value = this.pitchPan(note);

    filter.connect(gain);
    gain.connect(panner);
    panner.connect(bus);

    const nodes: AudioScheduledSourceNode[] = [];
    const sample = this.bank.nearest(note);

    // Ataque: mas lento en pianissimo, casi instantaneo en fortissimo.
    const attack = 0.002 + (1 - v) * 0.006;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + attack);

    if (sample) {
      const source = ctx.createBufferSource();
      source.buffer = sample.buffer;
      source.playbackRate.value = Math.pow(2, (note - sample.midi) / 12);
      source.connect(filter);
      source.start(t);
      nodes.push(source);
    } else {
      // Respaldo aditivo: fundamental mas armonicos con decaimiento por altura.
      const partials: Array<[number, number, OscillatorType]> = [
        [1, 1, 'sine'],
        [2, 0.32, 'sine'],
        [3, 0.14, 'sine'],
        [4, 0.06, 'sine'],
        [1, 0.12, 'triangle'],
      ];
      const frequency = midiToFrequency(note);
      partials.forEach(([ratio, amount, type], index) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        // Desafinacion minima: da cuerpo y evita el sonido de organo.
        osc.frequency.value = frequency * ratio * (1 + (index % 2 === 0 ? 0.0007 : -0.0007));
        const partialGain = ctx.createGain();
        partialGain.gain.value = amount * 0.32;
        osc.connect(partialGain);
        partialGain.connect(filter);
        osc.start(t);
        nodes.push(osc);
      });

      // Decaimiento propio del piano: rapido arriba, lento abajo.
      const tau = 0.55 * Math.pow(2, (60 - note) / 22);
      gain.gain.setTargetAtTime(peak * 0.18, t + attack, tau);

      // Golpe de martillo.
      if (this.noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = clamp(frequency * 6, 600, 6000);
        noiseFilter.Q.value = 0.8;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.09 * v, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(panner);
        noise.start(t);
        nodes.push(noise);
      }
    }

    const voice: Voice = {
      id: ++this.voiceId,
      midi: note,
      gain,
      filter,
      nodes,
      startTime: t,
      released: false,
      releaseAt: null,
      sustained: false,
      peak,
    };
    this.voices.push(voice);

    const primary = nodes[0];
    if (primary) {
      primary.onended = () => this.disposeVoice(voice);
    }

    if (duration !== undefined) {
      this.releaseVoice(voice, t + Math.max(duration, 0.03));
    }

    return voice;
  }

  private enforcePolyphony(when: number): void {
    if (this.voices.length < MAX_VOICES) return;
    // Se roba primero lo que ya esta soltandose y, si no, la voz mas antigua.
    const candidates = [...this.voices].sort((a, b) => {
      if (a.released !== b.released) return a.released ? -1 : 1;
      return a.startTime - b.startTime;
    });
    const steal = candidates.slice(0, this.voices.length - MAX_VOICES + 1);
    steal.forEach((voice) => this.fadeOutVoice(voice, when, 0.08));
  }

  private releaseVoice(voice: Voice, when: number): void {
    const ctx = this.ctx;
    if (!ctx || voice.released) return;
    voice.released = true;

    const t = Math.max(when, ctx.currentTime);
    voice.releaseAt = t;
    const release = this.releaseTime(voice.midi, voice.sustained);
    try {
      voice.gain.gain.cancelScheduledValues(t);
      voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), t);
      voice.gain.gain.setTargetAtTime(0.0001, t, release / 3.5);
    } catch {
      /* parametro ya desconectado */
    }
    this.stopNodes(voice, t + release);
  }

  private fadeOutVoice(voice: Voice, when: number, seconds: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    voice.released = true;
    const t = Math.max(when, ctx.currentTime);
    voice.releaseAt = t;
    try {
      voice.gain.gain.cancelScheduledValues(t);
      voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), t);
      voice.gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
    } catch {
      /* ignorado */
    }
    this.stopNodes(voice, t + seconds);
  }

  private stopNodes(voice: Voice, when: number): void {
    voice.nodes.forEach((node) => {
      try {
        node.stop(when);
      } catch {
        /* ya detenido */
      }
    });
  }

  private disposeVoice(voice: Voice): void {
    const index = this.voices.indexOf(voice);
    if (index >= 0) this.voices.splice(index, 1);
    try {
      voice.gain.disconnect();
      voice.filter.disconnect();
    } catch {
      /* ignorado */
    }
  }

  // ------------------------------------------------------------- API publica

  /** Pulsa una tecla (nota MIDI). */
  noteOn(midi: number, velocity = 0.75, when?: number): void {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') void this.resume();
    this.startVoice(midi, velocity, when ?? ctx.currentTime);
  }

  /** Suelta una tecla. Si el pedal esta pisado, la nota se queda sonando. */
  noteOff(midi: number, when?: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = when ?? ctx.currentTime;
    const note = clampToPiano(Math.round(midi));

    this.voices
      .filter(
        (voice) => voice.midi === note && (!voice.released || (voice.releaseAt ?? 0) > t),
      )
      .forEach((voice) => {
        if (this.sustainDown) {
          voice.sustained = true;
          return;
        }
        // Si la suelta estaba programada mas tarde, se adelanta a ahora.
        voice.released = false;
        this.releaseVoice(voice, t);
      });
  }

  /**
   * Programa una nota completa en el reloj de audio. Es lo que usa el player
   * de MIDI: el timing no depende del hilo principal ni de setTimeout.
   */
  scheduleNote(midi: number, velocity: number, startTime: number, duration: number): void {
    this.startVoice(midi, velocity, startTime, duration);
  }

  /** Pedal de sustain (CC64). */
  setSustain(down: boolean, when?: number): void {
    const ctx = this.ctx;
    if (this.sustainDown === down) return;
    this.sustainDown = down;
    if (down || !ctx) return;

    const t = when ?? ctx.currentTime;
    this.voices
      .filter((voice) => voice.sustained && !voice.released)
      .forEach((voice) => {
        voice.sustained = false;
        this.releaseVoice(voice, t);
      });
  }

  isSustainDown(): boolean {
    return this.sustainDown;
  }

  /** Corta todo. immediate hace un fundido de 30 ms, para parar o buscar. */
  allNotesOff(immediate = false): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    [...this.voices].forEach((voice) => {
      if (immediate) this.fadeOutVoice(voice, t, 0.03);
      else this.releaseVoice(voice, t);
    });
    this.sustainDown = false;
  }

  /**
   * Notas que estan sonando ahora mismo, para pintar el teclado. Una nota
   * programada cuenta como activa hasta que le llega su momento de apagarse.
   */
  activeNotes(): number[] {
    const now = this.ctx?.currentTime ?? 0;
    return [
      ...new Set(
        this.voices
          .filter((voice) => voice.releaseAt === null || voice.releaseAt > now)
          .map((voice) => voice.midi),
      ),
    ];
  }

  setVolume(volume: number): void {
    this.volume = clamp(volume, 0, 1);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.volumeToGain(this.volume),
        this.ctx.currentTime,
        0.02,
      );
    }
  }

  getVolume(): number {
    return this.volume;
  }

  setReverb(mix: number): void {
    this.reverbMix = clamp(mix, 0, 1);
    if (this.wetGain && this.dryGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.wetGain.gain.setTargetAtTime(this.reverbMix, t, 0.05);
      this.dryGain.gain.setTargetAtTime(1 - this.reverbMix * 0.5, t, 0.05);
    }
  }

  getReverb(): number {
    return this.reverbMix;
  }

  /**
   * Click de metronomo sintetizado: sin ficheros que puedan dar 404 y con
   * timing de audio exacto.
   */
  click(when?: number, accent = false): void {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!master) return;
    const t = Math.max(when ?? ctx.currentTime, ctx.currentTime);

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(accent ? 1800 : 1150, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(accent ? 0.32 : 0.2, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + (accent ? 0.07 : 0.05));

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 700;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.1);
    osc.onended = () => {
      try {
        gain.disconnect();
        filter.disconnect();
      } catch {
        /* ignorado */
      }
    };
  }

  dispose(): void {
    this.allNotesOff(true);
    this.convolver?.disconnect();
    this.masterGain?.disconnect();
    void this.ctx?.close();
    this.ctx = null;
    this.voices = [];
    this.setState({ status: 'idle', playable: false, progress: null });
  }
}

/** Instancia unica compartida por toda la app. */
export const pianoEngine = new PianoEngine();
