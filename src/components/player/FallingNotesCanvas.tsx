import React, { useEffect, useRef } from 'react';
import { FallingNotesRenderer } from '../../features/renderer/FallingNotes';
import type { Player } from '../../features/player/Player';
import type { ParsedSong } from '../../features/midi/types';

interface FallingNotesCanvasProps {
  player: Player;
  song: ParsedSong | null;
  showNoteNames: boolean;
  showMeasures: boolean;
  /** Permite tocar el teclado de abajo con raton o dedo. */
  interactive?: boolean;
  className?: string;
}

/**
 * Canvas de notas cayendo. Toda la animacion vive en el renderer; React solo
 * monta el canvas y traduce los eventos de puntero a notas.
 */
const FallingNotesCanvas: React.FC<FallingNotesCanvasProps> = ({
  player,
  song,
  showNoteNames,
  showMeasures,
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<FallingNotesRenderer | null>(null);
  const pointersRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new FallingNotesRenderer(canvas, player);
    rendererRef.current = renderer;
    renderer.start();
    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [player]);

  useEffect(() => {
    rendererRef.current?.syncSong(song);
  }, [song]);

  useEffect(() => {
    rendererRef.current?.setOptions({ showNoteNames, showMeasures });
  }, [showNoteNames, showMeasures]);

  const midiFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): number | null => {
    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    if (!canvas || !renderer) return null;
    const rect = canvas.getBoundingClientRect();
    return renderer.hitTest(event.clientX - rect.left, event.clientY - rect.top);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const midi = midiFromEvent(event);
    if (midi === null) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, midi);
    player.keyDown(midi, 0.75);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const current = pointersRef.current.get(event.pointerId);
    if (current === undefined) return;
    const midi = midiFromEvent(event);
    if (midi === null || midi === current) return;
    // Glissando: al arrastrar se suelta la tecla anterior y suena la nueva.
    player.keyUp(current);
    pointersRef.current.set(event.pointerId, midi);
    player.keyDown(midi, 0.7);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const current = pointersRef.current.get(event.pointerId);
    if (current === undefined) return;
    player.keyUp(current);
    pointersRef.current.delete(event.pointerId);
  };

  useEffect(() => {
    const pointers = pointersRef.current;
    return () => {
      pointers.forEach((midi) => player.keyUp(midi));
      pointers.clear();
    };
  }, [player]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block touch-none select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
};

export default FallingNotesCanvas;
