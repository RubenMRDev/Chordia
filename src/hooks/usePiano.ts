import { useState, useEffect, useCallback } from 'react';
import pianoService from '../services/pianoService';

interface UsePianoReturn {
  isReady: boolean;
  isLoading: boolean;
  playNote: (note: string, duration?: string, velocity?: number, octave?: number) => Promise<void>;
  playChord: (notes: string[], duration?: string, velocity?: number) => Promise<void>;
  stopAllNotes: () => void;
  initialize: () => Promise<void>;
  triggerAttack: (note: string, velocity?: number, octave?: number) => void;
  triggerRelease: (note: string, octave?: number) => void;
}

export const usePiano = (): UsePianoReturn => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialize = useCallback(async () => {
    if (isReady || isLoading) return;
    
    setIsLoading(true);
    try {
      await pianoService.initialize();
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize piano:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isReady, isLoading]);

  const playNote = useCallback(async (note: string, duration: string = "8n", velocity: number = 0.8, octave?: number) => {
    if (!isReady) {
      await initialize();
    }
    await pianoService.playNote(note, duration, velocity, octave);
  }, [isReady, initialize]);

  const playChord = useCallback(async (notes: string[], duration: string = "4n", velocity: number = 0.6) => {
    if (!isReady) {
      await initialize();
    }
    await pianoService.playChord(notes, duration, velocity);
  }, [isReady, initialize]);

  const stopAllNotes = useCallback(() => {
    pianoService.stopAllNotes();
  }, []);

  const triggerAttack = useCallback((note: string, velocity: number = 0.8, octave?: number) => {
    pianoService.triggerAttack(note, velocity, octave);
  }, []);

  const triggerRelease = useCallback((note: string, octave?: number) => {
    pianoService.triggerRelease(note, octave);
  }, []);

  // Auto-initialize when hook is first used
  useEffect(() => {
    if (!isReady && !isLoading) {
      initialize();
    }
  }, [isReady, isLoading, initialize]);

  return {
    isReady,
    isLoading,
    playNote,
    playChord,
    stopAllNotes,
    initialize,
    triggerAttack,
    triggerRelease
  };
}; 