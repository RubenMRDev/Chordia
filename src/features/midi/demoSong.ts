/**
 * Cancion de demostracion generada en codigo (sin ficheros ni descargas), para
 * poder probar el modo de tocar MIDI sin importar nada.
 *
 * "Himno a la alegria" (Beethoven, dominio publico): melodia en la mano derecha
 * y acordes en la izquierda, en dos pistas separadas para que el reparto de
 * manos funcione igual que en un MIDI real.
 */

import { Midi } from '@tonejs/midi';

export const DEMO_SONG_ID = 'builtin-ode-to-joy';
export const DEMO_SONG_NAME = 'Himno a la alegria (demo)';

const BPM = 100;
const BEAT = 60 / BPM;

type Step = [midi: number, beats: number];

// Melodia: E E F G | G F E D | C C D E | E. D D | (x2 con final distinto)
const MELODY: Step[] = [
  [64, 1], [64, 1], [65, 1], [67, 1],
  [67, 1], [65, 1], [64, 1], [62, 1],
  [60, 1], [60, 1], [62, 1], [64, 1],
  [64, 1.5], [62, 0.5], [62, 2],
  [64, 1], [64, 1], [65, 1], [67, 1],
  [67, 1], [65, 1], [64, 1], [62, 1],
  [60, 1], [60, 1], [62, 1], [64, 1],
  [62, 1.5], [60, 0.5], [60, 2],
];

// Acompanamiento: un acorde por compas (dos en el ultimo de cada frase).
const CHORDS: Array<[midis: number[], beats: number]> = [
  [[48, 52, 55], 4],
  [[47, 50, 55], 4],
  [[48, 52, 55], 4],
  [[43, 47, 50], 2],
  [[48, 52, 55], 2],
  [[48, 52, 55], 4],
  [[47, 50, 55], 4],
  [[48, 52, 55], 4],
  [[43, 47, 50], 2],
  [[48, 52, 55], 2],
];

export function buildDemoMidi(): ArrayBuffer {
  const midi = new Midi();
  midi.header.setTempo(BPM);
  midi.header.name = DEMO_SONG_NAME;

  const right = midi.addTrack();
  right.name = 'Mano derecha';
  right.channel = 0;
  let time = 0;
  MELODY.forEach(([note, beats]) => {
    right.addNote({
      midi: note,
      time,
      duration: beats * BEAT * 0.92,
      velocity: 0.78,
    });
    time += beats * BEAT;
  });

  const left = midi.addTrack();
  left.name = 'Mano izquierda';
  left.channel = 1;
  time = 0;
  CHORDS.forEach(([notes, beats]) => {
    notes.forEach((note, index) => {
      left.addNote({
        midi: note,
        time: time + index * 0.008,
        duration: beats * BEAT * 0.96,
        velocity: 0.55,
      });
    });
    time += beats * BEAT;
  });

  return new Uint8Array(midi.toArray()).buffer;
}
