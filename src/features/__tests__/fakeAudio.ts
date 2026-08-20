/**
 * AudioContext falso para poder probar el motor y el reproductor en jsdom, que
 * no implementa Web Audio. Solo cubre lo que usa PianoEngine.
 */

class FakeAudioParam {
  value = 0;
  setValueAtTime(): this {
    return this;
  }
  linearRampToValueAtTime(): this {
    return this;
  }
  exponentialRampToValueAtTime(): this {
    return this;
  }
  setTargetAtTime(): this {
    return this;
  }
  cancelScheduledValues(): this {
    return this;
  }
}

class FakeNode {
  gain = new FakeAudioParam();
  frequency = new FakeAudioParam();
  pan = new FakeAudioParam();
  Q = new FakeAudioParam();
  detune = new FakeAudioParam();
  playbackRate = new FakeAudioParam();
  threshold = new FakeAudioParam();
  knee = new FakeAudioParam();
  ratio = new FakeAudioParam();
  attack = new FakeAudioParam();
  release = new FakeAudioParam();
  type = 'sine';
  buffer: unknown = null;
  curve: Float32Array | null = null;
  oversample = 'none';
  onended: (() => void) | null = null;
  started = 0;
  stopped: number | null = null;

  connect(): this {
    return this;
  }
  disconnect(): void {}
  start(when = 0): void {
    this.started = when;
  }
  stop(when = 0): void {
    this.stopped = when;
  }
}

export class FakeAudioContext {
  currentTime = 0;
  sampleRate = 44100;
  state: AudioContextState = 'running';
  destination = new FakeNode();

  createGain(): FakeNode {
    return new FakeNode();
  }
  createBiquadFilter(): FakeNode {
    return new FakeNode();
  }
  createStereoPanner(): FakeNode {
    return new FakeNode();
  }
  createBufferSource(): FakeNode {
    return new FakeNode();
  }
  createOscillator(): FakeNode {
    return new FakeNode();
  }
  createConvolver(): FakeNode {
    return new FakeNode();
  }
  createDynamicsCompressor(): FakeNode {
    return new FakeNode();
  }
  createWaveShaper(): FakeNode {
    return new FakeNode();
  }
  createBuffer(_channels: number, length: number): { getChannelData: () => Float32Array } {
    const data = new Float32Array(length);
    return { getChannelData: () => data };
  }
  decodeAudioData(): Promise<never> {
    return Promise.reject(new Error('sin decodificador en los tests'));
  }
  async resume(): Promise<void> {
    this.state = 'running';
  }
  async close(): Promise<void> {
    this.state = 'closed';
  }
}

export interface FakeClock {
  ctx: FakeAudioContext;
  /** Avanza el reloj de audio y ejecuta los frames de animacion pendientes. */
  advance: (seconds: number, frames?: number) => void;
  restore: () => void;
}

/**
 * Instala el AudioContext falso, un requestAnimationFrame manual y un fetch que
 * falla (para que el motor use el sintetizador de respaldo en vez de la red).
 */
export function installFakeAudio(): FakeClock {
  const ctx = new FakeAudioContext();
  const originals = {
    AudioContext: window.AudioContext,
    raf: window.requestAnimationFrame,
    caf: window.cancelAnimationFrame,
    fetch: global.fetch,
  };

  (window as unknown as { AudioContext: unknown }).AudioContext = function FakeCtor() {
    return ctx;
  } as unknown as typeof AudioContext;

  let callbacks: Array<[number, FrameRequestCallback]> = [];
  let nextId = 1;
  window.requestAnimationFrame = ((callback: FrameRequestCallback): number => {
    const id = nextId++;
    callbacks.push([id, callback]);
    return id;
  }) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = ((id: number): void => {
    callbacks = callbacks.filter(([current]) => current !== id);
  }) as typeof window.cancelAnimationFrame;

  global.fetch = (() => Promise.reject(new Error('sin red en los tests'))) as typeof fetch;

  const runFrame = () => {
    const pending = callbacks;
    callbacks = [];
    pending.forEach(([, callback]) => callback(ctx.currentTime * 1000));
  };

  return {
    ctx,
    advance: (seconds: number, frames = 10) => {
      const step = seconds / frames;
      for (let i = 0; i < frames; i++) {
        ctx.currentTime += step;
        runFrame();
      }
    },
    restore: () => {
      (window as unknown as { AudioContext: unknown }).AudioContext = originals.AudioContext;
      window.requestAnimationFrame = originals.raf;
      window.cancelAnimationFrame = originals.caf;
      global.fetch = originals.fetch;
    },
  };
}
