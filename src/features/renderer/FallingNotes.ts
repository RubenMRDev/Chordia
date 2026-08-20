/**
 * Renderer de "notas cayendo" + teclado, dibujado en canvas 2D.
 *
 * Lee el tiempo directamente del Player en cada frame (sin pasar por el estado
 * de React) para que la animacion vaya a 60 fps aunque la UI se re-renderice.
 */

import type { Player } from '../player/Player';
import type { Hand, ParsedSong, SongNote } from '../midi/types';
import {
  expandToOctaveBounds,
  isBlackKey,
  midiToDisplayName,
  midiToNoteName,
  midiToOctave,
} from '../audio/notes';

export interface KeyGeometry {
  midi: number;
  x: number;
  width: number;
  height: number;
  y: number;
  black: boolean;
}

export interface RendererOptions {
  /** Dibuja el nombre de la nota dentro de cada bloque. */
  showNoteNames: boolean;
  /** Dibuja las lineas de compas. */
  showMeasures: boolean;
}

const COLORS = {
  background: '#0a101b',
  panel: '#0f1624',
  measureLine: 'rgba(255,255,255,0.07)',
  measureLabel: 'rgba(255,255,255,0.35)',
  hitLine: 'rgba(255,255,255,0.35)',
  right: { base: '#00E676', dark: '#00a854', text: '#04160b' },
  left: { base: '#38BDF8', dark: '#0d7fb8', text: '#04121a' },
  hit: '#FFFFFF',
  waiting: '#FFD166',
  whiteKey: '#F4F7FB',
  whiteKeyShadow: '#c9d2de',
  blackKey: '#151b26',
};

const MIN_OCTAVES = 3;

export class FallingNotesRenderer {
  private ctx: CanvasRenderingContext2D | null;
  private frame: number | null = null;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private keys: KeyGeometry[] = [];
  private keyboardHeight = 110;
  private range: [number, number] = [48, 84];
  /** Rango del piano del usuario; manda sobre el rango de la cancion. */
  private fixedRange: [number, number] | null = null;
  private songRange: [number, number] = [48, 84];
  private maxNoteDuration = 4;
  private options: RendererOptions = { showNoteNames: true, showMeasures: true };
  private observer: ResizeObserver | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly player: Player,
  ) {
    this.ctx = canvas.getContext('2d');
    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(canvas);
    }
  }

  setOptions(options: Partial<RendererOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /** Recalcula el rango de teclado a partir de la cancion cargada. */
  syncSong(song: ParsedSong | null): void {
    if (!song) {
      this.songRange = [48, 84];
      this.maxNoteDuration = 4;
    } else {
      let [low, high] = expandToOctaveBounds(song.lowestMidi, song.highestMidi);
      // Un rango demasiado estrecho deja teclas gigantes: minimo 3 octavas.
      while ((high - low) / 12 < MIN_OCTAVES) {
        if (low > 21) low -= 12;
        else high += 12;
      }
      this.songRange = [low, high];
      this.maxNoteDuration = song.notes.reduce((max, note) => Math.max(max, note.duration), 1);
    }
    this.applyRange();
  }

  /**
   * Fija el teclado al piano real del usuario. Con `null` se vuelve a usar el
   * rango de la cancion.
   */
  setKeyboardRange(range: [number, number] | null): void {
    this.fixedRange = range;
    this.applyRange();
  }

  private applyRange(): void {
    this.range = this.fixedRange ?? this.songRange;
    this.resize();
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(rect.width, 320);
    this.height = Math.max(rect.height, 240);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx = this.canvas.getContext('2d');
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.keyboardHeight = Math.min(150, Math.max(76, this.height * 0.24));
    this.keys = this.buildKeys();
  }

  private buildKeys(): KeyGeometry[] {
    const [low, high] = this.range;
    const whites: number[] = [];
    for (let midi = low; midi <= high; midi++) {
      if (!isBlackKey(midi)) whites.push(midi);
    }
    if (whites.length === 0) return [];

    const whiteWidth = this.width / whites.length;
    const blackWidth = whiteWidth * 0.62;
    const keyboardTop = this.height - this.keyboardHeight;
    const keys: KeyGeometry[] = [];

    whites.forEach((midi, index) => {
      keys.push({
        midi,
        x: index * whiteWidth,
        width: whiteWidth,
        y: keyboardTop,
        height: this.keyboardHeight,
        black: false,
      });
    });

    for (let midi = low; midi <= high; midi++) {
      if (!isBlackKey(midi)) continue;
      const previousWhite = keys.find((key) => !key.black && key.midi === midi - 1);
      if (!previousWhite) continue;
      keys.push({
        midi,
        x: previousWhite.x + whiteWidth - blackWidth / 2,
        width: blackWidth,
        y: keyboardTop,
        height: this.keyboardHeight * 0.62,
        black: true,
      });
    }

    return keys;
  }

  private keyFor(midi: number): KeyGeometry | undefined {
    return this.keys.find((key) => key.midi === midi);
  }

  /** Devuelve la nota MIDI de la tecla que hay en unas coordenadas del canvas. */
  hitTest(x: number, y: number): number | null {
    const keyboardTop = this.height - this.keyboardHeight;
    if (y < keyboardTop) return null;
    // Las negras estan por encima: se comprueban primero.
    const black = this.keys.find(
      (key) => key.black && x >= key.x && x <= key.x + key.width && y <= key.y + key.height,
    );
    if (black) return black.midi;
    const white = this.keys.find((key) => !key.black && x >= key.x && x <= key.x + key.width);
    return white?.midi ?? null;
  }

  start(): void {
    if (this.frame !== null) return;
    const loop = () => {
      this.frame = requestAnimationFrame(loop);
      this.draw();
    };
    this.frame = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  dispose(): void {
    this.stop();
    this.observer?.disconnect();
    this.observer = null;
  }

  // ------------------------------------------------------------------ dibujo

  draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const song = this.player.getSong();
    const time = this.player.getTime();
    const settings = this.player.getSettings();
    const secondsVisible = Math.max(1.2, settings.secondsVisible);
    const keyboardTop = this.height - this.keyboardHeight;
    const pps = keyboardTop / secondsVisible;

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, this.width, this.height);

    if (song && this.options.showMeasures) this.drawMeasures(ctx, song, time, pps, keyboardTop);

    // Se calcula una vez por frame y no por nota.
    const required = new Set(this.player.requiredNotes());
    const requiredIds = new Set(this.player.requiredNoteIds());
    const waiting = this.player.isWaiting();

    const sounding = new Map<number, Hand>();
    if (song) {
      const notes = this.visibleNotes(song, time, secondsVisible);
      notes.forEach((note) => {
        this.drawNote(ctx, note, {
          midi: this.player.sounding(note.midi),
          time,
          pps,
          keyboardTop,
          speed: settings.speed,
          isUserNote: settings.userHands[note.hand],
          required: waiting && requiredIds.has(note.id),
        });
        if (note.time <= time && note.time + note.duration > time) {
          sounding.set(this.player.sounding(note.midi), note.hand);
        }
      });
    }

    this.drawHitLine(ctx, keyboardTop);
    this.drawKeyboard(ctx, sounding, required);
  }

  private visibleNotes(song: ParsedSong, time: number, secondsVisible: number): SongNote[] {
    const from = time - this.maxNoteDuration;
    const to = time + secondsVisible;
    const notes = song.notes;

    let low = 0;
    let high = notes.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (notes[mid].time < from) low = mid + 1;
      else high = mid;
    }

    const result: SongNote[] = [];
    for (let i = low; i < notes.length && notes[i].time <= to; i++) {
      const note = notes[i];
      if (note.time + note.duration >= time - 0.15) result.push(note);
    }
    return result;
  }

  private drawMeasures(
    ctx: CanvasRenderingContext2D,
    song: ParsedSong,
    time: number,
    pps: number,
    keyboardTop: number,
  ): void {
    ctx.font = '11px Inter, sans-serif';
    song.measures.forEach((measure) => {
      const y = keyboardTop - (measure.time - time) * pps;
      if (y < -20 || y > keyboardTop + 20) return;
      ctx.strokeStyle = COLORS.measureLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
      ctx.fillStyle = COLORS.measureLabel;
      ctx.fillText(String(measure.number), 6, y - 4);
    });
  }

  private drawNote(
    ctx: CanvasRenderingContext2D,
    note: SongNote,
    frame: {
      midi: number;
      time: number;
      pps: number;
      keyboardTop: number;
      speed: number;
      isUserNote: boolean;
      required: boolean;
    },
  ): void {
    const { midi, time, pps, keyboardTop, speed, isUserNote, required } = frame;
    const key = this.keyFor(midi);
    if (!key) return;

    const bottom = keyboardTop - (note.time - time) * pps;
    const rawHeight = note.duration * pps;
    const height = Math.max(rawHeight, 6);
    const top = bottom - height;
    if (bottom < -40 || top > keyboardTop) return;

    const wasHit = this.player.hitNotes.has(note.id);
    const palette = note.hand === 'right' ? COLORS.right : COLORS.left;

    const inset = key.black ? 1.5 : 2.5;
    const x = key.x + inset;
    const width = Math.max(key.width - inset * 2, 4);
    const radius = Math.min(6, width / 2, height / 2);

    // Las notas ya pasadas se apagan; las que faltan por tocar destacan.
    const passed = note.time + note.duration < time;
    ctx.globalAlpha = passed ? 0.25 : 1;

    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    if (wasHit) {
      gradient.addColorStop(0, COLORS.hit);
      gradient.addColorStop(1, palette.base);
    } else {
      gradient.addColorStop(0, palette.base);
      gradient.addColorStop(1, palette.dark);
    }
    ctx.fillStyle = gradient;

    if (required) {
      // Pulso amarillo en las notas que el reproductor esta esperando.
      const pulse = 0.5 + 0.5 * Math.sin(time * 12 * Math.max(speed, 0.25));
      ctx.shadowColor = COLORS.waiting;
      ctx.shadowBlur = 10 + pulse * 14;
    } else if (!passed && isUserNote) {
      ctx.shadowColor = palette.base;
      ctx.shadowBlur = 6;
    }

    this.roundRect(ctx, x, top, width, height, radius);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (required) {
      ctx.strokeStyle = COLORS.waiting;
      ctx.lineWidth = 2;
      this.roundRect(ctx, x, top, width, height, radius);
      ctx.stroke();
    }

    if (this.options.showNoteNames && height > 16 && width > 16) {
      ctx.fillStyle = palette.text;
      ctx.font = `600 ${Math.min(12, Math.floor(width * 0.5))}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(midiToDisplayName(midi), x + width / 2, bottom - 5);
      ctx.textAlign = 'left';
    }

    ctx.globalAlpha = 1;
  }

  private drawHitLine(ctx: CanvasRenderingContext2D, keyboardTop: number): void {
    const gradient = ctx.createLinearGradient(0, keyboardTop - 24, 0, keyboardTop);
    gradient.addColorStop(0, 'rgba(0,230,118,0)');
    gradient.addColorStop(1, 'rgba(0,230,118,0.18)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, keyboardTop - 24, this.width, 24);

    ctx.strokeStyle = COLORS.hitLine;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, keyboardTop + 0.5);
    ctx.lineTo(this.width, keyboardTop + 0.5);
    ctx.stroke();
  }

  private drawKeyboard(
    ctx: CanvasRenderingContext2D,
    sounding: Map<number, Hand>,
    required: Set<number>,
  ): void {
    const pressed = this.player.pressed;

    const colorFor = (midi: number, black: boolean): string => {
      if (pressed.has(midi)) return COLORS.right.base;
      if (required.has(midi)) return COLORS.waiting;
      const hand = sounding.get(midi);
      if (hand) return hand === 'right' ? COLORS.right.base : COLORS.left.base;
      return black ? COLORS.blackKey : COLORS.whiteKey;
    };

    // Blancas.
    this.keys
      .filter((key) => !key.black)
      .forEach((key) => {
        ctx.fillStyle = colorFor(key.midi, false);
        ctx.fillRect(key.x, key.y, key.width - 1, key.height);
        ctx.fillStyle = COLORS.whiteKeyShadow;
        ctx.fillRect(key.x, key.y + key.height - 3, key.width - 1, 3);

        if (key.midi % 12 === 0 && key.width > 18) {
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.font = '10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`C${midiToOctave(key.midi)}`, key.x + key.width / 2, key.y + key.height - 8);
          ctx.textAlign = 'left';
        }
      });

    // Negras encima.
    this.keys
      .filter((key) => key.black)
      .forEach((key) => {
        ctx.fillStyle = colorFor(key.midi, true);
        this.roundRect(ctx, key.x, key.y, key.width, key.height, 3);
        ctx.fill();
      });
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ): void {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /** Rango de teclado que se esta dibujando (para la ayuda del teclado QWERTY). */
  getRange(): [number, number] {
    return this.range;
  }

  /** Nombre completo de una nota, util para tooltips. */
  static noteLabel(midi: number): string {
    return midiToNoteName(midi);
  }
}
