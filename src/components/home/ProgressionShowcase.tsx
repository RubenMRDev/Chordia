import React, { useEffect, useState } from 'react';
import { useT } from '@/i18n';
import { Keyboard, type KeyboardHand } from '@/ui';

/**
 * A saved progression, the way Chordia stores one: an ordered list of chords
 * plus the key, tempo and time signature it is played in.
 *
 * `I – vi – IV – V` in C, in root position, voiced across two octaves the way
 * the chord builder voices it. Chord symbols and roman numerals read the same
 * in both languages, so they are not translated.
 */
const PROGRESSION = [
  { symbol: 'C', numeral: 'I', notes: [60, 64, 67] },
  { symbol: 'Am', numeral: 'vi', notes: [57, 60, 64] },
  { symbol: 'F', numeral: 'IV', notes: [65, 69, 72] },
  { symbol: 'G', numeral: 'V', notes: [67, 71, 74] },
] as const;

/** Two octaves, so every chord above sits in root position. */
const LOWEST = 55;
const HIGHEST = 79;

/** One chord per bar at 130 BPM in 4/4 is a little under two seconds. */
const BAR = 1850;

/**
 * The composition half of the product, shown rather than described: the chords
 * you picked, drawn on the keyboard, with the metadata the song carries.
 *
 * It steps through the progression on its own and makes no sound. One large
 * keyboard rather than four small ones, because at four-across a chord shape is
 * eight pixels wide and stops being readable — which defeats the point of
 * showing it.
 */
const ProgressionShowcase: React.FC = () => {
  const { t } = useT();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(
      () => setStep((current) => (current + 1) % PROGRESSION.length),
      BAR,
    );
    return () => window.clearInterval(timer);
  }, []);

  const chord = PROGRESSION[step];
  const active = new Map<number, KeyboardHand>(
    chord.notes.map((midi) => [midi, 'right' as KeyboardHand]),
  );

  return (
    <div className="chassis p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
          {t('home.compose.example')}
        </span>
        {/* What the song records: real measurement, so tabular figures. */}
        <span className="numeric text-[13px] text-ink-mid">
          C<span className="text-ink-low"> · </span>130 BPM
          <span className="text-ink-low"> · </span>4/4
        </span>
      </div>

      {/* The progression as a row of bars, the current one lit. */}
      <ol className="mt-5 grid grid-cols-4 gap-2 list-none m-0 p-0">
        {PROGRESSION.map((entry, index) => {
          const current = index === step;
          return (
            <li
              key={entry.symbol}
              className="rounded-md border px-3 py-2.5 transition-colors duration-[var(--t-move)] ease-[var(--ease-strike)]"
              style={{
                borderColor: current
                  ? 'color-mix(in srgb, var(--color-hand-right) 55%, transparent)'
                  : 'var(--edge)',
                background: current
                  ? 'color-mix(in srgb, var(--color-hand-right) 9%, transparent)'
                  : 'var(--color-ground-1)',
              }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className="font-display text-[19px] font-semibold transition-colors duration-[var(--t-move)]"
                  style={{
                    color: current
                      ? 'var(--color-hand-right)'
                      : 'var(--color-ink)',
                  }}
                >
                  {entry.symbol}
                </span>
                <span className="numeric text-[12px] text-ink-low">
                  {entry.numeral}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 rounded-md bg-ground-0 p-2.5 border border-[var(--edge)]">
        <Keyboard
          lowestMidi={LOWEST}
          highestMidi={HIGHEST}
          active={active}
          height={104}
          labelOctaves
          decorative
        />
      </div>
    </div>
  );
};

export default ProgressionShowcase;
