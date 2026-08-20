/** Modelo interno de una cancion importada desde un fichero MIDI. */

export type Hand = 'left' | 'right';

export interface SongNote {
  /** Identificador estable, util para el renderer y las estadisticas. */
  id: number;
  midi: number;
  /** Inicio en segundos desde el comienzo de la cancion. */
  time: number;
  /** Duracion en segundos (minimo 30 ms). */
  duration: number;
  /** 0..1 */
  velocity: number;
  track: number;
  hand: Hand;
  /** Compas (1-indexado) en el que empieza la nota. */
  measure: number;
}

export interface SongMeasure {
  number: number;
  time: number;
  duration: number;
  /** Tiempos (beats) del compas, en segundos absolutos. */
  beats: number[];
}

export interface SongTrack {
  index: number;
  name: string;
  instrument: string;
  program: number;
  noteCount: number;
  hand: Hand;
  lowestMidi: number;
  highestMidi: number;
  /** Los canales de percusion (10) se marcan para poder silenciarlos. */
  isDrums: boolean;
}

export interface TempoChange {
  time: number;
  bpm: number;
}

export interface ParsedSong {
  name: string;
  notes: SongNote[];
  measures: SongMeasure[];
  tracks: SongTrack[];
  /** Duracion total en segundos (final de la ultima nota). */
  duration: number;
  bpm: number;
  tempos: TempoChange[];
  timeSignature: [number, number];
  keySignature: string | null;
  lowestMidi: number;
  highestMidi: number;
}
