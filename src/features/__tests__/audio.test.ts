import {
  expandToOctaveBounds,
  isBlackKey,
  midiToFrequency,
  midiToNoteName,
  noteNameToMidi,
  noteToMidi,
} from '../audio/notes';
import { durationToSeconds } from '../audio/time';
import { SALAMANDER_SAMPLES } from '../audio/samples';

describe('conversion de notas', () => {
  it('convierte nota MIDI a nombre', () => {
    expect(midiToNoteName(60)).toBe('C4');
    expect(midiToNoteName(61)).toBe('C#4');
    expect(midiToNoteName(21)).toBe('A0');
    expect(midiToNoteName(108)).toBe('C8');
  });

  it('acepta todos los formatos que usa la app', () => {
    expect(noteNameToMidi('C4')).toBe(60);
    expect(noteNameToMidi('c4')).toBe(60);
    expect(noteNameToMidi('C#4')).toBe(61);
    expect(noteNameToMidi('Cs4')).toBe(61);
    expect(noteNameToMidi('Db4')).toBe(61);
    // Sin octava se asume la 4, como hacia el piano original.
    expect(noteNameToMidi('C')).toBe(60);
    expect(noteNameToMidi('F#')).toBe(66);
  });

  it('respeta la octava que ya trae la nota (bug de acordes anterior)', () => {
    expect(noteNameToMidi('E4')).toBe(64);
    expect(noteNameToMidi('E5')).toBe(76);
    expect(noteNameToMidi('E4')).not.toBe(noteNameToMidi('E5'));
  });

  it('permite forzar la octava solo cuando hace falta', () => {
    expect(noteToMidi('C', 3)).toBe(48);
    expect(noteToMidi('C#', 5)).toBe(73);
  });

  it('rechaza entradas invalidas', () => {
    expect(noteNameToMidi('')).toBeNull();
    expect(noteNameToMidi('H4')).toBeNull();
    expect(noteNameToMidi('hola')).toBeNull();
  });

  it('identifica teclas negras', () => {
    expect(isBlackKey(61)).toBe(true);
    expect(isBlackKey(60)).toBe(false);
  });

  it('afina A4 en 440 Hz', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 5);
    expect(midiToFrequency(57)).toBeCloseTo(220, 5);
  });

  it('expande el rango a octavas completas', () => {
    const [low, high] = expandToOctaveBounds(62, 70);
    expect(midiToNoteName(low)).toBe('C4');
    expect(midiToNoteName(high)).toBe('B4');
  });
});

describe('duraciones musicales', () => {
  it('convierte la notacion de Tone a segundos', () => {
    expect(durationToSeconds('4n', 120)).toBeCloseTo(0.5);
    expect(durationToSeconds('8n', 120)).toBeCloseTo(0.25);
    expect(durationToSeconds('2n', 60)).toBeCloseTo(2);
    expect(durationToSeconds('4n.', 120)).toBeCloseTo(0.75);
    expect(durationToSeconds('8t', 120)).toBeCloseTo(1 / 6);
  });

  it('acepta segundos directos', () => {
    expect(durationToSeconds(1.5)).toBe(1.5);
    expect(durationToSeconds('0.25')).toBe(0.25);
  });
});

describe('banco de muestras', () => {
  it('cubre el piano entero cada tercera menor', () => {
    expect(SALAMANDER_SAMPLES).toHaveLength(30);
    expect(SALAMANDER_SAMPLES[0].midi).toBe(21);
    expect(SALAMANDER_SAMPLES[SALAMANDER_SAMPLES.length - 1].midi).toBe(108);
  });

  it('ninguna nota queda a mas de un semitono de una muestra', () => {
    for (let midi = 21; midi <= 108; midi++) {
      const distance = Math.min(...SALAMANDER_SAMPLES.map((sample) => Math.abs(sample.midi - midi)));
      expect(distance).toBeLessThanOrEqual(1);
    }
  });
});
