import React, { useState } from 'react';
import { PIANO_PRESETS } from '@/features/piano/pianoSettings';
import { midiToNoteName } from '@/features/audio/notes';
import { useT } from '@/i18n';
import { Keyboard } from '@/ui';

/**
 * The unique mechanism, demonstrated rather than described: pick a keyboard
 * size and watch the instrument redraw to it.
 *
 * The presets are the real ones the app ships, so what the visitor tries here
 * is exactly what the player will draw for them later.
 */
const PianoPicker: React.FC = () => {
  const { t } = useT();
  const [presetId, setPresetId] = useState('61');

  const preset =
    PIANO_PRESETS.find((item) => item.id === presetId) ?? PIANO_PRESETS[0];

  return (
    <div>
      <div
        role="group"
        aria-label={t('home.piano.pick')}
        className="flex flex-wrap gap-2"
      >
        {PIANO_PRESETS.map((item) => {
          const active = item.id === presetId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPresetId(item.id)}
              aria-pressed={active}
              className={`press numeric h-10 px-3.5 rounded-md border text-sm font-semibold ${
                active
                  ? 'bg-hand-right text-hand-right-ink border-hand-right'
                  : 'bg-ground-3 text-ink-mid border-[var(--edge)] hover:text-ink hover:border-[var(--seam)]'
              }`}
            >
              {item.keys}
            </button>
          );
        })}
      </div>

      <p className="numeric mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        <span className="text-ink font-semibold">
          {t('home.piano.keys', { count: preset.keys })}
        </span>
        <span className="text-ink-low">
          {t('home.piano.range', {
            low: midiToNoteName(preset.lowestMidi),
            high: midiToNoteName(preset.highestMidi),
          })}
        </span>
      </p>

      {/*
        The keyboard is the answer, so it gets the room. It redraws on every
        change, which is the whole point of the feature.
      */}
      <div className="mt-6 rounded-lg bg-ground-0 p-3 border border-[var(--edge)] shadow-[var(--lift-2)]">
        <Keyboard
          key={preset.id}
          lowestMidi={preset.lowestMidi}
          highestMidi={preset.highestMidi}
          height={104}
          labelOctaves
          decorative
          className="rise"
        />
      </div>
    </div>
  );
};

export default PianoPicker;
