import React from 'react';
import {
  FaPlay,
  FaPause,
  FaUndo,
  FaVolumeUp,
  FaMusic,
  FaHeadphones,
  FaGraduationCap,
  FaSearchPlus,
  FaFont,
} from 'react-icons/fa';
import type { Player, PlayerSnapshot } from '../../features/player/Player';

interface PlayerControlsProps {
  player: Player;
  snapshot: PlayerSnapshot;
  volume: number;
  onVolumeChange: (volume: number) => void;
  showNoteNames: boolean;
  onToggleNoteNames: () => void;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5];

const toggleClass = (active: boolean): string =>
  `px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
    active
      ? 'bg-[var(--accent-green)] text-black'
      : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
  }`;

/** Panel de controles del reproductor de MIDI. */
const PlayerControls: React.FC<PlayerControlsProps> = ({
  player,
  snapshot,
  volume,
  onVolumeChange,
  showNoteNames,
  onToggleNoteNames,
}) => {
  const { settings, status } = snapshot;
  const playing = status === 'playing' || status === 'waiting';

  return (
    <div className="bg-[var(--card-background)] rounded-lg p-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => player.toggle()}
          className="w-12 h-12 rounded-full bg-[var(--accent-green)] text-black flex items-center justify-center hover:brightness-110"
          aria-label={playing ? 'Pausar' : 'Reproducir'}
        >
          {playing ? <FaPause /> : <FaPlay className="ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => {
            player.stop();
            player.resetStats();
          }}
          className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10"
          aria-label="Empezar de nuevo"
          title="Empezar de nuevo"
        >
          <FaUndo />
        </button>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Modo</span>
          <button
            type="button"
            onClick={() => player.updateSettings({ mode: 'listen' })}
            className={toggleClass(settings.mode === 'listen')}
            title="La cancion suena entera, tu solo escuchas o acompanas"
          >
            <FaHeadphones className="inline mr-1.5 -mt-0.5" />
            Escuchar
          </button>
          <button
            type="button"
            onClick={() => player.updateSettings({ mode: 'practice' })}
            className={toggleClass(settings.mode === 'practice')}
            title="El reproductor espera a que toques las notas correctas"
          >
            <FaGraduationCap className="inline mr-1.5 -mt-0.5" />
            Practicar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Tocas</span>
          <button
            type="button"
            onClick={() => player.updateSettings({ userHands: { ...settings.userHands, left: !settings.userHands.left } })}
            className={toggleClass(settings.userHands.left)}
          >
            Izquierda
          </button>
          <button
            type="button"
            onClick={() => player.updateSettings({ userHands: { ...settings.userHands, right: !settings.userHands.right } })}
            className={toggleClass(settings.userHands.right)}
          >
            Derecha
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Suena</span>
          <button
            type="button"
            onClick={() =>
              player.updateSettings({ playbackHands: { ...settings.playbackHands, left: !settings.playbackHands.left } })
            }
            className={toggleClass(settings.playbackHands.left)}
          >
            Izquierda
          </button>
          <button
            type="button"
            onClick={() =>
              player.updateSettings({ playbackHands: { ...settings.playbackHands, right: !settings.playbackHands.right } })
            }
            className={toggleClass(settings.playbackHands.right)}
          >
            Derecha
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span className="whitespace-nowrap">Velocidad</span>
          <select
            value={settings.speed}
            onChange={(event) => player.updateSettings({ speed: Number(event.target.value) })}
            className="bg-[var(--background-darker)] text-white text-sm rounded px-2 py-1 border border-white/10"
          >
            {SPEEDS.map((speed) => (
              <option key={speed} value={speed}>
                {Math.round(speed * 100)}%
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <FaSearchPlus />
          <span className="whitespace-nowrap">Zoom</span>
          <input
            type="range"
            min={2}
            max={8}
            step={0.5}
            value={settings.secondsVisible}
            onChange={(event) => player.updateSettings({ secondsVisible: Number(event.target.value) })}
            className="w-24 accent-[var(--accent-green)]"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <FaVolumeUp />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="w-24 accent-[var(--accent-green)]"
          />
        </label>

        <button
          type="button"
          onClick={() => player.updateSettings({ metronome: !settings.metronome })}
          className={toggleClass(settings.metronome)}
        >
          <FaMusic className="inline mr-1.5 -mt-0.5" />
          Metronomo
        </button>

        <button type="button" onClick={onToggleNoteNames} className={toggleClass(showNoteNames)}>
          <FaFont className="inline mr-1.5 -mt-0.5" />
          Nombres de nota
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;
