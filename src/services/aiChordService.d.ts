export interface AIChordRequest {
    style: string;
    mood: string;
    key: string;
    length: number;
    complexity: 'simple' | 'medium' | 'complex';
    description?: string;
}
export interface AIChordResponse {
    chords: string[];
    progression: string[];
    explanation: string;
}
declare class AIChordService {
    private static instance;
    private isInitialized;
    private constructor();
    static getInstance(): AIChordService;
    private initialize;
    generateChordProgression(request: AIChordRequest): Promise<AIChordResponse>;
    private buildPrompt;
    private getComplexityDescription;
    private normalizeChordName;
    convertChordsToPianoKeys(chords: string[]): string[][];
    getAvailableChords(): string[];
}
declare const _default: AIChordService;
export default _default;
