import { useEffect, useMemo } from 'react';
import type { Player } from '../features/player/Player';

/**
 * Teclado del ordenador como piano, para quien no tenga un teclado MIDI.
 *
 * Dos octavas: la fila de abajo (z,x,c...) es la octava baja y la de arriba
 * (q,w,e...) la alta. Shift hace de pedal de sustain.
 */
const LOWER_ROW = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', ','];
const UPPER_ROW = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i'];

export interface ComputerKeyboardOptions {
  enabled?: boolean;
  /** Nota MIDI de la tecla "z" (por defecto C3). */
  baseMidi?: number;
  /** Se llama con la tecla espaciadora. */
  onToggle?: () => void;
  /** Se llama con las flechas izquierda/derecha (segundos relativos). */
  onSeek?: (deltaSeconds: number) => void;
}

export function useComputerKeyboard(player: Player, options: ComputerKeyboardOptions = {}): Map<string, number> {
  const { enabled = true, baseMidi = 48, onToggle, onSeek } = options;

  const mapping = useMemo(() => {
    const map = new Map<string, number>();
    LOWER_ROW.forEach((key, index) => map.set(key, baseMidi + index));
    UPPER_ROW.forEach((key, index) => map.set(key, baseMidi + 12 + index));
    return map;
  }, [baseMidi]);

  useEffect(() => {
    if (!enabled) return;

    const held = new Set<string>();

    const isTyping = (target: EventTarget | null): boolean => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      const tag = element.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
    };

    const handleDown = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return;

      if (event.code === 'Space') {
        event.preventDefault();
        onToggle?.();
        return;
      }
      if (event.code === 'ArrowLeft') {
        event.preventDefault();
        onSeek?.(-5);
        return;
      }
      if (event.code === 'ArrowRight') {
        event.preventDefault();
        onSeek?.(5);
        return;
      }
      if (event.key === 'Shift') {
        player.setSustain(true);
        return;
      }

      const key = event.key.toLowerCase();
      const midi = mapping.get(key);
      if (midi === undefined || held.has(key)) return;
      held.add(key);
      event.preventDefault();
      player.keyDown(midi, 0.72);
    };

    const handleUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        player.setSustain(false);
        return;
      }
      const key = event.key.toLowerCase();
      const midi = mapping.get(key);
      if (midi === undefined) return;
      held.delete(key);
      player.keyUp(midi);
    };

    // Al perder el foco se sueltan las teclas: si no, se quedan sonando.
    const handleBlur = () => {
      held.forEach((key) => {
        const midi = mapping.get(key);
        if (midi !== undefined) player.keyUp(midi);
      });
      held.clear();
      player.setSustain(false);
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      window.removeEventListener('blur', handleBlur);
      handleBlur();
    };
  }, [enabled, mapping, onSeek, onToggle, player]);

  return mapping;
}
