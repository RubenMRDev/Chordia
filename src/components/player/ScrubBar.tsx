import React, { useCallback, useRef, useState } from 'react';
import { formatTime } from '@/features/player/format';
import { useT } from '@/i18n';

interface ScrubBarProps {
  time: number;
  duration: number;
  onSeek: (time: number) => void;
}

/** Progress bar you can drag to move through the piece. */
const ScrubBar: React.FC<ScrubBarProps> = ({ time, duration, onSeek }) => {
  const { t } = useT();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(0);

  const timeFromEvent = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track || duration <= 0) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width),
      );
      return ratio * duration;
    },
    [duration],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = timeFromEvent(event.clientX);
    setDragging(true);
    setPreview(next);
    onSeek(next);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const next = timeFromEvent(event.clientX);
    setPreview(next);
    onSeek(next);
  };

  const handlePointerUp = () => setDragging(false);

  const current = dragging ? preview : time;
  const ratio = duration > 0 ? Math.min(1, current / duration) : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="numeric w-11 text-right text-[12px] text-ink-low">
        {formatTime(current)}
      </span>

      <div
        ref={trackRef}
        role="slider"
        aria-label={t('player.position')}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(current)}
        aria-valuetext={formatTime(current)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') onSeek(Math.max(0, time - 5));
          if (event.key === 'ArrowRight') onSeek(Math.min(duration, time + 5));
        }}
        className="group relative flex-1 h-2 rounded-full bg-ground-4 cursor-pointer touch-none"
      >
        {/* Played so far, in the right hand's colour. */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-hand-right"
          style={{ width: `${ratio * 100}%` }}
        />
        {/*
          The head is a struck key: it lights while it is being dragged, using
          the same bloom the keyboard uses.
        */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-ivory transition-shadow duration-[var(--t-quick)]"
          style={{
            left: `${ratio * 100}%`,
            boxShadow: dragging
              ? 'var(--bloom-right)'
              : '0 1px 3px rgba(4,8,16,0.6)',
          }}
        />
      </div>

      <span className="numeric w-11 text-[12px] text-ink-low">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ScrubBar;
