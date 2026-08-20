import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUsb, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
import Header from '../components/Header';
import PlayerStage from '../components/player/PlayerStage';
import PlayerControls from '../components/player/PlayerControls';
import ScrubBar from '../components/player/ScrubBar';
import KeyboardHelp from '../components/player/KeyboardHelp';
import { usePlayer } from '../hooks/usePlayer';
import { useComputerKeyboard } from '../hooks/useComputerKeyboard';
import { useMidiKeyboard } from '../hooks/useMidiKeyboard';
import { usePiano } from '../hooks/usePiano';
import pianoService from '../services/pianoService';
import { getMidiData, getMidiEntry, type MidiLibraryEntry } from '../features/midi/library';
import { parseMidiBuffer } from '../features/midi/parseMidi';
import type { ParsedSong } from '../features/midi/types';

/**
 * Pantalla de juego: notas cayendo sobre el teclado, como Sightread, con el
 * piano de Chordia y soporte de teclado MIDI, teclado del ordenador y raton.
 */
const PlayMidiPage: React.FC = () => {
  const { midiId } = useParams<{ midiId: string }>();
  const { player, snapshot } = usePlayer();
  const { loadProgress, isSampled, isLoading } = usePiano();

  const [song, setSong] = useState<ParsedSong | null>(null);
  const [entry, setEntry] = useState<MidiLibraryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [volume, setVolume] = useState(() => pianoService.getVolume());

  // Se empieza a descargar el piano en cuanto se abre la pantalla.
  useEffect(() => {
    void pianoService.initialize();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!midiId) return;
      setLoading(true);
      setError(null);
      try {
        const [data, meta] = await Promise.all([getMidiData(midiId), getMidiEntry(midiId)]);
        if (!data) throw new Error('Esta cancion ya no esta en la biblioteca de este navegador');
        const parsed = parseMidiBuffer(data, meta?.fileName ?? 'cancion.mid');
        if (cancelled) return;

        setSong(parsed);
        setEntry(meta);
        player.setSong(parsed);

        // Por defecto el usuario toca la mano derecha y la app acompana con la
        // izquierda; si la pieza solo tiene una mano, se toca esa.
        const hasLeft = parsed.notes.some((note) => note.hand === 'left');
        const hasRight = parsed.notes.some((note) => note.hand === 'right');
        player.updateSettings({
          userHands: { left: !hasRight, right: hasRight },
          playbackHands: { left: hasLeft, right: hasRight },
        });
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'No se pudo abrir la cancion');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [midiId, player]);

  const handleToggle = useCallback(() => player.toggle(), [player]);
  const handleSeekBy = useCallback(
    (delta: number) => player.seek(player.getTime() + delta),
    [player],
  );

  const keyMapping = useComputerKeyboard(player, {
    onToggle: handleToggle,
    onSeek: handleSeekBy,
  });
  const midiKeyboard = useMidiKeyboard(player);

  const handleVolumeChange = (next: number) => {
    setVolume(next);
    pianoService.setVolume(next);
  };

  const { stats, status } = snapshot;
  const scored = stats.hits + stats.wrong;

  // Un solo aviso flotante sobre el canvas, para que la vista nunca se mueva.
  let notice: string | null = null;
  if (isLoading && !isSampled) {
    notice = `Cargando las muestras del piano (${Math.round(loadProgress * 100)}%). Mientras tanto ya puedes tocar: suena el sintetizador de respaldo.`;
  } else if (status === 'finished') {
    notice =
      scored > 0
        ? `Fin de la cancion: ${stats.hits} acertadas, ${stats.wrong} falladas, mejor racha ${stats.bestStreak}.`
        : 'Fin de la cancion.';
  }

  return (
    <div className="min-h-screen bg-[var(--background-dark)] text-[var(--text-primary)]">
      <Header />
      <main className="container py-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/midi"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white no-underline"
              aria-label="Volver a la biblioteca MIDI"
            >
              <FaArrowLeft />
            </Link>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">{song?.name ?? entry?.name ?? 'Cargando...'}</h1>
              {song && (
                <p className="text-sm text-[var(--text-secondary)]">
                  {song.bpm} BPM · {song.timeSignature[0]}/{song.timeSignature[1]} · compas{' '}
                  {snapshot.measure} de {song.measures.length} · {song.notes.length} notas
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-[var(--text-secondary)] text-xs uppercase">Acierto</p>
              <p className="font-bold text-lg text-[var(--accent-green)]">
                {scored === 0 ? '--' : `${Math.round(stats.accuracy * 100)}%`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[var(--text-secondary)] text-xs uppercase">Seguidas</p>
              <p className="font-bold text-lg">{stats.streak}</p>
            </div>
            <div className="text-center">
              <p className="text-[var(--text-secondary)] text-xs uppercase">Mejor</p>
              <p className="font-bold text-lg">{stats.bestStreak}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400" />
            <span>{error}</span>
            <Link to="/midi" className="ml-auto text-[var(--accent-green)] font-semibold no-underline">
              Ir a la biblioteca
            </Link>
          </div>
        )}

        <PlayerStage
          player={player}
          song={song}
          status={status}
          time={snapshot.time}
          duration={snapshot.duration}
          showNoteNames={showNoteNames}
          loading={loading}
          notice={notice}
        />

        <ScrubBar time={snapshot.time} duration={snapshot.duration} onSeek={(time) => player.seek(time)} />

        <PlayerControls
          player={player}
          snapshot={snapshot}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          showNoteNames={showNoteNames}
          onToggleNoteNames={() => setShowNoteNames((value) => !value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[var(--card-background)] rounded-lg p-4">
            <h3 className="flex items-center gap-2 font-bold mb-2">
              <FaUsb className="text-[var(--accent-green)]" />
              Teclado MIDI
            </h3>
            {!midiKeyboard.supported ? (
              <p className="text-sm text-[var(--text-secondary)]">
                Este navegador no soporta Web MIDI. Prueba con Chrome o Edge, o toca con el teclado
                del ordenador.
              </p>
            ) : midiKeyboard.connected ? (
              <p className="text-sm text-[var(--text-secondary)]">
                Conectado a {midiKeyboard.deviceNames.join(', ')}. Se respeta la velocidad de
                pulsacion y el pedal de sustain.
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-[var(--text-secondary)]">
                  {midiKeyboard.error ?? 'No se ha detectado ningun teclado MIDI.'}
                </p>
                <button
                  type="button"
                  onClick={midiKeyboard.reconnect}
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-sm font-semibold flex items-center gap-2"
                >
                  <FaSyncAlt />
                  Buscar
                </button>
              </div>
            )}
          </div>

          <KeyboardHelp mapping={keyMapping} />
        </div>
      </main>
    </div>
  );
};

export default PlayMidiPage;
