import { useState, useEffect, useCallback } from 'react';
import pianoService from '../services/pianoService';
import type { PianoEngineState } from '../features/audio/PianoEngine';

interface UsePianoReturn {
  /** El piano ya se puede tocar (aunque las muestras sigan descargando). */
  isReady: boolean;
  isLoading: boolean;
  /** 0..1 de muestras descargadas, para barras de progreso. */
  loadProgress: number;
  /** true cuando suena con muestras reales; false si va con el sintetizador. */
  isSampled: boolean;
  error: string | null;
  playNote: (note: string, duration?: string | number, velocity?: number, octave?: number) => Promise<void>;
  playChord: (notes: string[], duration?: string | number, velocity?: number) => Promise<void>;
  stopAllNotes: () => void;
  initialize: () => Promise<void>;
  triggerAttack: (note: string, velocity?: number, octave?: number) => void;
  triggerRelease: (note: string, octave?: number) => void;
  setSustain: (down: boolean) => void;
  setVolume: (volume: number) => void;
  click: (accent?: boolean) => void;
}

export const usePiano = (): UsePianoReturn => {
  const [state, setState] = useState<PianoEngineState>(() => pianoService.getState());

  // El estado vive en el motor (singleton), asi que todos los componentes que
  // usan el hook comparten carga y progreso en vez de reinicializar cada uno.
  useEffect(() => pianoService.subscribe(setState), []);

  const initialize = useCallback(async () => {
    await pianoService.initialize();
  }, []);

  const playNote = useCallback(
    async (note: string, duration: string | number = '8n', velocity: number = 0.8, octave?: number) => {
      await pianoService.playNote(note, duration, velocity, octave);
    },
    [],
  );

  const playChord = useCallback(
    async (notes: string[], duration: string | number = '4n', velocity: number = 0.6) => {
      await pianoService.playChord(notes, duration, velocity);
    },
    [],
  );

  const stopAllNotes = useCallback(() => {
    pianoService.stopAllNotes();
  }, []);

  const triggerAttack = useCallback((note: string, velocity: number = 0.8, octave?: number) => {
    pianoService.triggerAttack(note, velocity, octave);
  }, []);

  const triggerRelease = useCallback((note: string, octave?: number) => {
    pianoService.triggerRelease(note, octave);
  }, []);

  const setSustain = useCallback((down: boolean) => {
    pianoService.setSustain(down);
  }, []);

  const setVolume = useCallback((volume: number) => {
    pianoService.setVolume(volume);
  }, []);

  const click = useCallback((accent = false) => {
    pianoService.click(accent);
  }, []);

  /**
   * Los navegadores no permiten crear el AudioContext sin gesto de usuario, asi
   * que se arranca la carga con el primer clic/tecla en vez de al montar.
   */
  useEffect(() => {
    if (pianoService.getState().status !== 'idle') return;

    const unlock = () => {
      void pianoService.initialize();
    };
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, unlock, { once: true }));
    return () => events.forEach((event) => window.removeEventListener(event, unlock));
  }, []);

  const progress = state.progress;

  return {
    // El motor suena siempre (muestras o sintetizador de respaldo), asi que
    // isReady no bloquea la interaccion y no se "come" la primera nota; para
    // el estado real de la descarga estan isSampled y loadProgress.
    isReady: true,
    isLoading: state.status === 'loading',
    loadProgress: progress && progress.total > 0 ? progress.loaded / progress.total : 0,
    isSampled: state.status === 'sampled',
    error: state.error,
    playNote,
    playChord,
    stopAllNotes,
    initialize,
    triggerAttack,
    triggerRelease,
    setSustain,
    setVolume,
    click,
  };
};
