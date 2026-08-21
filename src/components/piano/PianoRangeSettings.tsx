import React from 'react';
import { usePianoSettings } from '@/hooks/usePianoSettings';
import {
  PIANO_PRESETS,
  describeRange,
  keyCount,
  type PianoPresetId,
} from '@/features/piano/pianoSettings';
import {
  HIGHEST_PIANO_MIDI,
  LOWEST_PIANO_MIDI,
  midiToNoteName,
} from '@/features/audio/notes';
import { useT } from '@/i18n';
import { Keyboard, Panel } from '@/ui';

const ALL_KEYS = Array.from(
  { length: HIGHEST_PIANO_MIDI - LOWEST_PIANO_MIDI + 1 },
  (_, index) => LOWEST_PIANO_MIDI + index,
);

const SELECT =
  'h-9 rounded-md bg-ground-1 border border-[var(--edge)] px-2.5 text-[13px] text-ink ' +
  'hover:border-[var(--seam)] focus:border-hand-right focus:outline-none';

/**
 * The visitor's own piano: how many keys, and which range. Saved to the browser
 * immediately, and to the Firestore profile when there is a session.
 *
 * The preset labels are built here rather than read from `PIANO_PRESETS.label`,
 * which is Spanish-only: user-facing wording does not belong in the features
 * layer.
 */
const PianoRangeSettings: React.FC = () => {
  const { t, tn } = useT();
  const { settings, update, saving, error } = usePianoSettings();

  const handlePreset = (preset: PianoPresetId) => {
    if (preset === 'custom') {
      update({
        preset: 'custom',
        lowestMidi: settings.lowestMidi,
        highestMidi: settings.highestMidi,
      });
    } else {
      update({ preset });
    }
  };

  /** "88 · full piano", "61 · 5 octaves". */
  const presetNote = (keys: number): string =>
    keys === 88 ? t('piano.fullPiano') : tn('piano.octaves', Math.round(keys / 12));

  return (
    <Panel as="section" className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-lg font-semibold">{t('piano.mine')}</h2>
        <span className="numeric text-[13px] text-ink-low">
          {t('home.piano.keys', { count: keyCount(settings) })}
          {' · '}
          {describeRange(settings)}
          {saving && ` · ${t('piano.saving')}`}
          {!saving && !error && (
            <span className="ml-2 text-hand-right" title={t('piano.savedShort')}>
              ✓
            </span>
          )}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed text-ink-mid prose-measure">
        {t('piano.lede')}
      </p>

      <div
        role="group"
        aria-label={t('piano.preset')}
        className="flex flex-wrap gap-2"
      >
        {PIANO_PRESETS.map((preset) => {
          const active = settings.preset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePreset(preset.id)}
              aria-pressed={active}
              className={`press flex flex-col items-start rounded-md border px-3 py-2 ${
                active
                  ? 'bg-hand-right text-hand-right-ink border-hand-right'
                  : 'bg-ground-3 border-[var(--edge)] text-ink hover:border-[var(--seam)]'
              }`}
            >
              <span className="numeric text-sm font-semibold leading-none">
                {preset.keys}
              </span>
              <span
                className={`mt-1 text-[11px] leading-none ${
                  active ? 'opacity-70' : 'text-ink-low'
                }`}
              >
                {presetNote(preset.keys)}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handlePreset('custom')}
          aria-pressed={settings.preset === 'custom'}
          className={`press rounded-md border px-3 py-2 text-sm font-semibold ${
            settings.preset === 'custom'
              ? 'bg-hand-right text-hand-right-ink border-hand-right'
              : 'bg-ground-3 border-[var(--edge)] text-ink hover:border-[var(--seam)]'
          }`}
        >
          {t('piano.customPreset')}
        </button>
      </div>

      {settings.preset === 'custom' && (
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] text-ink-mid">
            {t('piano.lowest')}
            <select
              value={settings.lowestMidi}
              onChange={(event) =>
                update({ lowestMidi: Number(event.target.value) })
              }
              className={SELECT}
            >
              {ALL_KEYS.map((midi) => (
                <option key={midi} value={midi}>
                  {midiToNoteName(midi)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] text-ink-mid">
            {t('piano.highest')}
            <select
              value={settings.highestMidi}
              onChange={(event) =>
                update({ highestMidi: Number(event.target.value) })
              }
              className={SELECT}
            >
              {ALL_KEYS.map((midi) => (
                <option key={midi} value={midi}>
                  {midiToNoteName(midi)}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/*
        The whole grand, with the visitor's own range lit and the rest in
        shadow — so the setting reads as "this much of a piano", which is what
        it means.
      */}
      <div className="rounded-lg bg-ground-0 p-2 border border-[var(--edge)]">
        <Keyboard
          lowestMidi={LOWEST_PIANO_MIDI}
          highestMidi={HIGHEST_PIANO_MIDI}
          litRange={[settings.lowestMidi, settings.highestMidi]}
          height={64}
          decorative
        />
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={settings.autoTranspose}
          onChange={(event) => update({ autoTranspose: event.target.checked })}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border border-[var(--seam)] bg-ground-1"
        />
        <span>
          <strong className="block text-sm font-semibold text-ink">
            {t('piano.autoTitle')}
          </strong>
          <span className="mt-1 block text-[13px] leading-relaxed text-ink-low">
            {t('piano.autoBody')}
          </span>
        </span>
      </label>

      {error && (
        <p className="text-[13px] text-[var(--color-felt-ink)]">{error}</p>
      )}
    </Panel>
  );
};

export default PianoRangeSettings;
