declare class PianoService {
    private piano;
    private isInitialized;
    private isInitializing;
    constructor();
    initialize(): Promise<void>;
    playNote(note: string, duration?: string, velocity?: number, octave?: number): Promise<void>;
    playChord(notes: string[], duration?: string, velocity?: number): Promise<void>;
    stopAllNotes(): void;
    private normalizeNote;
    getAvailableNotes(): string[];
    isReady(): boolean;
    triggerAttack(note: string, velocity?: number, octave?: number): void;
    triggerRelease(note: string, octave?: number): void;
    stopNote(note: string, octave?: number): void;
    stopChord(notes: string[], octave?: number): void;
    setVolume(volume: number): void;
    setInstrument(_instrument: string): void;
}
declare const pianoService: PianoService;
export default pianoService;
