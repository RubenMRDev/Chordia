/**
 * Utilidades de notas / MIDI compartidas por el motor de audio, el parser de
 * ficheros MIDI y el renderer de notas cayendo.
 *
 * Convenciones:
 *  - `midi` es el número de nota MIDI (60 = C4 = Do central).
 *  - Los nombres de nota se normalizan siempre a sostenidos ("C#4", nunca "Db4").
 */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/** Clases de nota que se dibujan como tecla negra. */
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

/** Primera y última tecla de un piano de 88 teclas. */
export const LOWEST_PIANO_MIDI = 21; // A0
export const HIGHEST_PIANO_MIDI = 108; // C8

const FLAT_TO_SHARP: Record<string, string> = {
  DB: 'C#',
  EB: 'D#',
  FB: 'E',
  GB: 'F#',
  AB: 'G#',
  BB: 'A#',
  CB: 'B',
};

export function isBlackKey(midi: number): boolean {
  return BLACK_PITCH_CLASSES.has(((midi % 12) + 12) % 12);
}

export function isWhiteKey(midi: number): boolean {
  return !isBlackKey(midi);
}

export function midiToPitchClass(midi: number): string {
  return NOTE_NAMES[((midi % 12) + 12) % 12];
}

export function midiToOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

/** 60 -> "C4", 61 -> "C#4" */
export function midiToNoteName(midi: number): string {
  return `${midiToPitchClass(midi)}${midiToOctave(midi)}`;
}

/** Nombre para mostrar al usuario (sin octava). */
export function midiToDisplayName(midi: number): string {
  return midiToPitchClass(midi);
}

/**
 * Acepta cualquiera de los formatos que usa la app: "C", "C4", "C#4", "Cs4",
 * "Db3", "c4", "F#-1". Devuelve `null` si no es una nota válida.
 *
 * Cuando el nombre no lleva octava se usa `defaultOctave` (4 por defecto), que
 * es el comportamiento histórico del piano de Chordia.
 */
export function noteNameToMidi(name: string, defaultOctave = 4): number | null {
  if (typeof name !== 'string') return null;
  const cleaned = name.trim().replace(/\s+/g, '');
  if (!cleaned) return null;

  const match = cleaned.match(/^([A-Ga-g])(#{1,2}|s|S|b{1,2}|♯|♭)?(-?\d{1,2})?$/);
  if (!match) return null;

  const letter = match[1].toUpperCase();
  const accidental = (match[2] ?? '').replace('♯', '#').replace('♭', 'b');
  const octave = match[3] !== undefined ? parseInt(match[3], 10) : defaultOctave;

  let pitchClass: number;
  if (accidental === 'b' || accidental === 'bb') {
    const sharp = FLAT_TO_SHARP[`${letter}B`];
    pitchClass = NOTE_NAMES.indexOf((sharp ?? letter) as (typeof NOTE_NAMES)[number]);
    if (accidental === 'bb') pitchClass -= 1;
  } else {
    pitchClass = NOTE_NAMES.indexOf(letter as (typeof NOTE_NAMES)[number]);
    if (accidental === '#' || accidental === 's' || accidental === 'S') pitchClass += 1;
    else if (accidental === '##') pitchClass += 2;
  }

  if (Number.isNaN(pitchClass)) return null;

  const midi = (octave + 1) * 12 + pitchClass;
  if (midi < 0 || midi > 127) return null;
  return midi;
}

/** Igual que `noteNameToMidi` pero permite forzar la octava (API antigua). */
export function noteToMidi(name: string, octave?: number): number | null {
  if (octave === undefined) return noteNameToMidi(name);
  const withoutOctave = name.trim().replace(/-?\d{1,2}$/, '');
  return noteNameToMidi(`${withoutOctave}${octave}`);
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Número de teclas blancas estrictamente por debajo de `midi` desde A0. */
export function whiteKeysBelow(midi: number): number {
  let count = 0;
  for (let n = LOWEST_PIANO_MIDI; n < midi; n++) {
    if (isWhiteKey(n)) count++;
  }
  return count;
}

export function clampToPiano(midi: number): number {
  return Math.min(HIGHEST_PIANO_MIDI, Math.max(LOWEST_PIANO_MIDI, midi));
}

/** Expande un rango de notas hasta bordes de octava (C..B) para dibujar teclado. */
export function expandToOctaveBounds(lowest: number, highest: number): [number, number] {
  const low = clampToPiano(Math.floor(lowest / 12) * 12);
  const high = clampToPiano(Math.ceil((highest + 1) / 12) * 12 - 1);
  return [low, high];
}
