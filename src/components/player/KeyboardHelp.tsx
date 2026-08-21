import React from 'react';
import { isBlackKey, midiToNoteName } from '@/features/audio/notes';
import { useT } from '@/i18n';
import { Panel } from '@/ui';

interface KeyboardHelpProps {
  mapping: Map<string, number>;
}

/**
 * Cheat sheet for the computer keys that stand in for the piano.
 *
 * Each key is drawn as the key it actually plays — ivory for a white note,
 * ebony for a black one — so the two rows read as two octaves of a keyboard
 * rather than as a list of shortcuts.
 */
const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ mapping }) => {
  const { t } = useT();
  const entries = [...mapping.entries()];
  const lower = entries.slice(0, 13);
  const upper = entries.slice(13);

  const renderRow = (row: Array<[string, number]>) => (
    <div className="flex flex-wrap gap-1">
      {row.map(([key, midi]) => {
        const black = isBlackKey(midi);
        return (
          <span
            key={key}
            title={midiToNoteName(midi)}
            className="inline-flex flex-col items-center rounded-[4px] border px-1.5 py-1 min-w-[30px]"
            style={{
              background: black
                ? 'var(--color-ebony)'
                : 'color-mix(in srgb, var(--color-ivory) 88%, transparent)',
              borderColor: black ? 'var(--seam)' : 'transparent',
              color: black ? 'var(--color-ivory)' : 'var(--color-ebony)',
            }}
          >
            <span className="numeric text-[12px] font-semibold uppercase leading-none">
              {key}
            </span>
            <span className="numeric mt-0.5 text-[9px] leading-none opacity-60">
              {midiToNoteName(midi)}
            </span>
          </span>
        );
      })}
    </div>
  );

  return (
    <Panel className="p-4">
      <h2 className="font-semibold">{t('keyboard.helpTitle')}</h2>
      <div className="mt-3 flex flex-col gap-1.5">
        {renderRow(upper)}
        {renderRow(lower)}
      </div>
      <p className="mt-3.5 text-[13px] leading-relaxed text-ink-low">
        {t('keyboard.helpBody')}
      </p>
    </Panel>
  );
};

export default KeyboardHelp;
