import React from 'react';
import {
  FaFont,
  FaGraduationCap,
  FaHeadphones,
  FaMusic,
  FaPause,
  FaPlay,
  FaSearchPlus,
  FaUndo,
  FaVolumeUp,
} from 'react-icons/fa';
import type {
  Player,
  PlayerMode,
  PlayerSnapshot,
} from '@/features/player/Player';
import { useT } from '@/i18n';
import { Button, Panel, Segmented, Toggle } from '@/ui';

interface PlayerControlsProps {
  player: Player;
  snapshot: PlayerSnapshot;
  volume: number;
  onVolumeChange: (volume: number) => void;
  showNoteNames: boolean;
  onToggleNoteNames: () => void;
  /**
   * Semitones needed for the piece to fit the visitor's piano (0 when it
   * already does). This is what makes the fit button worth offering.
   */
  suggestedTranspose?: number;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5];

/** A labelled group of controls, so the panel reads as sections. */
const Group: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex items-center gap-2.5">
    <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low whitespace-nowrap">
      {label}
    </span>
    {children}
  </div>
);

const RANGE =
  'w-24 accent-[var(--color-hand-right)] h-1.5 cursor-pointer';

/** The transport and settings panel for the MIDI player. */
const PlayerControls: React.FC<PlayerControlsProps> = ({
  player,
  snapshot,
  volume,
  onVolumeChange,
  showNoteNames,
  onToggleNoteNames,
  suggestedTranspose = 0,
}) => {
  const { t } = useT();
  const { settings, status } = snapshot;
  const playing = status === 'playing' || status === 'waiting';

  return (
    <Panel className="p-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Play is the one round control on the page: it is the instrument's key. */}
        <button
          type="button"
          onClick={() => player.toggle()}
          aria-label={playing ? t('player.pause') : t('player.play')}
          className="press bloom-right h-12 w-12 shrink-0 rounded-full bg-hand-right text-hand-right-ink grid place-items-center hover:brightness-110"
        >
          {playing ? <FaPause /> : <FaPlay className="ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => {
            player.stop();
            player.resetStats();
          }}
          aria-label={t('player.restart')}
          title={t('player.restart')}
          className="press h-10 w-10 shrink-0 rounded-full bg-ground-3 border border-[var(--edge)] text-ink grid place-items-center hover:bg-ground-4"
        >
          <FaUndo className="text-[13px]" />
        </button>

        <Group label={t('player.mode')}>
          <Segmented<PlayerMode>
            value={settings.mode}
            onChange={(mode) => player.updateSettings({ mode })}
            options={[
              {
                value: 'listen',
                label: (
                  <>
                    <FaHeadphones aria-hidden className="text-[11px]" />
                    {t('home.practice.listen')}
                  </>
                ),
                title: t('home.practice.listenBody'),
              },
              {
                value: 'practice',
                label: (
                  <>
                    <FaGraduationCap aria-hidden className="text-[11px]" />
                    {t('home.practice.practice')}
                  </>
                ),
                title: t('home.practice.practiceBody'),
              },
            ]}
          />
        </Group>

        {/*
          Hands are two independent switches, not an either/or: you can play
          both, or neither. Each wears its own hand colour, which is the same
          colour its notes have on the canvas.
        */}
        <Group label={t('player.youPlay')}>
          <div className="flex gap-1.5">
            <Toggle
              tone="left"
              size="sm"
              pressed={settings.userHands.left}
              onChange={(left) =>
                player.updateSettings({
                  userHands: { ...settings.userHands, left },
                })
              }
            >
              {t('hand.left')}
            </Toggle>
            <Toggle
              tone="right"
              size="sm"
              pressed={settings.userHands.right}
              onChange={(right) =>
                player.updateSettings({
                  userHands: { ...settings.userHands, right },
                })
              }
            >
              {t('hand.right')}
            </Toggle>
          </div>
        </Group>

        <Group label={t('player.appPlays')}>
          <div className="flex gap-1.5">
            <Toggle
              tone="left"
              size="sm"
              pressed={settings.playbackHands.left}
              onChange={(left) =>
                player.updateSettings({
                  playbackHands: { ...settings.playbackHands, left },
                })
              }
            >
              {t('hand.left')}
            </Toggle>
            <Toggle
              tone="right"
              size="sm"
              pressed={settings.playbackHands.right}
              onChange={(right) =>
                player.updateSettings({
                  playbackHands: { ...settings.playbackHands, right },
                })
              }
            >
              {t('hand.right')}
            </Toggle>
          </div>
        </Group>
      </div>

      <div aria-hidden className="rule-keys" />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-2 text-[13px] text-ink-mid">
          <span className="whitespace-nowrap">{t('player.speed')}</span>
          <select
            value={settings.speed}
            onChange={(event) =>
              player.updateSettings({ speed: Number(event.target.value) })
            }
            className="numeric h-8 rounded-md bg-ground-1 border border-[var(--edge)] px-2 text-[13px] text-ink hover:border-[var(--seam)] focus:border-hand-right focus:outline-none"
          >
            {SPEEDS.map((speed) => (
              <option key={speed} value={speed}>
                {Math.round(speed * 100)}%
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-[13px] text-ink-mid">
          <FaSearchPlus aria-hidden className="text-[12px]" />
          <span className="whitespace-nowrap">{t('player.zoom')}</span>
          <input
            type="range"
            min={2}
            max={8}
            step={0.5}
            value={settings.secondsVisible}
            onChange={(event) =>
              player.updateSettings({
                secondsVisible: Number(event.target.value),
              })
            }
            className={RANGE}
          />
        </label>

        <label className="flex items-center gap-2 text-[13px] text-ink-mid">
          <FaVolumeUp aria-hidden className="text-[12px]" />
          <span className="sr-only">{t('player.volume')}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            aria-label={t('player.volume')}
            className={RANGE}
          />
        </label>

        <Toggle
          size="sm"
          pressed={settings.metronome}
          onChange={(metronome) => player.updateSettings({ metronome })}
        >
          <FaMusic aria-hidden className="text-[11px]" />
          {t('player.metronome')}
        </Toggle>

        <Toggle size="sm" pressed={showNoteNames} onChange={onToggleNoteNames}>
          <FaFont aria-hidden className="text-[11px]" />
          {t('player.noteNames')}
        </Toggle>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
            {t('piano.octave')}
          </span>
          <div className="inline-flex items-center gap-1 rounded-lg bg-ground-1 p-1 border border-[var(--edge)]">
            <button
              type="button"
              onClick={() =>
                player.updateSettings({ transpose: settings.transpose - 12 })
              }
              aria-label={t('piano.octaveDown')}
              className="press h-7 w-7 rounded-[5px] text-ink-mid hover:text-ink hover:bg-ground-3"
            >
              −
            </button>
            <span className="numeric w-7 text-center text-[13px] font-semibold">
              {settings.transpose / 12}
            </span>
            <button
              type="button"
              onClick={() =>
                player.updateSettings({ transpose: settings.transpose + 12 })
              }
              aria-label={t('piano.octaveUp')}
              className="press h-7 w-7 rounded-[5px] text-ink-mid hover:text-ink hover:bg-ground-3"
            >
              +
            </button>
          </div>
        </div>

        {/*
          Offered only when shifting octaves would actually make the piece fit.
          It wears amber, the colour the player already uses for "you need to
          act on this".
        */}
        {suggestedTranspose !== 0 &&
          settings.transpose !== suggestedTranspose && (
            <Button
              tone="quiet"
              size="sm"
              title={t('player.fitNote', {
                semitones: Math.abs(suggestedTranspose),
              })}
              onClick={() =>
                player.updateSettings({ transpose: suggestedTranspose })
              }
              className="!border-[color-mix(in_srgb,var(--color-wait)_45%,transparent)] !bg-[color-mix(in_srgb,var(--color-wait)_14%,transparent)] !text-wait"
            >
              {t('player.fitToPiano')}
            </Button>
          )}
      </div>
    </Panel>
  );
};

export default PlayerControls;
