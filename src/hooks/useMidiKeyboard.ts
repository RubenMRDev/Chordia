import { useCallback, useEffect, useRef, useState } from 'react';
import type { Player } from '../features/player/Player';

/**
 * Entrada desde un teclado MIDI fisico, conectada directamente al Player.
 *
 * A diferencia de useMIDI (que gestiona el selector de dispositivos de las
 * pantallas antiguas), aqui se escuchan TODAS las entradas a la vez: se enchufa
 * el teclado y funciona, sin elegir nada. Tambien se respeta la velocidad real
 * de pulsacion y el pedal de sustain (CC64).
 */

export interface MidiKeyboardState {
  supported: boolean;
  connected: boolean;
  deviceNames: string[];
  error: string | null;
  /** Ultima nota recibida, util para dar feedback en la UI. */
  lastNote: number | null;
}

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const CONTROL_CHANGE = 0xb0;
const SUSTAIN_CC = 64;

export function useMidiKeyboard(player: Player): MidiKeyboardState & { reconnect: () => void } {
  const [state, setState] = useState<MidiKeyboardState>({
    supported: typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator,
    connected: false,
    deviceNames: [],
    error: null,
    lastNote: null,
  });

  const accessRef = useRef<WebMidi.MIDIAccess | null>(null);
  const [attempt, setAttempt] = useState(0);

  const reconnect = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!('requestMIDIAccess' in navigator)) {
      setState((previous) => ({ ...previous, supported: false }));
      return;
    }

    let cancelled = false;
    const inputs: WebMidi.MIDIInput[] = [];

    const handleMessage = (event: WebMidi.MIDIMessageEvent) => {
      const [status, data1, data2] = event.data;
      const command = status & 0xf0;

      if (command === NOTE_ON && data2 > 0) {
        player.keyDown(data1, Math.max(data2 / 127, 0.08));
        setState((previous) => ({ ...previous, lastNote: data1 }));
      } else if (command === NOTE_OFF || (command === NOTE_ON && data2 === 0)) {
        player.keyUp(data1);
      } else if (command === CONTROL_CHANGE && data1 === SUSTAIN_CC) {
        player.setSustain(data2 >= 64);
      }
    };

    const bind = (access: WebMidi.MIDIAccess) => {
      const names: string[] = [];
      access.inputs.forEach((input) => {
        input.onmidimessage = handleMessage;
        inputs.push(input);
        names.push(input.name || 'Teclado MIDI');
      });
      setState((previous) => ({
        ...previous,
        supported: true,
        connected: names.length > 0,
        deviceNames: names,
        error: null,
      }));
    };

    navigator
      .requestMIDIAccess()
      .then((access) => {
        if (cancelled) return;
        accessRef.current = access;
        bind(access);
        // Enchufar o desenchufar el teclado revincula las entradas.
        access.onstatechange = () => {
          inputs.forEach((input) => {
            input.onmidimessage = null;
          });
          inputs.length = 0;
          bind(access);
        };
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState((previous) => ({
          ...previous,
          connected: false,
          error: error instanceof Error ? error.message : 'No se pudo acceder al MIDI',
        }));
      });

    return () => {
      cancelled = true;
      inputs.forEach((input) => {
        input.onmidimessage = null;
      });
      if (accessRef.current) accessRef.current.onstatechange = null;
    };
  }, [player, attempt]);

  return { ...state, reconnect };
}
