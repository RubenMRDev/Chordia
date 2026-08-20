import { Midi } from '@tonejs/midi';
import { buildDemoMidi } from '../midi/demoSong';
import { parseMidiBuffer, songNameFromFileName } from '../midi/parseMidi';
import { estimateKey, midiToChords } from '../midi/midiToChords';

/** MIDI de una sola pista: melodia aguda + bajo, para probar el corte de manos. */
function buildSingleTrackMidi(): ArrayBuffer {
  const midi = new Midi();
  midi.header.setTempo(120);
  const track = midi.addTrack();
  [
    [72, 0],
    [48, 0],
    [74, 0.5],
    [50, 0.5],
    [76, 1],
    [52, 1],
  ].forEach(([note, time]) => {
    track.addNote({ midi: note, time, duration: 0.45, velocity: 0.8 });
  });
  return new Uint8Array(midi.toArray()).buffer;
}

describe('parseo de ficheros MIDI', () => {
  const song = parseMidiBuffer(buildDemoMidi(), 'ode-to-joy.mid');

  it('lee las notas, el tempo y el compas', () => {
    expect(song.notes.length).toBeGreaterThan(30);
    expect(song.bpm).toBe(100);
    expect(song.timeSignature).toEqual([4, 4]);
    expect(song.duration).toBeCloseTo(19.2, 1); // 32 pulsos a 100 BPM
  });

  it('deja las notas ordenadas por tiempo', () => {
    const times = song.notes.map((note) => note.time);
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });

  it('reparte las manos usando las pistas del fichero', () => {
    const right = song.notes.filter((note) => note.hand === 'right');
    const left = song.notes.filter((note) => note.hand === 'left');
    expect(right.length).toBeGreaterThan(0);
    expect(left.length).toBeGreaterThan(0);
    // La melodia (derecha) esta por encima del acompanamiento (izquierda).
    const averageRight = right.reduce((sum, note) => sum + note.midi, 0) / right.length;
    const averageLeft = left.reduce((sum, note) => sum + note.midi, 0) / left.length;
    expect(averageRight).toBeGreaterThan(averageLeft);
  });

  it('genera compases con sus tiempos', () => {
    expect(song.measures.length).toBeGreaterThan(5);
    expect(song.measures[0].number).toBe(1);
    expect(song.measures[0].beats).toHaveLength(4);
    // A 100 BPM cada compas de 4/4 dura 2.4 s.
    expect(song.measures[1].time - song.measures[0].time).toBeCloseTo(2.4, 2);
  });

  it('asigna a cada nota su compas', () => {
    expect(song.notes[0].measure).toBe(1);
    expect(Math.max(...song.notes.map((note) => note.measure))).toBeLessThanOrEqual(
      song.measures.length,
    );
  });

  it('calcula el rango de teclado de la pieza', () => {
    expect(song.lowestMidi).toBeLessThan(song.highestMidi);
    expect(song.lowestMidi).toBeGreaterThanOrEqual(21);
    expect(song.highestMidi).toBeLessThanOrEqual(108);
  });

  it('separa manos por altura cuando el MIDI tiene una sola pista', () => {
    const single = parseMidiBuffer(buildSingleTrackMidi(), 'una-pista.mid');
    const high = single.notes.filter((note) => note.midi >= 72);
    const low = single.notes.filter((note) => note.midi <= 52);
    expect(high.every((note) => note.hand === 'right')).toBe(true);
    expect(low.every((note) => note.hand === 'left')).toBe(true);
  });

  it('falla con datos que no son un MIDI valido', () => {
    const garbage = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]).buffer;
    expect(() => parseMidiBuffer(garbage, 'roto.mid')).toThrow();
  });

  it('limpia el nombre del fichero', () => {
    expect(songNameFromFileName('mi_cancion-bonita.mid')).toBe('mi cancion bonita');
  });
});

describe('conversion a acordes de Chordia', () => {
  const song = parseMidiBuffer(buildDemoMidi(), 'ode-to-joy.mid');

  it('agrupa notas simultaneas en acordes con octava', () => {
    const chords = midiToChords(song);
    expect(chords.length).toBeGreaterThan(0);
    chords.forEach((chord) => {
      expect(chord.keys.length).toBeGreaterThan(0);
      expect(chord.keys.length).toBeLessThanOrEqual(6);
      chord.keys.forEach((key) => expect(key).toMatch(/^[A-G]#?-?\d$/));
      expect(chord.selected).toBe(true);
    });
  });

  it('respeta el maximo de acordes', () => {
    expect(midiToChords(song, { maxChords: 4 })).toHaveLength(4);
  });

  it('estima la tonalidad', () => {
    expect(estimateKey(song)).toMatch(/^[A-G]#?$/);
  });
});
