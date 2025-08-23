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
export declare const usePiano: () => UsePianoReturn;
export {};
