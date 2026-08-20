/**
 * Lectura de ficheros MIDI (.mid/.midi) al modelo interno de Chordia.
 *
 * Se apoya en @tonejs/midi para el parseo binario y anade lo que hace falta
 * para tocarlo tipo Sightread: reparto de manos, compases con sus tiempos y
 * rango de teclado real de la pieza.
 */

import { Midi } from '@tonejs/midi';
import type { Hand, ParsedSong, SongMeasure, SongNote, SongTrack } from './types';
import { clampToPiano } from '../audio/notes';

const MIN_NOTE_DURATION = 0.03;

/** Nombre legible a partir del nombre de fichero. */
export function songNameFromFileName(fileName: string): string {
  return fileName
    .replace(/\.(mid|midi|kar)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildMeasures(midi: Midi, duration: number): SongMeasure[] {
  const ppq = midi.header.ppq || 480;
  const signatures =
    midi.header.timeSignatures.length > 0
      ? [...midi.header.timeSignatures].sort((a, b) => a.ticks - b.ticks)
      : [{ ticks: 0, timeSignature: [4, 4] as number[] }];

  const endTicks = Math.max(midi.header.secondsToTicks(duration + 0.001), ppq);
  const measures: SongMeasure[] = [];
  let measureNumber = 1;

  for (let i = 0; i < signatures.length; i++) {
    const current = signatures[i];
    const [numerator, denominator] = current.timeSignature;
    const beatTicks = (ppq * 4) / (denominator || 4);
    const measureTicks = beatTicks * (numerator || 4);
    const until = i + 1 < signatures.length ? signatures[i + 1].ticks : endTicks;

    for (let ticks = current.ticks; ticks < until; ticks += measureTicks) {
      const time = midi.header.ticksToSeconds(ticks);
      const end = midi.header.ticksToSeconds(ticks + measureTicks);
      const beats: number[] = [];
      for (let beat = 0; beat < (numerator || 4); beat++) {
        beats.push(midi.header.ticksToSeconds(ticks + beat * beatTicks));
      }
      measures.push({ number: measureNumber++, time, duration: Math.max(end - time, 0.05), beats });
      // Ficheros corruptos con measureTicks == 0 colgarian el bucle.
      if (measureTicks <= 0) break;
    }
  }

  return measures;
}

function measureIndexAt(measures: SongMeasure[], time: number): number {
  let low = 0;
  let high = measures.length - 1;
  let result = 0;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (measures[mid].time <= time + 1e-6) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}

/**
 * Reparto de manos, en el mismo espiritu que Sightread:
 *  - Si hay exactamente dos pistas con notas, la mas aguda es la derecha.
 *  - Si hay una sola pista, se separa por altura alrededor de un umbral
 *    calculado con la mediana (mas fiable que fijar el Do central).
 *  - Con mas pistas, cada una va a la mano segun su altura media.
 */
function assignHands(notes: SongNote[], trackAverages: Map<number, number>): void {
  const tracksWithNotes = [...trackAverages.keys()];

  if (tracksWithNotes.length === 1) {
    const pitches = notes.map((note) => note.midi).sort((a, b) => a - b);
    const median = pitches[Math.floor(pitches.length / 2)] ?? 60;
    const split = Math.min(72, Math.max(52, median));
    notes.forEach((note) => {
      note.hand = note.midi >= split ? 'right' : 'left';
    });
    return;
  }

  if (tracksWithNotes.length === 2) {
    const [first, second] = tracksWithNotes;
    const rightTrack = (trackAverages.get(first) ?? 0) >= (trackAverages.get(second) ?? 0) ? first : second;
    notes.forEach((note) => {
      note.hand = note.track === rightTrack ? 'right' : 'left';
    });
    return;
  }

  const allAverages = [...trackAverages.values()].sort((a, b) => a - b);
  const middle = allAverages[Math.floor(allAverages.length / 2)] ?? 60;
  notes.forEach((note) => {
    const average = trackAverages.get(note.track) ?? note.midi;
    note.hand = average >= middle ? 'right' : 'left';
  });
}

export function parseMidiBuffer(data: ArrayBuffer, fileName = 'Sin titulo'): ParsedSong {
  const midi = new Midi(data);

  const notes: SongNote[] = [];
  const trackAverages = new Map<number, number>();
  const tracks: SongTrack[] = [];
  let noteId = 0;

  midi.tracks.forEach((track, index) => {
    if (track.notes.length === 0) return;

    let sum = 0;
    let lowest = 127;
    let highest = 0;

    track.notes.forEach((note) => {
      const midiNote = clampToPiano(note.midi);
      sum += midiNote;
      lowest = Math.min(lowest, midiNote);
      highest = Math.max(highest, midiNote);
      notes.push({
        id: noteId++,
        midi: midiNote,
        time: note.time,
        duration: Math.max(note.duration, MIN_NOTE_DURATION),
        velocity: note.velocity > 0 ? note.velocity : 0.7,
        track: index,
        hand: 'right',
        measure: 1,
      });
    });

    trackAverages.set(index, sum / track.notes.length);
    tracks.push({
      index,
      name: track.name?.trim() || `Pista ${index + 1}`,
      instrument: track.instrument?.name ?? 'acoustic grand piano',
      program: track.instrument?.number ?? 0,
      noteCount: track.notes.length,
      hand: 'right',
      lowestMidi: lowest,
      highestMidi: highest,
      isDrums: track.instrument?.percussion === true || track.channel === 9,
    });
  });

  if (notes.length === 0) {
    throw new Error('El fichero MIDI no contiene notas reproducibles');
  }

  notes.sort((a, b) => a.time - b.time || a.midi - b.midi);
  assignHands(notes, trackAverages);

  // La mano de la pista se deduce de sus notas (para los filtros de la UI).
  tracks.forEach((track) => {
    const trackNotes = notes.filter((note) => note.track === track.index);
    const rightCount = trackNotes.filter((note) => note.hand === 'right').length;
    track.hand = rightCount * 2 >= trackNotes.length ? 'right' : 'left';
  });

  const duration = notes.reduce((max, note) => Math.max(max, note.time + note.duration), 0);
  const measures = buildMeasures(midi, duration);
  notes.forEach((note) => {
    note.measure = measures[measureIndexAt(measures, note.time)]?.number ?? 1;
  });

  const tempos = midi.header.tempos.map((tempo) => ({
    time: midi.header.ticksToSeconds(tempo.ticks),
    bpm: tempo.bpm,
  }));
  const firstSignature = midi.header.timeSignatures[0]?.timeSignature ?? [4, 4];
  const keySignature = midi.header.keySignatures[0]
    ? `${midi.header.keySignatures[0].key} ${midi.header.keySignatures[0].scale}`
    : null;

  return {
    name: midi.name?.trim() || songNameFromFileName(fileName),
    notes,
    measures,
    tracks,
    duration,
    bpm: Math.round(tempos[0]?.bpm ?? 120),
    tempos: tempos.length > 0 ? tempos : [{ time: 0, bpm: 120 }],
    timeSignature: [firstSignature[0] ?? 4, firstSignature[1] ?? 4],
    keySignature,
    lowestMidi: notes.reduce((min, note) => Math.min(min, note.midi), 127),
    highestMidi: notes.reduce((max, note) => Math.max(max, note.midi), 0),
  };
}

export async function parseMidiFile(file: File): Promise<ParsedSong> {
  const buffer = await file.arrayBuffer();
  return parseMidiBuffer(buffer, file.name);
}

/** Notas de una mano concreta. */
export function notesForHands(song: ParsedSong, hands: Hand[]): SongNote[] {
  return song.notes.filter((note) => hands.includes(note.hand));
}
