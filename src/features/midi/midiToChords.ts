/**
 * Conversion de un MIDI importado al modelo de cancion de Chordia
 * (progresion de acordes), para poder guardarlo en la biblioteca de siempre
 * y usarlo con el resto de la app.
 *
 * Estrategia: se agrupan las notas que empiezan casi a la vez (ventana de
 * cuantizacion) y cada grupo se convierte en un acorde. Los grupos de una sola
 * nota se fusionan con el acorde anterior cuando caen dentro del mismo pulso,
 * para no acabar con cientos de "acordes" de una nota en piezas melodicas.
 */

import type { ChordType } from '../../firebase/songService';
import { midiToNoteName } from '../audio/notes';
import type { ParsedSong } from './types';

export interface MidiToChordsOptions {
  /** Ventana en segundos para considerar dos notas simultaneas. */
  quantize?: number;
  /** Maximo de notas por acorde. */
  maxNotesPerChord?: number;
  /** Numero maximo de acordes a generar. */
  maxChords?: number;
  /** Manos a incluir. */
  hands?: Array<'left' | 'right'>;
}

const KEY_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Estimacion sencilla de la tonalidad por frecuencia de clases de nota. */
export function estimateKey(song: ParsedSong): string {
  if (song.keySignature) return song.keySignature.split(' ')[0] || 'C';
  const histogram = new Array(12).fill(0);
  song.notes.forEach((note) => {
    histogram[note.midi % 12] += note.duration;
  });
  const best = histogram.indexOf(Math.max(...histogram));
  return KEY_NAMES[best] ?? 'C';
}

export function midiToChords(song: ParsedSong, options: MidiToChordsOptions = {}): ChordType[] {
  const quantize = options.quantize ?? 0.09;
  const maxNotes = options.maxNotesPerChord ?? 6;
  const maxChords = options.maxChords ?? 200;
  const hands = options.hands ?? ['left', 'right'];

  const notes = song.notes
    .filter((note) => hands.includes(note.hand))
    .sort((a, b) => a.time - b.time || a.midi - b.midi);

  if (notes.length === 0) return [];

  const beat = 60 / (song.bpm || 120);
  const groups: Array<{ time: number; midis: number[] }> = [];

  notes.forEach((note) => {
    const last = groups[groups.length - 1];
    if (last && note.time - last.time <= quantize) {
      if (!last.midis.includes(note.midi)) last.midis.push(note.midi);
      return;
    }
    // Notas sueltas muy pegadas al grupo anterior: se suman a el en vez de
    // crear un acorde nuevo por cada corchea de la melodia.
    if (last && last.midis.length < maxNotes && note.time - last.time < beat * 0.5) {
      if (!last.midis.includes(note.midi)) last.midis.push(note.midi);
      return;
    }
    groups.push({ time: note.time, midis: [note.midi] });
  });

  return groups.slice(0, maxChords).map((group) => ({
    keys: [...new Set(group.midis)]
      .sort((a, b) => a - b)
      .slice(0, maxNotes)
      .map((midi) => midiToNoteName(midi)),
    selected: true,
  }));
}
