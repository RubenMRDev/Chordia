import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaCompress, FaExpand, FaPause, FaPlay } from 'react-icons/fa';
import FallingNotesCanvas from './FallingNotesCanvas';
import ScrubBar from './ScrubBar';
import type { Player, PlayerStatus } from '../../features/player/Player';
import type { ParsedSong } from '../../features/midi/types';

interface PlayerStageProps {
  player: Player;
  song: ParsedSong | null;
  status: PlayerStatus;
  time: number;
  duration: number;
  showNoteNames: boolean;
  /** Rango del piano del usuario. */
  keyboardRange?: [number, number] | null;
  /** La cancion todavia se esta cargando. */
  loading: boolean;
  /**
   * Aviso flotante (muestras del piano, fin de cancion...). Va superpuesto al
   * canvas y no empujando el layout: si no, la vista salta cada vez que
   * aparece o desaparece un mensaje.
   */
  notice?: string | null;
}

/**
 * Contenedor de la vista de juego: canvas de notas cayendo, avisos flotantes y
 * pantalla completa (con sus propios controles minimos, porque el panel normal
 * queda fuera del elemento a pantalla completa).
 */
const PlayerStage: React.FC<PlayerStageProps> = ({
  player,
  song,
  status,
  time,
  duration,
  showNoteNames,
  keyboardRange = null,
  loading,
  notice,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playing = status === 'playing' || status === 'waiting';

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.requestFullscreen();
    } catch {
      // Algunos navegadores lo bloquean sin gesto directo; no es critico.
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[var(--background-darker)] ${
        isFullscreen ? 'w-screen h-screen' : 'h-[58vh] min-h-[360px] rounded-lg border border-white/5'
      }`}
    >
      {/*
        En pantalla completa se le resta al canvas la altura de la barra de
        controles: si no, la barra taparia el teclado, que es clicable.
      */}
      <div className={isFullscreen ? 'absolute inset-x-0 top-0 bottom-[84px]' : 'w-full h-full'}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
            Cargando la cancion...
          </div>
        ) : (
          <FallingNotesCanvas
            player={player}
            song={song}
            showNoteNames={showNoteNames}
            showMeasures
            keyboardRange={keyboardRange}
          />
        )}
      </div>

      {notice && (
        <div className="absolute top-3 left-3 max-w-[70%] rounded-md bg-black/60 backdrop-blur px-3 py-2 text-xs text-[var(--text-secondary)] pointer-events-none">
          {notice}
        </div>
      )}

      <button
        type="button"
        onClick={() => void toggleFullscreen()}
        className="absolute top-3 right-3 w-10 h-10 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur text-white flex items-center justify-center"
        aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa'}
      >
        {isFullscreen ? <FaCompress /> : <FaExpand />}
      </button>

      {isFullscreen && (
        <div className="absolute bottom-0 left-0 right-0 h-[84px] flex items-center gap-4 border-t border-white/10 bg-[var(--background-darker)] px-4">
          <button
            type="button"
            onClick={() => player.toggle()}
            className="w-11 h-11 shrink-0 rounded-full bg-[var(--accent-green)] text-black flex items-center justify-center hover:brightness-110"
            aria-label={playing ? 'Pausar' : 'Reproducir'}
          >
            {playing ? <FaPause /> : <FaPlay className="ml-0.5" />}
          </button>
          <ScrubBar time={time} duration={duration} onSeek={(next) => player.seek(next)} />
          <span className="hidden md:block text-xs text-[var(--text-secondary)] whitespace-nowrap">
            Espacio: play · flechas: 5 s · Esc: salir
          </span>
        </div>
      )}
    </div>
  );
};

export default PlayerStage;
