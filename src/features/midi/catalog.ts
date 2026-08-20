/**
 * Catalogo de canciones que viene con la app (public/songs/catalog.json).
 *
 * Lo genera scripts/harvest-songs.mjs a partir de fuentes con licencia libre
 * (Mutopia Project y las canciones CC de sightread) y cada pieza guarda su
 * atribucion: fuente, enlace original y licencia.
 */

export interface CatalogSong {
  id: string;
  title: string;
  composer: string;
  composerKey: string;
  lifespan?: string;
  instrument: string;
  soloPiano: boolean;
  style?: string;
  /** Ruta relativa a public/, por ejemplo "songs/mutopia/xxx.mid". */
  file: string;
  size: number;
  source: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  duration: number;
  noteCount: number;
  bpm: number;
  lowestMidi: number;
  highestMidi: number;
  notesPerSecond: number;
  polyphony: number;
  score: number;
  /** 1 (facil) a 5 (dificil), relativo al resto del catalogo. */
  difficulty: number;
}

export interface CatalogSource {
  name: string;
  url: string;
  note: string;
}

export interface Catalog {
  generatedAt: string;
  count: number;
  composers: string[];
  sources: CatalogSource[];
  songs: CatalogSong[];
}

/** Los ids del catalogo se distinguen de los ficheros importados por el prefijo. */
export const CATALOG_ID_PREFIX = 'catalog:';

export function isCatalogId(id: string): boolean {
  return id.startsWith(CATALOG_ID_PREFIX);
}

export function toCatalogId(songId: string): string {
  return `${CATALOG_ID_PREFIX}${songId}`;
}

export function fromCatalogId(id: string): string {
  return id.slice(CATALOG_ID_PREFIX.length);
}

const SONGS_BASE = '/songs/';

let cache: Promise<Catalog> | null = null;

/** Descarga el catalogo una sola vez por sesion. */
export function loadCatalog(): Promise<Catalog> {
  if (!cache) {
    // Ruta absoluta: la app se sirve siempre desde la raiz (vite base '/').
    cache = fetch(`${SONGS_BASE}catalog.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`No se pudo cargar el catalogo (HTTP ${response.status})`);
        return response.json() as Promise<Catalog>;
      })
      .catch((error: unknown) => {
        cache = null;
        throw error;
      });
  }
  return cache;
}

export async function getCatalogSong(songId: string): Promise<CatalogSong | null> {
  const catalog = await loadCatalog();
  return catalog.songs.find((song) => song.id === songId) ?? null;
}

/** Bytes del fichero MIDI de una pieza del catalogo. */
export async function getCatalogSongData(songId: string): Promise<ArrayBuffer | null> {
  const song = await getCatalogSong(songId);
  if (!song) return null;
  const response = await fetch(`/${song.file}`);
  if (!response.ok) throw new Error(`No se pudo descargar "${song.title}"`);
  return await response.arrayBuffer();
}

export type CatalogSort = 'composer' | 'title' | 'difficulty' | 'duration';

export interface CatalogFilters {
  search: string;
  composer: string;
  style: string;
  difficulty: number | null;
  soloOnly: boolean;
  /** Rango del piano del usuario: descarta lo que no quepa. */
  range: { lowestMidi: number; highestMidi: number } | null;
  sort: CatalogSort;
}

export const EMPTY_FILTERS: CatalogFilters = {
  search: '',
  composer: '',
  style: '',
  difficulty: null,
  soloOnly: false,
  range: null,
  sort: 'composer',
};

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function filterCatalog(songs: CatalogSong[], filters: CatalogFilters): CatalogSong[] {
  const terms = normalize(filters.search).split(/\s+/).filter(Boolean);

  const result = songs.filter((song) => {
    if (filters.composer && song.composer !== filters.composer) return false;
    if (filters.style && song.style !== filters.style) return false;
    if (filters.difficulty !== null && song.difficulty !== filters.difficulty) return false;
    if (filters.soloOnly && !song.soloPiano) return false;
    if (
      filters.range &&
      (song.lowestMidi < filters.range.lowestMidi || song.highestMidi > filters.range.highestMidi)
    ) {
      return false;
    }
    if (terms.length > 0) {
      const haystack = normalize(`${song.title} ${song.composer} ${song.style ?? ''}`);
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    return true;
  });

  const sorters: Record<CatalogSort, (a: CatalogSong, b: CatalogSong) => number> = {
    composer: (a, b) => a.composer.localeCompare(b.composer) || a.title.localeCompare(b.title),
    title: (a, b) => a.title.localeCompare(b.title),
    difficulty: (a, b) => a.difficulty - b.difficulty || a.score - b.score,
    duration: (a, b) => a.duration - b.duration,
  };

  return result.sort(sorters[filters.sort]);
}

/** Estilos presentes en el catalogo, para el desplegable de filtros. */
export function catalogStyles(songs: CatalogSong[]): string[] {
  return [...new Set(songs.map((song) => song.style).filter((style): style is string => !!style))].sort();
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Muy facil',
  2: 'Facil',
  3: 'Media',
  4: 'Difícil',
  5: 'Muy difícil',
};
