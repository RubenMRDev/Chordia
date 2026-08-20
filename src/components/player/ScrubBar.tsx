import React, { useCallback, useRef, useState } from 'react';
import { formatTime } from '../../features/player/format';

interface ScrubBarProps {
  time: number;
  duration: number;
  onSeek: (time: number) => void;
}

/** Barra de progreso con arrastre para moverse por la cancion. */
const ScrubBar: React.FC<ScrubBarProps> = ({ time, duration, onSeek }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(0);

  const timeFromEvent = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track || duration <= 0) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
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
      <span className="text-xs text-[var(--text-secondary)] tabular-nums w-10 text-right">
        {formatTime(current)}
      </span>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Posicion de la cancion"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(current)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') onSeek(Math.max(0, time - 5));
          if (event.key === 'ArrowRight') onSeek(Math.min(duration, time + 5));
        }}
        className="relative flex-1 h-2 rounded-full bg-white/10 cursor-pointer touch-none"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent-green)]"
          style={{ width: `${ratio * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow"
          style={{ left: `${ratio * 100}%` }}
        />
      </div>
      <span className="text-xs text-[var(--text-secondary)] tabular-nums w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ScrubBar;
