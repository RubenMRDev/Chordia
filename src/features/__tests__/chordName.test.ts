import {
  chordLabel,
  chordNameFromKeys,
  chordNameFromMidi,
} from '../midi/chordName';

describe('chordNameFromMidi', () => {
  it('names the plain triads', () => {
    expect(chordNameFromMidi([60, 64, 67])).toBe('C'); // C E G
    expect(chordNameFromMidi([57, 60, 64])).toBe('Am'); // A C E
    expect(chordNameFromMidi([53, 57, 60])).toBe('F'); // F A C
    expect(chordNameFromMidi([55, 59, 62])).toBe('G'); // G B D
  });

  it('names diminished and augmented triads', () => {
    expect(chordNameFromMidi([59, 62, 65])).toBe('Bdim'); // B D F
    expect(chordNameFromMidi([60, 64, 68])).toBe('Caug'); // C E G#
  });

  it('names suspended chords', () => {
    expect(chordNameFromMidi([60, 65, 67])).toBe('Csus4'); // C F G
    expect(chordNameFromMidi([60, 62, 67])).toBe('Csus2'); // C D G
  });

  it('names sevenths', () => {
    expect(chordNameFromMidi([60, 64, 67, 71])).toBe('Cmaj7');
    expect(chordNameFromMidi([60, 64, 67, 70])).toBe('C7');
    expect(chordNameFromMidi([60, 63, 67, 70])).toBe('Cm7');
    expect(chordNameFromMidi([59, 62, 65, 69])).toBe('Bm7b5');
  });

  it('ignores octave doubling', () => {
    // The same triad with the root doubled two octaves up.
    expect(chordNameFromMidi([60, 64, 67, 84])).toBe('C');
  });

  it('takes the bass note as the root in root position', () => {
    expect(chordNameFromMidi([60, 64, 67])).toBe('C');
    // The same pitch classes voiced over E is still matched as a known chord
    // rather than refused.
    expect(chordNameFromMidi([64, 67, 72])).not.toBeNull();
  });

  it('names a single note and an open fifth', () => {
    expect(chordNameFromMidi([60])).toBe('C');
    expect(chordNameFromMidi([60, 67])).toBe('C5');
  });

  it('returns null for a set that is not a chord it knows', () => {
    // A chromatic cluster.
    expect(chordNameFromMidi([60, 61, 62, 63, 64, 65])).toBeNull();
  });

  it('returns null for no notes', () => {
    expect(chordNameFromMidi([])).toBeNull();
  });
});

describe('chordNameFromKeys', () => {
  it('reads the note names a saved chord stores', () => {
    expect(chordNameFromKeys(['C4', 'E4', 'G4'])).toBe('C');
    expect(chordNameFromKeys(['A3', 'C4', 'E4'])).toBe('Am');
  });

  it('accepts flats and normalises them to sharps', () => {
    expect(chordNameFromKeys(['Db4', 'F4', 'Ab4'])).toBe('C#');
  });

  it('skips names it cannot parse instead of throwing', () => {
    expect(chordNameFromKeys(['C4', 'nonsense', 'E4', 'G4'])).toBe('C');
  });
});

describe('chordLabel', () => {
  it('uses the symbol when there is one', () => {
    expect(chordLabel(['C4', 'E4', 'G4'])).toBe('C');
  });

  it('falls back to the note letters for an unknown set', () => {
    expect(chordLabel(['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4'])).toBe(
      'C C# D D# E F',
    );
  });

  it('never returns an empty string', () => {
    expect(chordLabel([])).toBe('—');
    expect(chordLabel(['nope'])).toBe('—');
  });
});
