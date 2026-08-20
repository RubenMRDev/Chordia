import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlay, FaTrash, FaSave, FaMusic, FaRegClock, FaKeyboard } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import MidiDropzone from '../components/player/MidiDropzone';
import { formatTime } from '../features/player/format';
import {
  deleteMidiSong,
  getMidiData,
  importMidiFile,
  listMidiSongs,
  type MidiLibraryEntry,
} from '../features/midi/library';
import { parseMidiBuffer } from '../features/midi/parseMidi';
import { estimateKey, midiToChords } from '../features/midi/midiToChords';
import { createSong } from '../firebase/songService';
import { useAuth } from '../context/AuthContext';

const swalTheme = {
  background: '#1a2332',
  color: '#ffffff',
  confirmButtonColor: '#00E676',
  cancelButtonColor: '#4a5568',
};

/**
 * Biblioteca de ficheros MIDI importados: importar, tocar, borrar y convertir a
 * una cancion de acordes de Chordia.
 */
const MidiLibraryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<MidiLibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setEntries(await listMidiSongs());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleFiles = async (files: File[]) => {
    setImporting(true);
    const failed: string[] = [];
    let lastId: string | null = null;

    for (const file of files) {
      try {
        const entry = await importMidiFile(file);
        lastId = entry.id;
      } catch (error) {
        failed.push(`${file.name}: ${error instanceof Error ? error.message : 'error desconocido'}`);
      }
    }

    setImporting(false);
    await refresh();

    if (failed.length > 0) {
      await Swal.fire({
        ...swalTheme,
        icon: 'error',
        title: 'Algun fichero no se pudo importar',
        html: failed.map((message) => `<div>${message}</div>`).join(''),
      });
      return;
    }

    if (files.length === 1 && lastId) {
      navigate(`/play/${lastId}`);
    }
  };

  const handleDelete = async (entry: MidiLibraryEntry) => {
    const result = await Swal.fire({
      ...swalTheme,
      icon: 'warning',
      title: `Borrar "${entry.name}"?`,
      text: 'Se quita de este navegador. El fichero original no se toca.',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteMidiSong(entry.id);
      await refresh();
    } catch (error) {
      await Swal.fire({
        ...swalTheme,
        icon: 'error',
        title: 'No se pudo borrar',
        text: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  /** Convierte el MIDI en progresion de acordes y la guarda en Firestore. */
  const handleSaveAsSong = async (entry: MidiLibraryEntry) => {
    if (!currentUser) {
      await Swal.fire({ ...swalTheme, icon: 'info', title: 'Inicia sesion para guardar canciones' });
      return;
    }

    setSavingId(entry.id);
    try {
      const data = await getMidiData(entry.id);
      if (!data) throw new Error('No se encontro el fichero MIDI');
      const parsed = parseMidiBuffer(data, entry.fileName);
      const chords = midiToChords(parsed);
      if (chords.length === 0) throw new Error('No se pudo extraer ningun acorde');

      const songId = await createSong({
        userId: currentUser.uid,
        title: parsed.name || entry.name,
        tempo: parsed.bpm,
        key: estimateKey(parsed),
        timeSignature: `${parsed.timeSignature[0]}/${parsed.timeSignature[1]}`,
        chords,
        createdAt: new Date().toISOString(),
      });

      const result = await Swal.fire({
        ...swalTheme,
        icon: 'success',
        title: 'Guardada en tu biblioteca',
        text: `${chords.length} acordes extraidos de "${entry.name}".`,
        showCancelButton: true,
        confirmButtonText: 'Ver la cancion',
        cancelButtonText: 'Seguir aqui',
      });
      if (result.isConfirmed) navigate(`/song/${songId}`);
    } catch (error) {
      await Swal.fire({
        ...swalTheme,
        icon: 'error',
        title: 'No se pudo guardar',
        text: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-dark)] text-[var(--text-primary)]">
      <Header />
      <main className="container py-8 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaMusic className="text-[var(--accent-green)]" />
            Canciones MIDI
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">
            Importa cualquier fichero .mid y toca la cancion con las notas cayendo sobre el teclado.
            Puedes usar un teclado MIDI, el teclado del ordenador o el raton.
          </p>
        </div>

        <MidiDropzone onFiles={handleFiles} busy={importing} />

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Tu biblioteca</h2>

          {loading ? (
            <p className="text-[var(--text-secondary)]">Cargando...</p>
          ) : (
            entries.map((entry) => (
              <article
                key={entry.id}
                className="bg-[var(--card-background)] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">
                    {entry.name}
                    {entry.builtIn && (
                      <span className="ml-2 text-xs font-semibold text-[var(--accent-green)] uppercase">
                        incluida
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] flex flex-wrap gap-x-4 mt-1">
                    {entry.duration > 0 && (
                      <span className="flex items-center gap-1.5">
                        <FaRegClock />
                        {formatTime(entry.duration)}
                      </span>
                    )}
                    {entry.noteCount > 0 && <span>{entry.noteCount} notas</span>}
                    <span>{entry.bpm} BPM</span>
                    {!entry.builtIn && <span>{Math.round(entry.size / 1024)} KB</span>}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    to={`/play/${entry.id}`}
                    className="px-4 py-2 rounded bg-[var(--accent-green)] text-black font-bold no-underline flex items-center gap-2 hover:brightness-110"
                  >
                    <FaPlay />
                    Tocar
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleSaveAsSong(entry)}
                    disabled={savingId === entry.id}
                    className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 font-semibold flex items-center gap-2 disabled:opacity-50"
                    title="Extrae los acordes y la guarda en tu biblioteca de Chordia"
                  >
                    <FaSave />
                    {savingId === entry.id ? 'Guardando...' : 'Guardar como cancion'}
                  </button>
                  {!entry.builtIn && (
                    <button
                      type="button"
                      onClick={() => void handleDelete(entry)}
                      className="px-3 py-2 rounded bg-white/5 hover:bg-red-500/20 text-red-400"
                      aria-label={`Borrar ${entry.name}`}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>

        <section className="bg-[var(--card-background)] rounded-lg p-4 flex items-start gap-3">
          <FaKeyboard className="text-[var(--accent-green)] text-xl mt-1" />
          <div>
            <h3 className="font-bold">Con teclado MIDI</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Conectalo antes de abrir la cancion y se detecta solo, con velocidad de pulsacion y
              pedal de sustain. Si no tienes uno, la fila <strong>q w e r</strong> y la fila{' '}
              <strong>z x c v</strong> hacen de piano.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MidiLibraryPage;
