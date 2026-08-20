import {
  DEFAULT_PIANO_SETTINGS,
  PIANO_PRESETS,
  describeRange,
  fitsInPiano,
  getPianoSettings,
  keyCount,
  setPianoSettings,
  subscribePianoSettings,
  suggestTranspose,
} from '../piano/pianoSettings';
import { EMPTY_FILTERS, filterCatalog, type CatalogSong } from '../midi/catalog';

describe('configuracion del piano', () => {
  afterEach(() => {
    setPianoSettings(DEFAULT_PIANO_SETTINGS);
  });

  it('los presets tienen el numero de teclas que dicen', () => {
    PIANO_PRESETS.forEach((preset) => {
      expect(preset.highestMidi - preset.lowestMidi + 1).toBe(preset.keys);
    });
  });

  it('al elegir un preset se aplica su rango', () => {
    const settings = setPianoSettings({ preset: '61' });
    expect(settings.lowestMidi).toBe(36);
    expect(settings.highestMidi).toBe(96);
    expect(keyCount(settings)).toBe(61);
    expect(describeRange(settings)).toBe('C2 - C7');
  });

  it('un rango personalizado se ordena y respeta el minimo de dos octavas', () => {
    const settings = setPianoSettings({ preset: 'custom', lowestMidi: 72, highestMidi: 60 });
    expect(settings.lowestMidi).toBeLessThan(settings.highestMidi);
    expect(settings.highestMidi - settings.lowestMidi).toBeGreaterThanOrEqual(24);
  });

  it('no deja salirse del piano de 88 teclas', () => {
    const settings = setPianoSettings({ preset: 'custom', lowestMidi: 0, highestMidi: 127 });
    expect(settings.lowestMidi).toBe(21);
    expect(settings.highestMidi).toBe(108);
  });

  it('avisa a los suscriptores de los cambios', () => {
    const seen: number[] = [];
    const unsubscribe = subscribePianoSettings((settings) => seen.push(keyCount(settings)));
    setPianoSettings({ preset: '25' });
    unsubscribe();
    setPianoSettings({ preset: '88' });
    expect(seen).toEqual([keyCount(DEFAULT_PIANO_SETTINGS), 25]);
    expect(keyCount(getPianoSettings())).toBe(88);
  });

  describe('encaje de las piezas', () => {
    const piano61 = { preset: '61' as const, lowestMidi: 36, highestMidi: 96, autoTranspose: true };

    it('detecta lo que cabe y lo que no', () => {
      expect(fitsInPiano(piano61, 40, 90)).toBe(true);
      expect(fitsInPiano(piano61, 30, 90)).toBe(false);
      expect(fitsInPiano(piano61, 40, 100)).toBe(false);
    });

    it('no transpone lo que ya cabe', () => {
      expect(suggestTranspose(piano61, 40, 90)).toBe(0);
    });

    it('sube o baja octavas para que quepa', () => {
      // Pieza dos octavas por debajo del teclado.
      expect(suggestTranspose(piano61, 24, 48)).toBe(12);
      // Pieza demasiado aguda.
      expect(suggestTranspose(piano61, 96, 108)).toBe(-12);
    });

    it('elige el desplazamiento menos malo cuando no hay forma de que quepa', () => {
      const shift = suggestTranspose(piano61, 21, 108);
      expect(shift % 12).toBe(0);
      expect(Math.abs(shift)).toBeLessThanOrEqual(36);
    });
  });
});

describe('filtros del catalogo', () => {
  const song = (overrides: Partial<CatalogSong>): CatalogSong => ({
    id: 'x',
    title: 'Titulo',
    composer: 'Compositor',
    composerKey: 'compositor',
    instrument: 'Piano',
    soloPiano: true,
    file: 'songs/x.mid',
    size: 100,
    source: 'Mutopia Project',
    sourceUrl: 'https://example.org',
    license: 'Public Domain',
    licenseUrl: 'https://example.org/legal',
    duration: 60,
    noteCount: 100,
    bpm: 120,
    lowestMidi: 48,
    highestMidi: 72,
    notesPerSecond: 2,
    polyphony: 1,
    score: 3,
    difficulty: 2,
    ...overrides,
  });

  const songs = [
    song({ id: 'a', title: 'Nocturne', composer: 'Frederic Chopin', difficulty: 4, duration: 300 }),
    song({ id: 'b', title: 'Minueto', composer: 'Johann Sebastian Bach', difficulty: 1, duration: 90 }),
    song({
      id: 'c',
      title: 'Sonata para violin',
      composer: 'Johann Sebastian Bach',
      soloPiano: false,
      instrument: 'Violin, Piano',
      difficulty: 3,
      lowestMidi: 24,
      highestMidi: 100,
      style: 'Baroque',
    }),
  ];

  it('busca sin acentos ni mayusculas por titulo y compositor', () => {
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, search: 'chopin' }).map((s) => s.id)).toEqual(['a']);
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, search: 'MINUETO' }).map((s) => s.id)).toEqual(['b']);
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, search: 'bach sonata' }).map((s) => s.id)).toEqual(['c']);
  });

  it('filtra por compositor, estilo y dificultad', () => {
    expect(
      filterCatalog(songs, { ...EMPTY_FILTERS, composer: 'Johann Sebastian Bach' }).length,
    ).toBe(2);
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, style: 'Baroque' }).map((s) => s.id)).toEqual(['c']);
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, difficulty: 4 }).map((s) => s.id)).toEqual(['a']);
  });

  it('filtra por solo piano y por lo que cabe en el teclado', () => {
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, soloOnly: true }).map((s) => s.id)).toEqual([
      'a',
      'b',
    ]);
    const fitting = filterCatalog(songs, {
      ...EMPTY_FILTERS,
      range: { lowestMidi: 36, highestMidi: 96 },
    });
    expect(fitting.map((s) => s.id)).toEqual(['a', 'b']);
  });

  it('ordena por lo pedido', () => {
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, sort: 'difficulty' }).map((s) => s.id)).toEqual([
      'b',
      'c',
      'a',
    ]);
    // c dura 60 s, b 90 s y a 300 s.
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, sort: 'duration' }).map((s) => s.id)).toEqual([
      'c',
      'b',
      'a',
    ]);
    expect(filterCatalog(songs, { ...EMPTY_FILTERS, sort: 'title' }).map((s) => s.id)).toEqual([
      'b',
      'a',
      'c',
    ]);
  });
});
