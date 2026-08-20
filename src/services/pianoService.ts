/**
 * Fachada del piano para el resto de la app.
 *
 * Mantiene la misma API que la version anterior (playNote / playChord /
 * triggerAttack / triggerRelease / ...) pero por debajo usa PianoEngine
 * (Web Audio + 31 muestras) en lugar de un Tone.Sampler con 3 muestras.
 *
 * Se corrigen ademas dos cosas que sonaban mal:
 *  - normalizeNote ignoraba la octava cuando la nota ya la traia ("E4" acababa
 *    sonando como C4). Ahora se respeta la octava real del acorde.
 *  - las notas ya no se cortan en seco: el motor aplica el apagador con un
 *    release dependiente de la altura.
 */

import { pianoEngine, type PianoEngineState } from '../features/audio/PianoEngine';
import { noteNameToMidi, noteToMidi, midiToNoteName } from '../features/audio/notes';
import { durationToSeconds } from '../features/audio/time';

class PianoService {
  private engine = pianoEngine;

  async initialize(): Promise<void> {
    await this.engine.load();
  }

  /** Suscripcion al estado de carga (lo usa usePiano). */
  subscribe(listener: (state: PianoEngineState) => void): () => void {
    return this.engine.subscribe(listener);
  }

  getState(): PianoEngineState {
    return this.engine.getState();
  }

  isReady(): boolean {
    return this.engine.isReady();
  }

  /**
   * Convierte cualquier formato usado en la app ("C", "Cs", "C#", "C4",
   * "C#4", "Db3") a nota MIDI. `octave` solo se aplica si el nombre no
   * traia la suya.
   */
  toMidi(note: string, octave?: number): number | null {
    const direct = noteNameToMidi(note);
    if (direct === null) return null;
    const hasOctave = /-?\d/.test(note);
    if (!hasOctave && octave !== undefined) return noteToMidi(note, octave);
    return direct;
  }

  /** Se mantiene por compatibilidad: devuelve el nombre normalizado ("C#4"). */
  normalizeNote(note: string, octave?: number): string {
    const midi = this.toMidi(note, octave);
    return midi === null ? `C${octave ?? 4}` : midiToNoteName(midi);
  }

  async playNote(
    note: string,
    duration: string | number = '8n',
    velocity: number = 0.8,
    octave?: number,
  ): Promise<void> {
    const midi = this.toMidi(note, octave);
    if (midi === null) return;
    await this.engine.resume();
    this.engine.scheduleNote(midi, velocity, this.engine.now(), durationToSeconds(duration));
  }

  async playChord(
    notes: string[],
    duration: string | number = '4n',
    velocity: number = 0.6,
  ): Promise<void> {
    if (!Array.isArray(notes) || notes.length === 0) return;
    await this.engine.resume();

    const seconds = durationToSeconds(duration);
    const start = this.engine.now();
    const midiNotes = notes
      .map((note) => this.toMidi(note))
      .filter((midi): midi is number => midi !== null);

    midiNotes.forEach((midi, index) => {
      // Micro-desfase ascendente: un acorde tocado por una mano nunca entra
      // matematicamente a la vez y esto lo hace sonar humano.
      const humanize = index * 0.006;
      const noteVelocity = velocity * (index === 0 ? 1 : 0.94);
      this.engine.scheduleNote(midi, noteVelocity, start + humanize, seconds);
    });
  }

  stopAllNotes(): void {
    this.engine.allNotesOff();
  }

  triggerAttack(note: string, velocity: number = 0.8, octave?: number): void {
    const midi = this.toMidi(note, octave);
    if (midi === null) return;
    this.engine.noteOn(midi, velocity);
  }

  triggerRelease(note: string, octave?: number): void {
    const midi = this.toMidi(note, octave);
    if (midi === null) return;
    this.engine.noteOff(midi);
  }

  stopNote(note: string, octave?: number): void {
    this.triggerRelease(note, octave);
  }

  stopChord(notes: string[], octave?: number): void {
    notes.forEach((note) => this.triggerRelease(note, octave));
  }

  /** Pedal de sustain. */
  setSustain(down: boolean): void {
    this.engine.setSustain(down);
  }

  /** Volumen 0..1 (tambien acepta dB negativos de la API antigua). */
  setVolume(volume: number): void {
    const normalized = volume < 0 ? Math.pow(10, volume / 20) : volume;
    this.engine.setVolume(normalized);
  }

  getVolume(): number {
    return this.engine.getVolume();
  }

  setReverb(mix: number): void {
    this.engine.setReverb(mix);
  }

  getReverb(): number {
    return this.engine.getReverb();
  }

  /** Click de metronomo sintetizado. */
  click(accent = false): void {
    this.engine.click(undefined, accent);
  }

  activeNotes(): number[] {
    return this.engine.activeNotes();
  }

  getAvailableNotes(): string[] {
    return ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
  }

  /**
   * Antes servia para recargar otro instrumento. El motor solo tiene piano,
   * asi que se limita a cortar el sonido y dejarlo listo otra vez.
   */
  setInstrument(instrument: string): void {
    if (instrument && instrument !== 'piano') {
      console.warn(`Chordia solo tiene piano: se ignora el instrumento "${instrument}".`);
    }
    this.engine.allNotesOff(true);
  }
}

const pianoService = new PianoService();

export default pianoService;
