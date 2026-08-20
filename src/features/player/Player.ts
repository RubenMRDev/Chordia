/**
 * Reproductor de canciones MIDI, al estilo de Sightread.
 *
 * Ideas principales:
 *  - El tiempo de la cancion se deriva del reloj del AudioContext, no de
 *    setInterval: no hay deriva ni saltos.
 *  - Las notas se programan con antelacion (look-ahead de 200 ms) con tiempos
 *    absolutos de audio, asi que suenan exactas aunque el hilo principal este
 *    ocupado pintando.
 *  - Modo "practicar": las notas de las manos que toca el usuario no suenan
 *    solas y el reloj se congela hasta que las pulsa (en el teclado del
 *    ordenador, con el raton o con un teclado MIDI).
 */

import { pianoEngine } from '../audio/PianoEngine';
import type { ParsedSong, SongNote } from '../midi/types';

export type PlayerStatus = 'stopped' | 'playing' | 'paused' | 'waiting' | 'finished';
export type PlayerMode = 'listen' | 'practice';

export interface HandFlags {
  left: boolean;
  right: boolean;
}

export interface PlayerSettings {
  mode: PlayerMode;
  /** 0.25 .. 2 */
  speed: number;
  /** Manos que reproduce la app. */
  playbackHands: HandFlags;
  /** Manos que toca el usuario (en modo practicar se espera por ellas). */
  userHands: HandFlags;
  metronome: boolean;
  /** Segundos de musica visibles en pantalla (zoom del renderer). */
  secondsVisible: number;
}

export interface PlayerStats {
  hits: number;
  misses: number;
  wrong: number;
  streak: number;
  bestStreak: number;
  /** 0..1 */
  accuracy: number;
}

export interface PlayerSnapshot {
  status: PlayerStatus;
  time: number;
  duration: number;
  measure: number;
  settings: PlayerSettings;
  stats: PlayerStats;
  /** Notas que faltan por pulsar cuando el reproductor esta esperando. */
  requiredNotes: number[];
}

interface WaitGroup {
  time: number;
  notes: SongNote[];
}

interface Beat {
  time: number;
  accent: boolean;
}

/** Ventana para considerar que dos notas forman parte del mismo acorde. */
const CHORD_WINDOW = 0.06;
/** Look-ahead de programacion de audio, en segundos reales. */
const LOOKAHEAD = 0.2;
/** Tolerancia al puntuar una nota tocada fuera del modo espera. */
const HIT_WINDOW = 0.25;

const DEFAULT_SETTINGS: PlayerSettings = {
  mode: 'practice',
  speed: 1,
  playbackHands: { left: true, right: true },
  userHands: { left: false, right: true },
  metronome: false,
  secondsVisible: 4,
};

const EMPTY_STATS: PlayerStats = {
  hits: 0,
  misses: 0,
  wrong: 0,
  streak: 0,
  bestStreak: 0,
  accuracy: 1,
};

function binarySearchTime<T extends { time: number }>(items: T[], time: number): number {
  let low = 0;
  let high = items.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (items[mid].time < time) low = mid + 1;
    else high = mid;
  }
  return low;
}

export class Player {
  private song: ParsedSong | null = null;
  private notes: SongNote[] = [];
  private waitGroups: WaitGroup[] = [];
  private beats: Beat[] = [];

  private status: PlayerStatus = 'stopped';
  private settings: PlayerSettings = { ...DEFAULT_SETTINGS };
  private stats: PlayerStats = { ...EMPTY_STATS };

  private songTime = 0;
  private lastAudioTime = 0;
  private frame: number | null = null;

  private noteCursor = 0;
  private beatCursor = 0;
  private waitIndex = 0;
  private satisfied = new Set<number>();

  /** Notas acertadas / falladas, por id, para colorearlas en el renderer. */
  readonly hitNotes = new Set<number>();
  readonly missedNotes = new Set<number>();
  /** Teclas que el usuario tiene pulsadas ahora mismo. */
  readonly pressed = new Set<number>();

  private listeners = new Set<(snapshot: PlayerSnapshot) => void>();
  private lastNotify = 0;
  private visibilityHandler: (() => void) | null = null;

  // ---------------------------------------------------------------- cancion

  setSong(song: ParsedSong | null): void {
    this.pause();
    this.song = song;
    this.notes = song ? [...song.notes].sort((a, b) => a.time - b.time) : [];
    this.beats = song
      ? song.measures.flatMap((measure) =>
          measure.beats.map((time, index) => ({ time, accent: index === 0 })),
        )
      : [];
    this.rebuildWaitGroups();
    this.songTime = 0;
    this.status = 'stopped';
    this.stats = { ...EMPTY_STATS };
    this.hitNotes.clear();
    this.missedNotes.clear();
    this.resyncCursors();
    this.notify(true);
  }

  getSong(): ParsedSong | null {
    return this.song;
  }

  private rebuildWaitGroups(): void {
    this.waitGroups = [];
    if (!this.song) return;

    const userNotes = this.notes.filter((note) => this.settings.userHands[note.hand]);
    userNotes.forEach((note) => {
      const last = this.waitGroups[this.waitGroups.length - 1];
      if (last && note.time - last.time <= CHORD_WINDOW) {
        last.notes.push(note);
      } else {
        this.waitGroups.push({ time: note.time, notes: [note] });
      }
    });
  }

  // ------------------------------------------------------------------ estado

  subscribe(listener: (snapshot: PlayerSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  snapshot(): PlayerSnapshot {
    return {
      status: this.status,
      time: this.songTime,
      duration: this.song?.duration ?? 0,
      measure: this.currentMeasure(),
      settings: this.settings,
      stats: this.stats,
      requiredNotes: this.requiredNotes(),
    };
  }

  /** El renderer lee el tiempo cada frame (sin pasar por React). */
  getTime(): number {
    return this.songTime;
  }

  getStatus(): PlayerStatus {
    return this.status;
  }

  getSettings(): PlayerSettings {
    return this.settings;
  }

  isWaiting(): boolean {
    return this.status === 'waiting';
  }

  /** Tonos que faltan por pulsar (para resaltar teclas del teclado). */
  requiredNotes(): number[] {
    return this.pendingNotes().map((note) => note.midi);
  }

  /**
   * Ids de las notas concretas que se estan esperando. Hace falta distinguirlas
   * por id y no por tono: si no, todas las notas futuras del mismo tono se
   * pintaban como "te toca esta" y parecia que habia que tocar cuatro.
   */
  requiredNoteIds(): number[] {
    return this.pendingNotes().map((note) => note.id);
  }

  private pendingNotes(): SongNote[] {
    if (this.status !== 'waiting') return [];
    const group = this.waitGroups[this.waitIndex];
    if (!group) return [];
    return group.notes.filter((note) => !this.satisfied.has(note.id));
  }

  private currentMeasure(): number {
    if (!this.song || this.song.measures.length === 0) return 1;
    const index = Math.max(0, binarySearchTime(this.song.measures, this.songTime + 1e-6) - 1);
    return this.song.measures[index]?.number ?? 1;
  }

  private notify(force = false): void {
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    if (!force && now - this.lastNotify < 80) return;
    this.lastNotify = now;
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  // ------------------------------------------------------------- transporte

  async play(): Promise<void> {
    if (!this.song) return;
    await pianoEngine.resume();
    if (this.status === 'finished' || this.songTime >= this.song.duration) this.seek(0);

    this.status = 'playing';
    this.lastAudioTime = pianoEngine.now();
    this.startLoop();
    this.attachVisibilityGuard();
    this.notify(true);
  }

  pause(): void {
    if (this.status === 'playing' || this.status === 'waiting') {
      this.status = 'paused';
    }
    this.stopLoop();
    pianoEngine.allNotesOff(true);
    this.resyncCursors();
    this.notify(true);
  }

  toggle(): void {
    if (this.status === 'playing' || this.status === 'waiting') this.pause();
    else void this.play();
  }

  stop(): void {
    this.pause();
    this.status = 'stopped';
    this.seek(0);
  }

  seek(time: number): void {
    const duration = this.song?.duration ?? 0;
    this.songTime = Math.min(Math.max(time, 0), duration);
    pianoEngine.allNotesOff(true);
    this.lastAudioTime = pianoEngine.now();
    this.resyncCursors();
    if (this.status === 'waiting') this.status = 'playing';
    if (this.status === 'finished') this.status = 'paused';
    this.notify(true);
  }

  /** Salta al compas indicado (1-indexado). */
  seekToMeasure(measureNumber: number): void {
    const measure = this.song?.measures.find((item) => item.number === measureNumber);
    if (measure) this.seek(measure.time);
  }

  private resyncCursors(): void {
    this.noteCursor = binarySearchTime(this.notes, this.songTime);
    this.beatCursor = binarySearchTime(this.beats, this.songTime);
    this.waitIndex = binarySearchTime(this.waitGroups, this.songTime - CHORD_WINDOW);
    this.satisfied.clear();
  }

  private startLoop(): void {
    if (this.frame !== null) return;
    const loop = () => {
      this.frame = requestAnimationFrame(loop);
      this.tick();
    };
    this.frame = requestAnimationFrame(loop);
  }

  private stopLoop(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  /** Con la pestana oculta rAF se detiene, asi que se pausa para no desincronizar. */
  private attachVisibilityGuard(): void {
    if (this.visibilityHandler || typeof document === 'undefined') return;
    this.visibilityHandler = () => {
      if (document.hidden && (this.status === 'playing' || this.status === 'waiting')) this.pause();
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  // ------------------------------------------------------------------- bucle

  private tick(): void {
    const song = this.song;
    if (!song) return;

    const audioNow = pianoEngine.now();
    const delta = Math.max(0, audioNow - this.lastAudioTime);
    this.lastAudioTime = audioNow;

    if (this.status === 'playing') {
      this.songTime += delta * this.settings.speed;
    }

    if (this.settings.mode === 'practice') this.updateWaitState();

    if (this.status === 'playing') {
      this.schedule(audioNow);
      if (this.songTime >= song.duration) {
        this.songTime = song.duration;
        this.status = 'finished';
        this.stopLoop();
        pianoEngine.allNotesOff();
        this.notify(true);
        return;
      }
    }

    this.notify();
  }

  private shouldAutoPlay(note: SongNote): boolean {
    if (!this.settings.playbackHands[note.hand]) return false;
    if (this.settings.mode === 'practice' && this.settings.userHands[note.hand]) return false;
    return true;
  }

  private schedule(audioNow: number): void {
    let horizon = this.songTime + LOOKAHEAD * this.settings.speed;

    // En modo practicar no se programa nada mas alla del punto de espera: si no,
    // sonarian notas que aun no toca reproducir.
    if (this.settings.mode === 'practice') {
      const next = this.waitGroups[this.waitIndex];
      if (next) horizon = Math.min(horizon, next.time - 1e-4);
    }

    while (this.noteCursor < this.notes.length && this.notes[this.noteCursor].time <= horizon) {
      const note = this.notes[this.noteCursor++];
      if (!this.shouldAutoPlay(note)) continue;
      const when = audioNow + (note.time - this.songTime) / this.settings.speed;
      pianoEngine.scheduleNote(
        note.midi,
        note.velocity,
        Math.max(when, audioNow),
        note.duration / this.settings.speed,
      );
    }

    if (this.settings.metronome) {
      while (this.beatCursor < this.beats.length && this.beats[this.beatCursor].time <= horizon) {
        const beat = this.beats[this.beatCursor++];
        const when = audioNow + (beat.time - this.songTime) / this.settings.speed;
        pianoEngine.click(Math.max(when, audioNow), beat.accent);
      }
    } else {
      this.beatCursor = binarySearchTime(this.beats, this.songTime);
    }
  }

  /** Congela el reloj cuando toca al usuario y lo suelta cuando acierta. */
  private updateWaitState(): void {
    const group = this.waitGroups[this.waitIndex];
    if (!group) return;

    if (this.status === 'playing' && this.songTime >= group.time - 1e-3) {
      this.songTime = group.time;
      this.status = 'waiting';
      this.satisfied.clear();
      // Las notas ya pulsadas y mantenidas cuentan como acertadas.
      group.notes.forEach((note) => {
        if (this.pressed.has(note.midi)) this.registerHit(note);
      });
      this.notify(true);
    }

    if (this.status === 'waiting' && group.notes.every((note) => this.satisfied.has(note.id))) {
      this.waitIndex++;
      this.satisfied.clear();
      this.status = 'playing';
      this.lastAudioTime = pianoEngine.now();
      this.notify(true);
    }
  }

  private registerHit(note: SongNote): void {
    if (this.satisfied.has(note.id)) return;
    this.satisfied.add(note.id);
    this.hitNotes.add(note.id);
    this.missedNotes.delete(note.id);
    this.stats = {
      ...this.stats,
      hits: this.stats.hits + 1,
      streak: this.stats.streak + 1,
      bestStreak: Math.max(this.stats.bestStreak, this.stats.streak + 1),
    };
    this.recomputeAccuracy();
  }

  private registerWrong(): void {
    this.stats = { ...this.stats, wrong: this.stats.wrong + 1, streak: 0 };
    this.recomputeAccuracy();
  }

  private recomputeAccuracy(): void {
    const total = this.stats.hits + this.stats.wrong + this.stats.misses;
    this.stats = { ...this.stats, accuracy: total === 0 ? 1 : this.stats.hits / total };
  }

  // ------------------------------------------------------------ entrada real

  /**
   * Tecla pulsada por el usuario (MIDI, raton o teclado del ordenador).
   * Suena siempre y, si hay cancion cargada, se puntua.
   */
  keyDown(midi: number, velocity = 0.75): void {
    this.pressed.add(midi);
    pianoEngine.noteOn(midi, velocity);

    if (!this.song) return;

    if (this.status === 'waiting') {
      const group = this.waitGroups[this.waitIndex];
      const target = group?.notes.find((note) => note.midi === midi && !this.satisfied.has(note.id));
      if (target) {
        this.registerHit(target);
        this.updateWaitState();
      } else if (group) {
        this.registerWrong();
      }
      this.notify(true);
      return;
    }

    if (this.status === 'playing') {
      // Fuera del modo espera se puntua por proximidad temporal.
      const candidate = this.notes.find(
        (note) =>
          note.midi === midi &&
          this.settings.userHands[note.hand] &&
          Math.abs(note.time - this.songTime) <= HIT_WINDOW &&
          !this.hitNotes.has(note.id),
      );
      if (candidate) this.registerHit(candidate);
      else this.registerWrong();
      this.notify(true);
    }
  }

  keyUp(midi: number): void {
    this.pressed.delete(midi);
    pianoEngine.noteOff(midi);
  }

  setSustain(down: boolean): void {
    pianoEngine.setSustain(down);
  }

  // ----------------------------------------------------------------- ajustes

  updateSettings(patch: Partial<PlayerSettings>): void {
    const previous = this.settings;
    this.settings = {
      ...previous,
      ...patch,
      playbackHands: { ...previous.playbackHands, ...(patch.playbackHands ?? {}) },
      userHands: { ...previous.userHands, ...(patch.userHands ?? {}) },
    };

    const handsChanged =
      JSON.stringify(previous.userHands) !== JSON.stringify(this.settings.userHands);
    if (handsChanged) this.rebuildWaitGroups();

    // Cambiar velocidad, manos o modo invalida lo ya programado.
    pianoEngine.allNotesOff(true);
    this.resyncCursors();
    if (this.status === 'waiting') this.status = 'playing';
    this.lastAudioTime = pianoEngine.now();
    this.notify(true);
  }

  resetStats(): void {
    this.stats = { ...EMPTY_STATS };
    this.hitNotes.clear();
    this.missedNotes.clear();
    this.notify(true);
  }

  dispose(): void {
    this.stopLoop();
    pianoEngine.allNotesOff(true);
    if (this.visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    this.listeners.clear();
  }
}
