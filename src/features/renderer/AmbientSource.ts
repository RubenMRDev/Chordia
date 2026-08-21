import type { ParsedSong } from '../midi/types';
import type { PlayerSettings } from '../player/Player';
import type { RendererSource } from './FallingNotes';

const SETTINGS: PlayerSettings = {
  mode: 'listen',
  speed: 1,
  playbackHands: { left: true, right: true },
  userHands: { left: false, right: false },
  metronome: false,
  secondsVisible: 4.5,
  transpose: 0,
};

/**
 * Drives the real falling-notes renderer from the wall clock instead of the
 * audio clock, and loops.
 *
 * The home page has to show the instrument working before the visitor has
 * clicked anything. `Player` cannot do that: its clock is
 * `AudioContext.currentTime`, which stays frozen until a browser gesture
 * unsuspends the context, so an autoplaying `Player` would render a still
 * frame and read as a broken page. This keeps the exact renderer, geometry and
 * palette, and only replaces the clock — no second copy of the drawing code.
 *
 * It makes no sound and never touches the audio engine.
 */
export class AmbientSource implements RendererSource {
  readonly hitNotes: ReadonlySet<number> = new Set();

  private readonly pressedKeys = new Set<number>();

  private song: ParsedSong | null = null;

  private startedAt = 0;

  private paused = true;

  private pausedAt = 0;

  /** Seconds of silence before the loop starts over. */
  private readonly tailPause: number;

  constructor(private readonly now: () => number = () => performance.now(), tailPause = 1.5) {
    this.tailPause = tailPause;
  }

  get pressed(): ReadonlySet<number> {
    return this.pressedKeys;
  }

  setSong(song: ParsedSong | null): void {
    this.song = song;
    this.startedAt = this.now();
  }

  /**
   * Parks the clock at a fixed point. Used for the still frame shown under
   * `prefers-reduced-motion`: at time zero nothing has entered the screen yet,
   * so a frame from a couple of seconds in is the one that actually shows notes
   * falling towards the keys.
   */
  seek(seconds: number): void {
    this.pausedAt = Math.max(0, seconds);
    this.paused = true;
  }

  getSong(): ParsedSong | null {
    return this.song;
  }

  getSettings(): PlayerSettings {
    return SETTINGS;
  }

  start(): void {
    if (!this.paused) return;
    // Resume where it left off rather than jumping back to the top.
    this.startedAt = this.now() - this.pausedAt * 1000;
    this.paused = false;
  }

  stop(): void {
    if (this.paused) return;
    this.pausedAt = this.getTime();
    this.paused = true;
  }

  getTime(): number {
    if (!this.song) return 0;
    if (this.paused) return this.pausedAt;
    const span = this.song.duration + this.tailPause;
    const elapsed = (this.now() - this.startedAt) / 1000;
    return elapsed % span;
  }

  /**
   * The renderer asks this to light a key. Reporting the notes sounding right
   * now is what makes the keyboard under the hero light up in time with the
   * falling blocks.
   */
  sounding(midi: number): number {
    return midi;
  }

  isWaiting(): boolean {
    return false;
  }

  requiredNoteIds(): number[] {
    return [];
  }

  requiredNotes(): number[] {
    // Nothing is expected of the visitor here, so no key is marked amber.
    return [];
  }

  /** Which notes are sounding at `time`, for anything drawing outside canvas. */
  activeNotes(): { midi: number; hand: 'left' | 'right' }[] {
    if (!this.song) return [];
    const time = this.getTime();
    const active: { midi: number; hand: 'left' | 'right' }[] = [];
    for (const note of this.song.notes) {
      if (note.time > time) break;
      if (note.time + note.duration >= time) {
        active.push({ midi: note.midi, hand: note.hand });
      }
    }
    return active;
  }
}
