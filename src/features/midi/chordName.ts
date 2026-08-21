import { NOTE_NAMES, noteNameToMidi } from '../audio/notes';

/**
 * Names a chord from the notes it contains.
 *
 * A saved Chordia chord is only a set of note names (`["C4", "E4", "G4"]`), so
 * every screen that wanted to *show* a chord had to show the raw notes. This
 * turns the set into the symbol a musician would write: `C`, `Am`, `G7`,
 * `Fmaj7`, `Bdim`.
 *
 * Deliberately simple and deterministic: it tries each pitch present as the
 * root and takes the first quality whose intervals match exactly. No
 * probabilistic guessing, no inversions renamed as slash chords.
 */

/** Interval sets in semitones from the root, ordered so the plainest wins. */
const QUALITIES: { suffix: string; intervals: number[] }[] = [
  { suffix: '', intervals: [0, 4, 7] }, // major
  { suffix: 'm', intervals: [0, 3, 7] }, // minor
  { suffix: 'dim', intervals: [0, 3, 6] },
  { suffix: 'aug', intervals: [0, 4, 8] },
  { suffix: 'sus4', intervals: [0, 5, 7] },
  { suffix: 'sus2', intervals: [0, 2, 7] },
  { suffix: '5', intervals: [0, 7] }, // power chord / open fifth
  { suffix: 'm7', intervals: [0, 3, 7, 10] },
  { suffix: '7', intervals: [0, 4, 7, 10] },
  { suffix: 'maj7', intervals: [0, 4, 7, 11] },
  { suffix: 'mMaj7', intervals: [0, 3, 7, 11] },
  { suffix: '6', intervals: [0, 4, 7, 9] },
  { suffix: 'm6', intervals: [0, 3, 7, 9] },
  { suffix: 'm7b5', intervals: [0, 3, 6, 10] },
  { suffix: 'dim7', intervals: [0, 3, 6, 9] },
  { suffix: '7sus4', intervals: [0, 5, 7, 10] },
  { suffix: 'add9', intervals: [0, 2, 4, 7] },
  { suffix: 'm9', intervals: [0, 2, 3, 7] },
];

const pitchClass = (midi: number): number => ((midi % 12) + 12) % 12;

/** The distinct pitch classes in a set of MIDI notes, ascending. */
const classesOf = (midis: readonly number[]): number[] =>
  [...new Set(midis.map(pitchClass))].sort((a, b) => a - b);

const sameSet = (a: readonly number[], b: readonly number[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

/**
 * The chord symbol for these MIDI notes, or `null` when nothing matches.
 *
 * The lowest sounding note is tried as the root first, so a chord in root
 * position keeps the name a player expects.
 */
export function chordNameFromMidi(midis: readonly number[]): string | null {
  if (midis.length === 0) return null;
  const classes = classesOf(midis);
  if (classes.length === 1) return NOTE_NAMES[classes[0]];

  const lowest = pitchClass(Math.min(...midis));
  // The bass note first, then the rest, so root position wins ties.
  const roots = [lowest, ...classes.filter((value) => value !== lowest)];

  for (const root of roots) {
    const relative = classes
      .map((value) => (value - root + 12) % 12)
      .sort((a, b) => a - b);
    for (const quality of QUALITIES) {
      if (sameSet(relative, quality.intervals)) {
        return `${NOTE_NAMES[root]}${quality.suffix}`;
      }
    }
  }

  return null;
}

/**
 * The chord symbol for a saved Chordia chord, whose `keys` are note names such
 * as `"C4"`. Unparseable names are ignored rather than throwing: a stored
 * progression should never be able to break a page that lists it.
 */
export function chordNameFromKeys(keys: readonly string[]): string | null {
  const midis = keys
    .map((key) => noteNameToMidi(key))
    .filter((midi): midi is number => midi !== null);
  return chordNameFromMidi(midis);
}

/**
 * A short label for a chord, falling back to the note letters when the set is
 * not a chord this table knows. Never returns an empty string, so a card always
 * has something to show.
 */
export function chordLabel(keys: readonly string[]): string {
  const named = chordNameFromKeys(keys);
  if (named) return named;
  const letters = keys
    .map((key) => noteNameToMidi(key))
    .filter((midi): midi is number => midi !== null)
    .map((midi) => NOTE_NAMES[pitchClass(midi)]);
  return [...new Set(letters)].join(' ') || '—';
}
