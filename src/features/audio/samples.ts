/**
 * Banco de muestras del piano.
 *
 * Se usa el set completo de Salamander Grand Piano (una muestra cada tercera
 * menor, 31 en total) en vez de las 3 muestras que había antes: así el
 * pitch-shifting nunca supera ±1 semitono y desaparece el efecto "chipmunk"
 * en los extremos del teclado.
 *
 * Las descargas se cachean en la Cache API cuando está disponible, así que a
 * partir de la segunda visita el piano carga sin red.
 */

import { noteNameToMidi } from './notes';

export interface SampleDef {
  /** Nota MIDI real de la muestra. */
  midi: number;
  /** Nombre de fichero (Salamander usa "Ds"/"Fs" en vez de "D#"/"F#"). */
  file: string;
  url: string;
}

export const SALAMANDER_BASE_URL = 'https://tonejs.github.io/audio/salamander/';

const CACHE_NAME = 'chordia-piano-samples-v1';

function buildSampleList(baseUrl: string): SampleDef[] {
  const files: string[] = ['A0'];
  for (let octave = 1; octave <= 7; octave++) {
    files.push(`C${octave}`, `Ds${octave}`, `Fs${octave}`, `A${octave}`);
  }
  files.push('C8');

  return files
    .map((file) => {
      const midi = noteNameToMidi(file.replace('s', '#'));
      return midi === null ? null : { midi, file, url: `${baseUrl}${file}.mp3` };
    })
    .filter((sample): sample is SampleDef => sample !== null)
    .sort((a, b) => a.midi - b.midi);
}

export const SALAMANDER_SAMPLES: SampleDef[] = buildSampleList(SALAMANDER_BASE_URL);

/**
 * Orden de carga: primero lo que está cerca del Do central (lo que el usuario
 * toca en los primeros segundos), después los extremos.
 */
export function loadOrder(samples: SampleDef[], center = 60): SampleDef[] {
  return [...samples].sort((a, b) => Math.abs(a.midi - center) - Math.abs(b.midi - center));
}

async function fetchWithCache(url: string): Promise<ArrayBuffer> {
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(url);
      if (hit) return await hit.arrayBuffer();
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status} al descargar ${url}`);
      // `put` puede fallar (modo privado, cuota): la muestra se usa igualmente.
      try {
        await cache.put(url, response.clone());
      } catch {
        /* cache opcional */
      }
      return await response.arrayBuffer();
    } catch {
      /* cae al fetch directo */
    }
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} al descargar ${url}`);
  return await response.arrayBuffer();
}

export interface LoadProgress {
  loaded: number;
  total: number;
  /** Muestras que fallaron; el motor las suple con la más cercana. */
  failed: number;
}

/**
 * Colección de muestras decodificadas, con búsqueda de la más cercana a una
 * nota dada.
 */
export class SampleBank {
  private buffers = new Map<number, AudioBuffer>();
  private sorted: number[] = [];
  private loading: Promise<void> | null = null;

  constructor(private readonly samples: SampleDef[] = SALAMANDER_SAMPLES) {}

  get size(): number {
    return this.buffers.size;
  }

  get isEmpty(): boolean {
    return this.buffers.size === 0;
  }

  has(midi: number): boolean {
    return this.buffers.has(midi);
  }

  /**
   * Muestra más cercana a `midi` entre las ya cargadas. Devuelve `null` si
   * todavía no hay ninguna (el motor usa el sintetizador de respaldo).
   */
  nearest(midi: number): { buffer: AudioBuffer; midi: number } | null {
    if (this.sorted.length === 0) return null;
    let best = this.sorted[0];
    let bestDistance = Math.abs(best - midi);
    for (let i = 1; i < this.sorted.length; i++) {
      const distance = Math.abs(this.sorted[i] - midi);
      if (distance < bestDistance) {
        best = this.sorted[i];
        bestDistance = distance;
      }
    }
    const buffer = this.buffers.get(best);
    return buffer ? { buffer, midi: best } : null;
  }

  /**
   * Descarga y decodifica todas las muestras. Se puede llamar varias veces: la
   * primera llamada gana y las siguientes esperan a la misma promesa.
   */
  load(ctx: BaseAudioContext, onProgress?: (progress: LoadProgress) => void): Promise<void> {
    if (!this.loading) {
      this.loading = this.loadInternal(ctx, onProgress);
    }
    return this.loading;
  }

  private async loadInternal(
    ctx: BaseAudioContext,
    onProgress?: (progress: LoadProgress) => void,
  ): Promise<void> {
    const queue = loadOrder(this.samples);
    const total = queue.length;
    let loaded = 0;
    let failed = 0;

    // Concurrencia limitada: descargar 31 mp3 a la vez estrangula la red y
    // retrasa justamente las muestras centrales, que son las urgentes.
    const CONCURRENCY = 6;
    let cursor = 0;

    const worker = async (): Promise<void> => {
      while (cursor < queue.length) {
        const sample = queue[cursor++];
        try {
          const raw = await fetchWithCache(sample.url);
          const buffer = await ctx.decodeAudioData(raw);
          this.buffers.set(sample.midi, buffer);
          this.sorted = [...this.buffers.keys()].sort((a, b) => a - b);
          loaded++;
        } catch {
          failed++;
        }
        onProgress?.({ loaded, total, failed });
      }
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, total) }, worker));

    if (this.buffers.size === 0) {
      throw new Error('No se pudo cargar ninguna muestra de piano');
    }
  }
}
