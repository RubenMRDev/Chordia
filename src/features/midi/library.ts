/**
 * Biblioteca local de ficheros MIDI importados (IndexedDB).
 *
 * Se guarda en el navegador y no en Firestore a proposito: un .mid puede pesar
 * cientos de KB, se importa/borra constantemente y no necesita reglas de
 * seguridad ni cuota de Firestore. Lo que si se puede subir a Firestore es la
 * cancion convertida a acordes (ver midiToChords).
 */

import { buildDemoMidi, DEMO_SONG_ID, DEMO_SONG_NAME } from './demoSong';
import { parseMidiBuffer, songNameFromFileName } from './parseMidi';
import {
  fromCatalogId,
  getCatalogSong,
  getCatalogSongData,
  isCatalogId,
  toCatalogId,
} from './catalog';

const DB_NAME = 'chordia-midi';
const DB_VERSION = 1;
const STORE = 'songs';

export interface MidiLibraryEntry {
  id: string;
  name: string;
  fileName: string;
  addedAt: string;
  size: number;
  duration: number;
  noteCount: number;
  bpm: number;
  /** Las incluidas con la app no se pueden borrar. */
  builtIn?: boolean;
}

interface StoredMidi extends MidiLibraryEntry {
  data: ArrayBuffer;
}

let demoEntryCache: MidiLibraryEntry | null = null;

/** Ficha de la cancion incluida, con duracion y notas reales. */
function demoEntry(): MidiLibraryEntry {
  if (demoEntryCache) return demoEntryCache;
  const base: MidiLibraryEntry = {
    id: DEMO_SONG_ID,
    name: DEMO_SONG_NAME,
    fileName: 'ode-to-joy.mid',
    addedAt: '1970-01-01T00:00:00.000Z',
    size: 0,
    duration: 0,
    noteCount: 0,
    bpm: 100,
    builtIn: true,
  };
  try {
    const parsed = parseMidiBuffer(buildDemoMidi(), base.fileName);
    demoEntryCache = {
      ...base,
      duration: parsed.duration,
      noteCount: parsed.notes.length,
      bpm: parsed.bpm,
    };
  } catch {
    demoEntryCache = base;
  }
  return demoEntryCache;
}

function toEntry(stored: StoredMidi): MidiLibraryEntry {
  return {
    id: stored.id,
    name: stored.name,
    fileName: stored.fileName,
    addedAt: stored.addedAt,
    size: stored.size,
    duration: stored.duration,
    noteCount: stored.noteCount,
    bpm: stored.bpm,
    builtIn: stored.builtIn,
  };
}

function isSupported(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isSupported()) {
      reject(new Error('Este navegador no soporta IndexedDB'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('No se pudo abrir la biblioteca MIDI'));
  });
}

function runRequest<T>(store: IDBObjectStore, request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Error de IndexedDB'));
    store.transaction.onabort = () => reject(store.transaction.error ?? new Error('Transaccion abortada'));
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => Promise<T>): Promise<T> {
  const db = await openDb();
  try {
    const transaction = db.transaction(STORE, mode);
    return await run(transaction.objectStore(STORE));
  } finally {
    db.close();
  }
}

function createId(): string {
  const random = Math.floor(Math.random() * 1e9).toString(36);
  return `midi-${Date.now().toString(36)}-${random}`;
}

/** Lista la biblioteca (mas reciente primero) con la demo siempre al final. */
export async function listMidiSongs(): Promise<MidiLibraryEntry[]> {
  if (!isSupported()) return [demoEntry()];
  try {
    const stored = await withStore('readonly', (store) => runRequest(store, store.getAll() as IDBRequest<StoredMidi[]>));
    const entries = stored
      .map(toEntry)
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    return [...entries, demoEntry()];
  } catch {
    return [demoEntry()];
  }
}

/** Importa un fichero: valida que se pueda parsear antes de guardarlo. */
export async function importMidiFile(file: File): Promise<MidiLibraryEntry> {
  const data = await file.arrayBuffer();
  // Si el fichero no es un MIDI valido, parseMidiBuffer lanza y no guardamos.
  const parsed = parseMidiBuffer(data, file.name);

  const entry: StoredMidi = {
    id: createId(),
    name: parsed.name || songNameFromFileName(file.name),
    fileName: file.name,
    addedAt: new Date().toISOString(),
    size: file.size,
    duration: parsed.duration,
    noteCount: parsed.notes.length,
    bpm: parsed.bpm,
    data,
  };

  await withStore('readwrite', (store) => runRequest(store, store.put(entry)));
  return toEntry(entry);
}

/** Devuelve los bytes de una cancion: catalogo, demo o fichero importado. */
export async function getMidiData(id: string): Promise<ArrayBuffer | null> {
  if (isCatalogId(id)) return getCatalogSongData(fromCatalogId(id));
  if (id === DEMO_SONG_ID) return buildDemoMidi();
  if (!isSupported()) return null;
  const stored = await withStore('readonly', (store) => runRequest(store, store.get(id) as IDBRequest<StoredMidi | undefined>));
  return stored?.data ?? null;
}

export async function getMidiEntry(id: string): Promise<MidiLibraryEntry | null> {
  if (isCatalogId(id)) {
    const song = await getCatalogSong(fromCatalogId(id));
    if (!song) return null;
    return {
      id: toCatalogId(song.id),
      name: `${song.title} - ${song.composer}`,
      fileName: song.file.split('/').pop() ?? `${song.id}.mid`,
      addedAt: '1970-01-01T00:00:00.000Z',
      size: song.size,
      duration: song.duration,
      noteCount: song.noteCount,
      bpm: song.bpm,
      builtIn: true,
    };
  }
  if (id === DEMO_SONG_ID) return demoEntry();
  if (!isSupported()) return null;
  const stored = await withStore('readonly', (store) => runRequest(store, store.get(id) as IDBRequest<StoredMidi | undefined>));
  return stored ? toEntry(stored) : null;
}

export async function deleteMidiSong(id: string): Promise<void> {
  if (id === DEMO_SONG_ID) throw new Error('La cancion de demostracion no se puede borrar');
  await withStore('readwrite', (store) => runRequest(store, store.delete(id)));
}

export async function renameMidiSong(id: string, name: string): Promise<void> {
  if (id === DEMO_SONG_ID) throw new Error('La cancion de demostracion no se puede renombrar');
  const stored = await withStore('readonly', (store) => runRequest(store, store.get(id) as IDBRequest<StoredMidi | undefined>));
  if (!stored) throw new Error('Cancion no encontrada');
  await withStore('readwrite', (store) => runRequest(store, store.put({ ...stored, name: name.trim() || stored.name })));
}

export { DEMO_SONG_ID };
