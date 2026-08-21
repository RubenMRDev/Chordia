import React, { useMemo } from 'react';
import { isBlackKey, midiToNoteName } from '@/features/audio/notes';

export type KeyboardHand = 'left' | 'right' | 'wait' | 'struck';

export interface KeyboardProps {
  /** Inclusive MIDI range to draw. */
  lowestMidi: number;
  highestMidi: number;
  /** Which notes are currently sounding, and in whose colour. */
  active?: ReadonlyMap<number, KeyboardHand> | null;
  /** Height of a white key. Black keys are 62 % of it. */
  height?: number;
  onPress?: (midi: number) => void;
  onRelease?: (midi: number) => void;
  /** Draws note letters on the white C keys, as the player does. */
  labelOctaves?: boolean;
  className?: string;
  /** Purely decorative instances are hidden from assistive tech. */
  decorative?: boolean;
  /**
   * `lit` is a real instrument under light: ivory and ebony.
   * `shadow` is the same instrument seen in a dark room, for the structural
   * uses where a full-brightness keyboard would shout over the page. Dimming a
   * lit keyboard with opacity instead turns the ivory into flat grey and the
   * whole thing reads as a bar chart.
   */
  tone?: 'lit' | 'shadow';
  /**
   * Draws the whole keyboard but only lights the keys inside this range,
   * leaving the rest in shadow. Used to show which slice of a grand piano the
   * visitor's own instrument covers.
   */
  litRange?: [number, number] | null;
}

const HAND_FILL: Record<KeyboardHand, string> = {
  right: 'var(--color-hand-right)',
  left: 'var(--color-hand-left)',
  wait: 'var(--color-wait)',
  struck: 'var(--color-struck)',
};

const HAND_BLOOM: Record<KeyboardHand, string> = {
  right: 'var(--bloom-right)',
  left: 'var(--bloom-left)',
  wait: 'var(--bloom-wait)',
  struck: '0 0 12px rgba(255,255,255,0.45)',
};

/**
 * A real piano keyboard, laid out the way the falling-notes renderer lays one
 * out: white keys share the width evenly and black keys straddle the seam
 * between them.
 *
 * This is the product's recurring structural device, so it is one component
 * used at every size — the full-width instrument under the hero, the preview in
 * the keyboard-size picker, and the hairline rule between sections.
 */
const Keyboard: React.FC<KeyboardProps> = ({
  lowestMidi,
  highestMidi,
  active = null,
  height = 96,
  onPress,
  onRelease,
  labelOctaves = false,
  className = '',
  decorative = false,
  tone = 'lit',
  litRange = null,
}) => {
  const { whites, blacks, whiteCount } = useMemo(() => {
    const whiteKeys: number[] = [];
    const blackKeys: { midi: number; afterWhiteIndex: number }[] = [];

    for (let midi = lowestMidi; midi <= highestMidi; midi += 1) {
      if (isBlackKey(midi)) {
        // A black key sits on the seam after the white key below it. When the
        // range opens on a black key there is no white key to hang it on, so
        // it is dropped rather than drawn floating.
        if (whiteKeys.length > 0) {
          blackKeys.push({ midi, afterWhiteIndex: whiteKeys.length - 1 });
        }
      } else {
        whiteKeys.push(midi);
      }
    }

    return {
      whites: whiteKeys,
      blacks: blackKeys,
      whiteCount: whiteKeys.length,
    };
  }, [lowestMidi, highestMidi]);

  if (whiteCount === 0) return null;

  const interactive = Boolean(onPress);
  const baseShadow = tone === 'shadow';
  /** A key is in shadow when the tone says so, or when it is out of range. */
  const isShadow = (midi: number): boolean =>
    baseShadow ||
    (litRange !== null && (midi < litRange[0] || midi > litRange[1]));
  const whiteWidthPct = 100 / whiteCount;
  const blackWidthPct = whiteWidthPct * 0.58;

  const pressHandlers = (midi: number) =>
    interactive
      ? {
          onPointerDown: (event: React.PointerEvent) => {
            event.preventDefault();
            onPress?.(midi);
          },
          onPointerUp: () => onRelease?.(midi),
          onPointerLeave: (event: React.PointerEvent) => {
            if (event.buttons > 0) onRelease?.(midi);
          },
          onKeyDown: (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onPress?.(midi);
            }
          },
          onKeyUp: (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') onRelease?.(midi);
          },
        }
      : {};

  return (
    <div
      className={`instrument relative w-full ${className}`}
      style={{ height }}
      role={decorative ? 'presentation' : 'group'}
      aria-hidden={decorative || undefined}
    >
      {/* White keys share the full width. */}
      <div className="absolute inset-0 flex">
        {whites.map((midi) => {
          const hand = active?.get(midi);
          const isC = midi % 12 === 0;
          return (
            <div
              key={midi}
              {...pressHandlers(midi)}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? -1 : undefined}
              aria-label={interactive ? midiToNoteName(midi) : undefined}
              className={`${
                isShadow(midi) ? 'keycap-white-shadow' : 'keycap-white'
              } relative ${interactive ? 'cursor-pointer' : ''} ${
                hand ? 'keydown' : ''
              }`}
              style={{
                width: `${whiteWidthPct}%`,
                background: hand
                  ? `linear-gradient(180deg, ${HAND_FILL[hand]} 0%, color-mix(in srgb, ${HAND_FILL[hand]} 76%, black) 100%)`
                  : undefined,
                boxShadow: hand ? HAND_BLOOM[hand] : undefined,
                transition:
                  'background var(--t-tap) var(--ease-strike), box-shadow var(--t-quick) var(--ease-strike)',
                zIndex: 1,
              }}
            >
              {labelOctaves && isC && (
                <span className="numeric absolute bottom-1 left-0 right-0 text-center text-[9px] font-medium text-ebony/45">
                  {midiToNoteName(midi)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Black keys straddle the seam, drawn over the white ones. */}
      <div className="absolute inset-0 pointer-events-none">
        {blacks.map(({ midi, afterWhiteIndex }) => {
          const hand = active?.get(midi);
          return (
            <div
              key={midi}
              {...pressHandlers(midi)}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? -1 : undefined}
              aria-label={interactive ? midiToNoteName(midi) : undefined}
              className={`${
                isShadow(midi) ? 'keycap-black-shadow' : 'keycap-black'
              } absolute top-0 ${
                interactive ? 'cursor-pointer pointer-events-auto' : ''
              } ${hand ? 'keydown' : ''}`}
              style={{
                left: `${(afterWhiteIndex + 1) * whiteWidthPct - blackWidthPct / 2}%`,
                width: `${blackWidthPct}%`,
                height: '62%',
                background: hand
                  ? `linear-gradient(180deg, ${HAND_FILL[hand]} 0%, color-mix(in srgb, ${HAND_FILL[hand]} 62%, black) 100%)`
                  : undefined,
                boxShadow: hand ? HAND_BLOOM[hand] : undefined,
                transition:
                  'background var(--t-tap) var(--ease-strike), box-shadow var(--t-quick) var(--ease-strike)',
                zIndex: 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Keyboard;
