import { installFakeAudio, type FakeClock } from './fakeAudio';
import { PianoEngine } from '../audio/PianoEngine';
import pianoService from '../../services/pianoService';

describe('motor de piano', () => {
  let clock: FakeClock;
  let engine: PianoEngine;

  beforeEach(() => {
    clock = installFakeAudio();
    engine = new PianoEngine();
  });

  afterEach(() => {
    engine.dispose();
    clock.restore();
  });

  it('suena sin muestras usando el sintetizador de respaldo', async () => {
    // El fetch falso falla, asi que la carga acaba en modo sintetizador.
    await engine.load();
    expect(engine.getState().status).toBe('synth');
    expect(engine.isReady()).toBe(true);
  });

  it('mantiene una voz por nota pulsada y la suelta al levantar', () => {
    engine.noteOn(60, 0.8);
    engine.noteOn(64, 0.8);
    expect(engine.activeNotes().sort((a, b) => a - b)).toEqual([60, 64]);

    engine.noteOff(60);
    expect(engine.activeNotes()).toEqual([64]);
  });

  it('el pedal de sustain mantiene la nota tras soltar la tecla', () => {
    engine.setSustain(true);
    engine.noteOn(60, 0.8);
    engine.noteOff(60);
    // Con el pedal pisado la nota sigue sonando.
    expect(engine.activeNotes()).toEqual([60]);

    engine.setSustain(false);
    expect(engine.activeNotes()).toEqual([]);
  });

  it('allNotesOff corta todo', () => {
    [48, 55, 60, 64].forEach((midi) => engine.noteOn(midi, 0.7));
    expect(engine.activeNotes()).toHaveLength(4);
    engine.allNotesOff(true);
    expect(engine.activeNotes()).toHaveLength(0);
  });

  it('limita la polifonia robando voces', () => {
    for (let midi = 21; midi <= 100; midi++) engine.noteOn(midi, 0.6);
    // El maximo son 48 voces activas.
    expect(engine.activeNotes().length).toBeLessThanOrEqual(48);
  });

  it('respeta volumen y reverb', () => {
    engine.setVolume(0.4);
    expect(engine.getVolume()).toBeCloseTo(0.4, 5);
    engine.setVolume(5);
    expect(engine.getVolume()).toBe(1);
    engine.setReverb(0.5);
    expect(engine.getReverb()).toBeCloseTo(0.5, 5);
  });

  it('programa notas con duracion y hace clicks de metronomo', () => {
    expect(() => engine.scheduleNote(60, 0.8, engine.now() + 0.1, 0.5)).not.toThrow();
    expect(() => engine.click(engine.now(), true)).not.toThrow();
    expect(() => engine.click()).not.toThrow();
  });

  it('avisa a los suscriptores del estado de carga', async () => {
    const states: string[] = [];
    const unsubscribe = engine.subscribe((state) => states.push(state.status));
    await engine.load();
    unsubscribe();
    expect(states[0]).toBe('idle');
    expect(states).toContain('loading');
    expect(states[states.length - 1]).toBe('synth');
  });
});

describe('fachada pianoService', () => {
  let clock: FakeClock;

  beforeEach(() => {
    clock = installFakeAudio();
  });

  afterEach(() => {
    pianoService.stopAllNotes();
    clock.restore();
  });

  it('normaliza notas respetando la octava', () => {
    expect(pianoService.toMidi('C4')).toBe(60);
    expect(pianoService.toMidi('E4')).toBe(64);
    expect(pianoService.toMidi('Cs5')).toBe(73);
    expect(pianoService.toMidi('C', 3)).toBe(48);
    expect(pianoService.normalizeNote('Db4')).toBe('C#4');
    expect(pianoService.toMidi('no-es-nota')).toBeNull();
  });

  it('toca un acorde con las notas en su octava real', async () => {
    await pianoService.playChord(['C4', 'E4', 'G4'], '4n', 0.6);
    // Las tres notas suenan a la vez, no las tres en C4 como antes.
    expect(pianoService.activeNotes().sort((a, b) => a - b)).toEqual([60, 64, 67]);
  });

  it('mantiene la API de attack/release por nombre de nota', () => {
    pianoService.triggerAttack('F#', 0.8, 3);
    expect(pianoService.activeNotes()).toContain(54);
    pianoService.triggerRelease('F#', 3);
    expect(pianoService.activeNotes()).not.toContain(54);
  });

  it('acepta volumen en 0..1 y en dB negativos', () => {
    pianoService.setVolume(0.5);
    expect(pianoService.getVolume()).toBeCloseTo(0.5, 5);
    pianoService.setVolume(-6);
    expect(pianoService.getVolume()).toBeCloseTo(0.501, 2);
  });
});
