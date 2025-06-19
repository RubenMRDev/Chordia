import * as Tone from 'tone';

class PianoService {
  private piano: Tone.Sampler | null = null;
  private isInitialized = false;
  private isInitializing = false;

  constructor() {
    // Initialize Tone.js context
    Tone.context.resume();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      // Create a sampler with piano samples
      // Using a simple piano sample set that's available online
      this.piano = new Tone.Sampler({
        urls: {
          "C4": "C4.mp3",
          "D#4": "Ds4.mp3", 
          "F#4": "Fs4.mp3",
        },
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination();

      // Wait for the samples to load
      await Tone.loaded();
      
      this.isInitialized = true;
      console.log('Piano service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize piano service:', error);
      // Fallback to basic synth if samples fail to load
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
    } finally {
      this.isInitializing = false;
    }
  }

  async playNote(note: string, duration: string = "8n", velocity: number = 0.8, octave?: number): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.piano) {
      console.error('Piano not initialized');
      return;
    }

    try {
      // Convert note format (e.g., "C", "Cs", "D" to "C4", "C#4", "D4")
      const normalizedNote = this.normalizeNote(note, octave);
      this.piano.triggerAttackRelease(normalizedNote, duration, undefined, velocity);
    } catch (error) {
      console.error(`Error playing note ${note}:`, error);
    }
  }

  async playChord(notes: string[], duration: string = "4n", velocity: number = 0.6): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.piano) {
      console.error('Piano not initialized');
      return;
    }

    try {
      // Convert all notes to the same format
      const normalizedNotes = notes.map(note => this.normalizeNote(note));
      
      // Play all notes simultaneously
      normalizedNotes.forEach(note => {
        this.piano!.triggerAttack(note, undefined, velocity);
      });

      // Release all notes after the specified duration
      setTimeout(() => {
        normalizedNotes.forEach(note => {
          this.piano!.triggerRelease(note);
        });
      }, Tone.Time(duration).toMilliseconds());
    } catch (error) {
      console.error(`Error playing chord ${notes}:`, error);
    }
  }

  stopAllNotes(): void {
    if (this.piano) {
      this.piano.releaseAll();
    }
  }

  private normalizeNote(note: string, octave?: number): string {
    // Use provided octave or default to 4
    const targetOctave = octave !== undefined ? octave : 4;
    
    // Convert note format from "C", "Cs", "D", etc. to "C4", "C#4", "D4", etc.
    const noteMap: { [key: string]: string } = {
      'C': `C${targetOctave}`, 'Cs': `C#${targetOctave}`, 'C#': `C#${targetOctave}`,
      'D': `D${targetOctave}`, 'Ds': `D#${targetOctave}`, 'D#': `D#${targetOctave}`,
      'E': `E${targetOctave}`, 'Es': `E#${targetOctave}`, 'E#': `E#${targetOctave}`,
      'F': `F${targetOctave}`, 'Fs': `F#${targetOctave}`, 'F#': `F#${targetOctave}`,
      'G': `G${targetOctave}`, 'Gs': `G#${targetOctave}`, 'G#': `G#${targetOctave}`,
      'A': `A${targetOctave}`, 'As': `A#${targetOctave}`, 'A#': `A#${targetOctave}`,
      'B': `B${targetOctave}`, 'Bs': `B#${targetOctave}`, 'B#': `B#${targetOctave}`,
    };

    return noteMap[note] || `C${targetOctave}`; // Default to C in target octave if note not found
  }

  // Method to get available notes for testing
  getAvailableNotes(): string[] {
    return ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
  }

  // Method to check if service is ready
  isReady(): boolean {
    return this.isInitialized && this.piano !== null;
  }

  triggerAttack(note: string, velocity: number = 0.8, octave?: number): void {
    if (!this.piano) return;
    const normalizedNote = this.normalizeNote(note, octave);
    this.piano.triggerAttack(normalizedNote, undefined, velocity);
  }

  triggerRelease(note: string, octave?: number): void {
    if (!this.piano) return;
    const normalizedNote = this.normalizeNote(note, octave);
    this.piano.triggerRelease(normalizedNote);
  }
}

// Create a singleton instance
const pianoService = new PianoService();

export default pianoService; 