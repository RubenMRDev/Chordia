import { installFakeAudio, type FakeClock } from './fakeAudio';
import { Player } from '../player/Player';
import { pianoEngine } from '../audio/PianoEngine';
import { parseMidiBuffer } from '../midi/parseMidi';
import { buildDemoMidi } from '../midi/demoSong';

describe('reproductor de MIDI', () => {
  let clock: FakeClock;
  let player: Player;
  let scheduleSpy: jest.SpyInstance;

  const song = parseMidiBuffer(buildDemoMidi(), 'demo.mid');
  // Primera nota de la mano derecha: E4 (64) en el segundo 0.
  const firstRight = song.notes.find((note) => note.hand === 'right');

  beforeEach(() => {
    clock = installFakeAudio();
    scheduleSpy = jest.spyOn(pianoEngine, 'scheduleNote');
    player = new Player();
    player.setSong(song);
  });

  afterEach(() => {
    player.dispose();
    scheduleSpy.mockRestore();
    // El motor es un singleton y cachea el AudioContext: hay que soltarlo para
    // que el siguiente test reciba su propio reloj falso.
    pianoEngine.dispose();
    clock.restore();
  });

  it('carga la cancion y arranca parado en el segundo 0', () => {
    expect(player.getStatus()).toBe('stopped');
    expect(player.getTime()).toBe(0);
    expect(player.snapshot().duration).toBeCloseTo(song.duration, 3);
  });

  it('en modo escuchar avanza el tiempo y programa las notas', async () => {
    player.updateSettings({ mode: 'listen' });
    await player.play();
    clock.advance(1);

    expect(player.getStatus()).toBe('playing');
    expect(player.getTime()).toBeGreaterThan(0.8);
    const scheduled = scheduleSpy.mock.calls.map((call) => call[0]);
    expect(scheduled).toContain(firstRight?.midi);
  });

  it('la velocidad escala el avance del tiempo', async () => {
    player.updateSettings({ mode: 'listen', speed: 0.5 });
    await player.play();
    clock.advance(2);
    expect(player.getTime()).toBeGreaterThan(0.8);
    expect(player.getTime()).toBeLessThan(1.2);
  });

  it('en modo practicar espera a que el usuario toque la nota', async () => {
    player.updateSettings({ mode: 'practice', userHands: { left: false, right: true } });
    await player.play();
    clock.advance(0.5);

    expect(player.getStatus()).toBe('waiting');
    expect(player.requiredNotes()).toEqual([firstRight?.midi]);
    // Por id, no por tono: solo se espera esta nota, no todas las del mismo tono.
    expect(player.requiredNoteIds()).toEqual([firstRight?.id]);

    // El reloj esta congelado en el momento de la nota.
    const frozen = player.getTime();
    clock.advance(1);
    expect(player.getTime()).toBeCloseTo(frozen, 5);

    // La mano que toca el usuario no se reproduce sola.
    expect(scheduleSpy.mock.calls.map((call) => call[0])).not.toContain(firstRight?.midi);
  });

  it('acertar la nota reanuda la cancion y cuenta el acierto', async () => {
    player.updateSettings({ mode: 'practice', userHands: { left: false, right: true } });
    await player.play();
    clock.advance(0.5);
    expect(player.getStatus()).toBe('waiting');

    player.keyDown(firstRight!.midi, 0.8);
    expect(player.getStatus()).toBe('playing');
    expect(player.snapshot().stats.hits).toBe(1);
    expect(player.snapshot().stats.streak).toBe(1);

    player.keyUp(firstRight!.midi);
    clock.advance(0.2);
    expect(player.getTime()).toBeGreaterThan(0);
  });

  it('fallar una nota cuenta como error y rompe la racha', async () => {
    player.updateSettings({ mode: 'practice', userHands: { left: false, right: true } });
    await player.play();
    clock.advance(0.5);

    player.keyDown(firstRight!.midi + 1);
    expect(player.getStatus()).toBe('waiting');
    expect(player.snapshot().stats.wrong).toBe(1);
    expect(player.snapshot().stats.streak).toBe(0);
    expect(player.snapshot().stats.accuracy).toBe(0);
  });

  it('pausar y buscar por la cancion', async () => {
    player.updateSettings({ mode: 'listen' });
    await player.play();
    clock.advance(1);
    player.pause();
    const paused = player.getTime();

    clock.advance(1);
    expect(player.getStatus()).toBe('paused');
    expect(player.getTime()).toBeCloseTo(paused, 5);

    player.seek(5);
    expect(player.getTime()).toBeCloseTo(5, 5);
    player.seek(-3);
    expect(player.getTime()).toBe(0);
    player.seek(song.duration + 100);
    expect(player.getTime()).toBeCloseTo(song.duration, 5);
  });

  it('salta a un compas concreto', () => {
    player.seekToMeasure(3);
    const measure = song.measures.find((item) => item.number === 3);
    expect(player.getTime()).toBeCloseTo(measure!.time, 5);
  });

  it('silenciar una mano evita que se programen sus notas', async () => {
    player.updateSettings({
      mode: 'listen',
      playbackHands: { left: false, right: true },
    });
    await player.play();
    clock.advance(1.5);

    const scheduled = scheduleSpy.mock.calls.map((call) => call[0]);
    const leftMidis = song.notes.filter((note) => note.hand === 'left').map((note) => note.midi);
    expect(scheduled.some((midi) => leftMidis.includes(midi))).toBe(false);
    expect(scheduled.length).toBeGreaterThan(0);
  });

  it('llega al final de la cancion', async () => {
    player.updateSettings({ mode: 'listen', speed: 2 });
    player.seek(song.duration - 0.5);
    await player.play();
    clock.advance(1);
    expect(player.getStatus()).toBe('finished');
    expect(player.getTime()).toBeCloseTo(song.duration, 3);
  });

  it('el pedal y las teclas pulsadas se reflejan en el estado', () => {
    player.keyDown(60);
    expect(player.pressed.has(60)).toBe(true);
    player.keyUp(60);
    expect(player.pressed.has(60)).toBe(false);
    expect(() => player.setSustain(true)).not.toThrow();
    expect(() => player.setSustain(false)).not.toThrow();
  });

  it('resetStats limpia el marcador', async () => {
    player.updateSettings({ mode: 'practice', userHands: { left: false, right: true } });
    await player.play();
    clock.advance(0.5);
    player.keyDown(firstRight!.midi);
    expect(player.snapshot().stats.hits).toBe(1);

    player.resetStats();
    expect(player.snapshot().stats.hits).toBe(0);
    expect(player.hitNotes.size).toBe(0);
  });
});
