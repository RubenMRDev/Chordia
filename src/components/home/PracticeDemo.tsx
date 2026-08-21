import React, { useEffect, useMemo, useState } from 'react';
import { midiToNoteName } from '@/features/audio/notes';
import { useT } from '@/i18n';
import { Keyboard, type KeyboardHand } from '@/ui';

/** The opening of the demo piece's melody, so it is the product's own notes. */
const PHRASE = [64, 64, 65, 67, 67, 65, 64, 62];

const LOWEST = 60;
const HIGHEST = 72;

/** How long the amber note is held before it resolves, in milliseconds. */
const HOLD = 900;

/**
 * Practice mode, illustrated.
 *
 * The next note sits amber on the keyboard and the clock does not move until it
 * resolves — which is exactly the mechanism the player implements. It runs
 * itself on a timer and makes no sound: this is a diagram of the feature, not a
 * playable instrument. Under `prefers-reduced-motion` it holds a single frame.
 */
const PracticeDemo: React.FC = () => {
  const { t } = useT();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      // One step past the end holds the finished state, then it loops.
      setIndex((current) => (current > PHRASE.length ? 0 : current + 1));
    }, HOLD);

    return () => window.clearInterval(timer);
  }, []);

  const done = index >= PHRASE.length;
  const expected = done ? null : PHRASE[index];

  const active = useMemo(() => {
    const map = new Map<number, KeyboardHand>();
    // Notes already resolved stay lit in the right hand's colour.
    for (let step = 0; step < Math.min(index, PHRASE.length); step += 1) {
      map.set(PHRASE[step], 'right');
    }
    if (expected !== null) map.set(expected, 'wait');
    return map;
  }, [index, expected]);

  /*
    The clock only moves when a note resolves, which is the whole point: in
    practice mode elapsed time is driven by the player, not by the piece.
  */
  const seconds = Math.min(index, PHRASE.length) * 0.6;
  const clock = `0:${String(Math.floor(seconds)).padStart(2, '0')}`;

  return (
    <div className="chassis p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div
          className="numeric font-display text-[2.25rem] leading-none"
          style={{
            color: done ? 'var(--color-hand-right)' : 'var(--color-ink)',
            transition: 'color var(--t-move) var(--ease-strike)',
          }}
        >
          {clock}
        </div>

        <div className="flex items-center gap-2.5 text-[13px] font-semibold">
          {done ? (
            <>
              <span
                className="h-2 w-2 rounded-full bg-hand-right"
                aria-hidden
              />
              <span className="text-hand-right">
                {t('home.practice.practice')}
              </span>
            </>
          ) : (
            <>
              <span
                className="h-2 w-2 rounded-full bg-wait sustain"
                aria-hidden
              />
              <span className="text-wait">
                {t('home.practice.waiting')}
                {expected !== null && (
                  <span className="numeric text-ink-mid font-normal">
                    {' · '}
                    {midiToNoteName(expected)}
                  </span>
                )}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-md bg-ground-0 p-2.5 border border-[var(--edge)]">
        <Keyboard
          lowestMidi={LOWEST}
          highestMidi={HIGHEST}
          active={active}
          height={112}
          decorative
        />
      </div>

      <p className="mt-4 text-[13px] text-ink-low">
        {t('home.practice.practiceBody')}
      </p>
    </div>
  );
};

export default PracticeDemo;
