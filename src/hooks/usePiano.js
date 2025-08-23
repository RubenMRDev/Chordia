import { useState, useEffect, useCallback } from 'react';
import pianoService from '../services/pianoService';
export const usePiano = () => {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const initialize = useCallback(async () => {
        if (isReady || isLoading)
            return;
        setIsLoading(true);
        try {
            await pianoService.initialize();
            setIsReady(true);
        }
        catch (error) {
            console.error('Failed to initialize piano:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [isReady, isLoading]);
    const playNote = useCallback(async (note, duration = "8n", velocity = 0.8, octave) => {
        if (!isReady) {
            await initialize();
        }
        await pianoService.playNote(note, duration, velocity, octave);
    }, [isReady, initialize]);
    const playChord = useCallback(async (notes, duration = "4n", velocity = 0.6) => {
        if (!isReady) {
            await initialize();
        }
        await pianoService.playChord(notes, duration, velocity);
    }, [isReady, initialize]);
    const stopAllNotes = useCallback(() => {
        pianoService.stopAllNotes();
    }, []);
    const triggerAttack = useCallback((note, velocity = 0.8, octave) => {
        pianoService.triggerAttack(note, velocity, octave);
    }, []);
    const triggerRelease = useCallback((note, octave) => {
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
