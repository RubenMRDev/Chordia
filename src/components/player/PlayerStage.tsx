import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaCompress, FaExpand, FaPause, FaPlay } from 'react-icons/fa';
import FallingNotesCanvas from './FallingNotesCanvas';
import ScrubBar from './ScrubBar';
import type { Player, PlayerStatus } from '@/features/player/Player';
import type { ParsedSong } from '@/features/midi/types';
import { useT } from '@/i18n';

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
  const { t } = useT();
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
      className={`relative overflow-hidden bg-ground-0 ${
        isFullscreen
          ? 'w-screen h-screen'
          : 'h-[58vh] min-h-[360px] rounded-xl border border-[var(--edge)] shadow-[var(--lift-2)]'
      }`}
    >
      {/*
        En pantalla completa se le resta al canvas la altura de la barra de
        controles: si no, la barra taparia el teclado, que es clicable.
      */}
      <div className={isFullscreen ? 'absolute inset-x-0 top-0 bottom-[84px]' : 'w-full h-full'}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-ink-low">
            {t('player.loading')}
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
        <div
          role="status"
          className="absolute top-3 left-3 max-w-[70%] rounded-md border border-[var(--edge)] bg-[color-mix(in_srgb,var(--color-ground-0)_82%,transparent)] backdrop-blur px-3 py-2 text-[12px] leading-relaxed text-ink-mid pointer-events-none"
        >
          {notice}
        </div>
      )}

      <button
        type="button"
        onClick={() => void toggleFullscreen()}
        className="press absolute top-3 right-3 h-10 w-10 rounded-md border border-[var(--edge)] bg-[color-mix(in_srgb,var(--color-ground-0)_70%,transparent)] backdrop-blur text-ink grid place-items-center hover:bg-ground-3"
        aria-label={
          isFullscreen ? t('player.exitFullscreen') : t('player.fullscreen')
        }
        title={
          isFullscreen ? t('player.exitFullscreen') : t('player.fullscreen')
        }
      >
        {isFullscreen ? <FaCompress /> : <FaExpand />}
      </button>

      {isFullscreen && (
        <div className="absolute bottom-0 left-0 right-0 h-[84px] flex items-center gap-4 border-t border-[var(--seam)] bg-ground-1 px-4">
          <button
            type="button"
            onClick={() => player.toggle()}
            className="press bloom-right h-11 w-11 shrink-0 rounded-full bg-hand-right text-hand-right-ink grid place-items-center hover:brightness-110"
            aria-label={playing ? t('player.pause') : t('player.play')}
          >
            {playing ? <FaPause /> : <FaPlay className="ml-0.5" />}
          </button>
          <ScrubBar time={time} duration={duration} onSeek={(next) => player.seek(next)} />
          <span className="hidden md:block text-[12px] text-ink-low whitespace-nowrap">
            {t('player.shortcuts')}
          </span>
        </div>
      )}
    </div>
  );
};

export default PlayerStage;
