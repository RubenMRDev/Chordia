/**
 * Configuracion del piano del usuario: cuantas teclas tiene y en que rango.
 *
 * Se usa para dibujar el teclado del modo MIDI igual que el piano real que
 * tiene delante, y para avisar (o transponer) cuando una pieza se sale de su
 * rango.
 *
 * Se guarda en localStorage siempre, y en el perfil de Firestore cuando hay
 * sesion, para que acompane al usuario en cualquier dispositivo.
 */

import { clampToPiano, midiToNoteName } from '../audio/notes';

export type PianoPresetId = '88' | '76' | '73' | '61' | '49' | '37' | '25' | 'custom';

export interface PianoSettings {
  preset: PianoPresetId;
  lowestMidi: number;
  highestMidi: number;
  /** Baja o sube octavas automaticamente las piezas que no quepan. */
  autoTranspose: boolean;
}

export interface PianoPreset {
  id: Exclude<PianoPresetId, 'custom'>;
  label: string;
  keys: number;
  lowestMidi: number;
  highestMidi: number;
}

/** Rangos estandar de los teclados que se venden. */
export const PIANO_PRESETS: PianoPreset[] = [
  { id: '88', label: '88 teclas (piano completo)', keys: 88, lowestMidi: 21, highestMidi: 108 },
  { id: '76', label: '76 teclas', keys: 76, lowestMidi: 28, highestMidi: 103 },
  { id: '73', label: '73 teclas', keys: 73, lowestMidi: 28, highestMidi: 100 },
  { id: '61', label: '61 teclas (5 octavas)', keys: 61, lowestMidi: 36, highestMidi: 96 },
  { id: '49', label: '49 teclas (4 octavas)', keys: 49, lowestMidi: 36, highestMidi: 84 },
  { id: '37', label: '37 teclas (3 octavas)', keys: 37, lowestMidi: 48, highestMidi: 84 },
  { id: '25', label: '25 teclas (2 octavas)', keys: 25, lowestMidi: 60, highestMidi: 84 },
];

export const DEFAULT_PIANO_SETTINGS: PianoSettings = {
  preset: '88',
  lowestMidi: 21,
  highestMidi: 108,
  autoTranspose: true,
};

const STORAGE_KEY = 'chordia:piano-settings';

function sanitize(input: Partial<PianoSettings> | null | undefined): PianoSettings {
  if (!input) return { ...DEFAULT_PIANO_SETTINGS };

  const preset = PIANO_PRESETS.find((item) => item.id === input.preset);
  if (preset) {
    return {
      preset: preset.id,
      lowestMidi: preset.lowestMidi,
      highestMidi: preset.highestMidi,
      autoTranspose: input.autoTranspose ?? DEFAULT_PIANO_SETTINGS.autoTranspose,
    };
  }

  const low = clampToPiano(Math.round(input.lowestMidi ?? DEFAULT_PIANO_SETTINGS.lowestMidi));
  const high = clampToPiano(Math.round(input.highestMidi ?? DEFAULT_PIANO_SETTINGS.highestMidi));
  // Minimo dos octavas para que el teclado siga siendo dibujable.
  const lowest = Math.min(low, high);
  const highest = Math.max(lowest + 24, Math.max(low, high));

  return {
    preset: 'custom',
    lowestMidi: lowest,
    highestMidi: clampToPiano(highest),
    autoTranspose: input.autoTranspose ?? DEFAULT_PIANO_SETTINGS.autoTranspose,
  };
}

// ------------------------------------------------------------------- almacen

let current: PianoSettings = readStorage();
const listeners = new Set<(settings: PianoSettings) => void>();

function readStorage(): PianoSettings {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_PIANO_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return sanitize(raw ? (JSON.parse(raw) as Partial<PianoSettings>) : null);
  } catch {
    return { ...DEFAULT_PIANO_SETTINGS };
  }
}

function writeStorage(settings: PianoSettings): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* modo privado o cuota llena: no es critico */
  }
}

export function getPianoSettings(): PianoSettings {
  return current;
}

export function setPianoSettings(patch: Partial<PianoSettings>): PianoSettings {
  current = sanitize({ ...current, ...patch });
  writeStorage(current);
  listeners.forEach((listener) => listener(current));
  return current;
}

/** Aplica lo que venga del perfil sin machacar un cambio local mas nuevo. */
export function hydratePianoSettings(settings: Partial<PianoSettings> | undefined | null): void {
  if (!settings) return;
  current = sanitize({ ...current, ...settings });
  writeStorage(current);
  listeners.forEach((listener) => listener(current));
}

export function subscribePianoSettings(listener: (settings: PianoSettings) => void): () => void {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
}

// -------------------------------------------------------------------- utiles

export function keyCount(settings: PianoSettings): number {
  return settings.highestMidi - settings.lowestMidi + 1;
}

export function describeRange(settings: PianoSettings): string {
  return `${midiToNoteName(settings.lowestMidi)} - ${midiToNoteName(settings.highestMidi)}`;
}

export function fitsInPiano(
  settings: PianoSettings,
  lowestMidi: number,
  highestMidi: number,
): boolean {
  return lowestMidi >= settings.lowestMidi && highestMidi <= settings.highestMidi;
}

/**
 * Octavas (en semitonos) que hay que mover una pieza para que quepa mejor en el
 * piano del usuario. Devuelve 0 si ya cabe o si no hay forma de que quepa.
 */
export function suggestTranspose(
  settings: PianoSettings,
  lowestMidi: number,
  highestMidi: number,
): number {
  if (fitsInPiano(settings, lowestMidi, highestMidi)) return 0;

  let best = 0;
  let bestOutside = Number.POSITIVE_INFINITY;
  for (let octave = -3; octave <= 3; octave++) {
    const shift = octave * 12;
    const low = lowestMidi + shift;
    const high = highestMidi + shift;
    const outside =
      Math.max(0, settings.lowestMidi - low) + Math.max(0, high - settings.highestMidi);
    // Ante empates gana el desplazamiento mas pequeno.
    if (outside < bestOutside || (outside === bestOutside && Math.abs(shift) < Math.abs(best))) {
      bestOutside = outside;
      best = shift;
    }
  }
  return best;
}
