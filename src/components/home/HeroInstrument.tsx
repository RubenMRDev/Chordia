import React, { useEffect, useRef } from 'react';
import { FallingNotesRenderer } from '@/features/renderer/FallingNotes';
import { AmbientSource } from '@/features/renderer/AmbientSource';
import { buildDemoMidi, DEMO_SONG_NAME } from '@/features/midi/demoSong';
import { parseMidiBuffer } from '@/features/midi/parseMidi';

/**
 * The first viewport's visual: the product's own falling-notes renderer running
 * the bundled demo piece.
 *
 * It is the real renderer rather than a decorative imitation, so what the home
 * page shows and what the player shows cannot drift apart. It is driven by
 * `AmbientSource` because the audio clock is frozen until the browser sees a
 * gesture, and an autoplaying `Player` would render a still frame.
 *
 * **It is a picture, not an instrument.** No pointer handling, no audio engine:
 * the home page's job is to show what the product does, and a visitor who
 * clicks the artwork expecting a link should not get a piano note instead.
 * Playing belongs in the player, where the transport, the hand routing and the
 * practice clock are all present.
 */
const HeroInstrument: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const source = new AmbientSource();
    const renderer = new FallingNotesRenderer(canvas, source);

    const song = parseMidiBuffer(buildDemoMidi(), DEMO_SONG_NAME);
    source.setSong(song);
    renderer.syncSong(song);
    renderer.setOptions({ showNoteNames: false, showMeasures: false });

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (reduced?.matches) {
      /*
        One still frame, parked a couple of seconds in so it shows notes in
        flight rather than the empty air before the piece starts.

        Redrawn after any resize and deferred by a task: the renderer keeps its
        own ResizeObserver, setting a canvas's width wipes its contents, and
        that observer fires once right after mount — so a frame drawn
        synchronously here is erased a moment later. `setTimeout` rather than
        `requestAnimationFrame` because rAF never fires in a background tab.
      */
      source.seek(2.4);

      let pending: number | null = null;
      const redraw = () => {
        if (pending !== null) window.clearTimeout(pending);
        pending = window.setTimeout(() => {
          pending = null;
          renderer.draw();
        }, 0);
      };

      redraw();
      const stillObserver = new ResizeObserver(redraw);
      stillObserver.observe(canvas);
      window.addEventListener('resize', redraw);

      return () => {
        if (pending !== null) window.clearTimeout(pending);
        stillObserver.disconnect();
        window.removeEventListener('resize', redraw);
        renderer.dispose();
      };
    }

    source.start();
    renderer.start();

    // Off-screen the canvas costs nothing: a hero animation that keeps a
    // laptop's fan going while the visitor reads further down is a defect.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          source.start();
          renderer.start();
        } else {
          renderer.stop();
          source.stop();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        renderer.stop();
        source.stop();
      } else {
        source.start();
        renderer.start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block w-full h-full pointer-events-none select-none ${className}`}
    />
  );
};

export default HeroInstrument;
