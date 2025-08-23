import * as Tone from 'tone';
class PianoService {
    constructor() {
        Object.defineProperty(this, "piano", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isInitializing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Use Tone.start() to resume the context
        Tone.start();
    }
    async initialize() {
        if (this.isInitialized || this.isInitializing) {
            return;
        }
        this.isInitializing = true;
        try {
            this.piano = new Tone.Sampler({
                urls: {
                    "C4": "C4.mp3",
                    "D#4": "Ds4.mp3",
                    "F#4": "Fs4.mp3",
                },
                release: 1,
                baseUrl: "https://tonejs.github.io/audio/salamander/",
            }).toDestination();
            await this.piano.loaded;
            this.isInitialized = true;
            console.log('Piano service initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize piano service:', error);
            this.piano = new Tone.Synth({
                oscillator: {
                    type: "triangle"
                },
                envelope: {
                    attack: 0.1,
                    decay: 0.2,
                    sustain: 0.3,
                    release: 1
                }
            }).toDestination();
            this.isInitialized = true;
        }
        finally {
            this.isInitializing = false;
        }
    }
    async playNote(note, duration = "8n", velocity = 0.8, octave) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        if (!this.piano) {
            console.error('Piano not initialized');
            return;
        }
        try {
            const normalizedNote = this.normalizeNote(note, octave);
            this.piano.triggerAttackRelease(normalizedNote, duration, undefined, velocity);
        }
        catch (error) {
            console.error(`Error playing note ${note}:`, error);
        }
    }
    async playChord(notes, duration = "4n", velocity = 0.6) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        if (!this.piano) {
            console.error('Piano not initialized');
            return;
        }
        try {
            const normalizedNotes = notes.map(note => this.normalizeNote(note));
            normalizedNotes.forEach(note => {
                this.piano.triggerAttack(note, undefined, velocity);
            });
            setTimeout(() => {
                normalizedNotes.forEach(note => {
                    this.piano.triggerRelease(note);
                });
            }, Tone.Time(duration).toMilliseconds());
        }
        catch (error) {
            console.error(`Error playing chord ${notes}:`, error);
        }
    }
    stopAllNotes() {
        if (this.piano) {
            this.piano.releaseAll();
        }
    }
    normalizeNote(note, octave) {
        const targetOctave = octave !== undefined ? octave : 4;
        const noteMap = {
            'C': `C${targetOctave}`, 'Cs': `C#${targetOctave}`, 'C#': `C#${targetOctave}`,
            'D': `D${targetOctave}`, 'Ds': `D#${targetOctave}`, 'D#': `D#${targetOctave}`,
            'E': `E${targetOctave}`, 'Es': `E#${targetOctave}`, 'E#': `E#${targetOctave}`,
            'F': `F${targetOctave}`, 'Fs': `F#${targetOctave}`, 'F#': `F#${targetOctave}`,
            'G': `G${targetOctave}`, 'Gs': `G#${targetOctave}`, 'G#': `G#${targetOctave}`,
            'A': `A${targetOctave}`, 'As': `A#${targetOctave}`, 'A#': `A#${targetOctave}`,
            'B': `B${targetOctave}`, 'Bs': `B#${targetOctave}`, 'B#': `B#${targetOctave}`,
        };
        return noteMap[note] || `C${targetOctave}`;
    }
    getAvailableNotes() {
        return ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
    }
    isReady() {
        return this.isInitialized && this.piano !== null;
    }
    triggerAttack(note, velocity = 0.8, octave) {
        if (!this.piano)
            return;
        const normalizedNote = this.normalizeNote(note, octave);
        this.piano.triggerAttack(normalizedNote, undefined, velocity);
    }
    triggerRelease(note, octave) {
        if (!this.piano)
            return;
        const normalizedNote = this.normalizeNote(note, octave);
        this.piano.triggerRelease(normalizedNote);
    }
    stopNote(note, octave) {
        if (!this.piano)
            return;
        const normalizedNote = this.normalizeNote(note, octave);
        this.piano.triggerRelease(normalizedNote);
    }
    stopChord(notes, octave) {
        if (!this.piano)
            return;
        notes.forEach(note => {
            const normalizedNote = this.normalizeNote(note, octave);
            this.piano.triggerRelease(normalizedNote);
        });
    }
    setVolume(volume) {
        if (this.piano?.volume !== undefined) {
            this.piano.volume = volume;
        }
    }
    setInstrument(_instrument) {
        this.isInitialized = false;
        this.piano = null;
    }
}
const pianoService = new PianoService();
export default pianoService;
