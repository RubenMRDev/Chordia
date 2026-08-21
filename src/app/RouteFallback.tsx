import React from 'react';

/**
 * Shown while a route chunk loads.
 *
 * Deliberately not a spinner: it draws the keyboard the product is built
 * around, at the size the page is about to fill, so the wait reads as the
 * instrument arriving rather than as a stall. It fades in after 200 ms so a
 * fast chunk never flashes anything at all.
 */
const RouteFallback: React.FC = () => (
  <div
    className="min-h-[60vh] flex items-end justify-center pb-16 opacity-0 animate-[rise_240ms_var(--ease-strike)_200ms_forwards]"
    role="status"
    aria-live="polite"
  >
    <div aria-hidden className="flex items-end gap-[3px] h-16">
      {Array.from({ length: 21 }, (_, index) => {
        // A repeating white/black pattern, so the silhouette is a keyboard and
        // not a bar chart.
        const isBlack = [1, 3, 6, 8, 10, 13, 15, 18, 20].includes(index);
        return (
          <span
            key={index}
            className={isBlack ? 'keycap-black' : 'keycap-white'}
            style={{
              width: isBlack ? 8 : 13,
              height: isBlack ? '62%' : '100%',
              opacity: 0.18,
              animation: 'sustain 1.8s var(--ease-settle) infinite',
              animationDelay: `${index * 55}ms`,
            }}
          />
        );
      })}
    </div>
  </div>
);

export default RouteFallback;
