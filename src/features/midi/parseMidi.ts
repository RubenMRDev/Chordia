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

/**
 * Muchos MIDI traen un nombre interno inutil ("control track" en los que genera
 * LilyPond), asi que en esos casos es mejor el nombre del fichero.
 */
const JUNK_NAMES = /^(control ?track|untitled|midi|track ?\d*|new ?song)$/i;

/** Nombre legible a partir del nombre de fichero. */
export function songNameFromFileName(fileName: string): string {
  return fileName
    .replace(/\.(mid|midi|kar)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function usableName(name: string | undefined): string | null {
  const trimmed = name?.trim() ?? '';
  if (!trimmed || JUNK_NAMES.test(trimmed)) return null;
  return trimmed;
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

/**
 * Quita notas duplicadas en la misma tecla y el mismo instante.
 *
 * Varios exports (MuseScore entre otros) dejan pares note-on/note-off de
 * duracion cero pegados a la nota real: se oian como un golpe doble en esa
 * tecla y con el doble de volumen. Se queda la nota mas larga.
 */
function dropDuplicateNotes(notes: SongNote[]): SongNote[] {
  const DUPLICATE_WINDOW = 0.02;
  const result: SongNote[] = [];
  const lastByPitch = new Map<number, SongNote>();

  for (const note of notes) {
    const previous = lastByPitch.get(note.midi);
    if (previous && note.time - previous.time <= DUPLICATE_WINDOW) {
      previous.duration = Math.max(previous.duration, note.duration);
      previous.velocity = Math.max(previous.velocity, note.velocity);
      continue;
    }
    lastByPitch.set(note.midi, note);
    result.push(note);
  }

  return result;
}

/**
 * Aplica el pedal de sustain (CC64) alargando las notas hasta que se suelta.
 *
 * Sin esto, las piezas que dependen del pedal (la Sonata Claro de Luna es el
 * ejemplo tipico) sonaban secas y cortadas: cada nota moria en su duracion
 * nominal en vez de seguir resonando. Se corta la prolongacion cuando la misma
 * tecla se vuelve a pulsar, que es lo que hace el apagador de verdad.
 */
function applySustainPedal(notes: SongNote[], pedal: Array<{ time: number; value: number }>): void {
  if (pedal.length === 0) return;

  const events = [...pedal].sort((a, b) => a.time - b.time);
  const segments: Array<[number, number]> = [];
  let downAt: number | null = null;
  for (const event of events) {
    const down = event.value >= 0.5;
    if (down && downAt === null) downAt = event.time;
    else if (!down && downAt !== null) {
      segments.push([downAt, event.time]);
      downAt = null;
    }
  }
  if (downAt !== null) segments.push([downAt, Number.POSITIVE_INFINITY]);
  if (segments.length === 0) return;

  const nextSamePitch = new Map<number, number>();
  const MAX_EXTENSION = 10;

  // De atras adelante para saber cuando vuelve a sonar cada tecla.
  for (let i = notes.length - 1; i >= 0; i--) {
    const note = notes[i];
    const nextStart = nextSamePitch.get(note.midi) ?? Number.POSITIVE_INFINITY;
    nextSamePitch.set(note.midi, note.time);

    const end = note.time + note.duration;
    const segment = segments.find(([start, stop]) => end >= start - 1e-6 && end < stop);
    if (!segment) continue;

    const limit = Math.min(segment[1], nextStart, note.time + MAX_EXTENSION);
    if (limit > end) note.duration = limit - note.time;
  }
}

export function parseMidiBuffer(data: ArrayBuffer, fileName = 'Sin titulo'): ParsedSong {
  const midi = new Midi(data);

  const notes: SongNote[] = [];
  const trackAverages = new Map<number, number>();
  const tracks: SongTrack[] = [];
  const pedal: Array<{ time: number; value: number }> = [];
  let noteId = 0;

  midi.tracks.forEach((track, index) => {
    (track.controlChanges[64] ?? []).forEach((change) => {
      pedal.push({ time: change.time ?? 0, value: change.value ?? 0 });
    });
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
  const cleaned = dropDuplicateNotes(notes);
  notes.length = 0;
  notes.push(...cleaned);
  applySustainPedal(notes, pedal);
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
    name: usableName(midi.name) ?? songNameFromFileName(fileName),
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
