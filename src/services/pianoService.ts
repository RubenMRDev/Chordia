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

  async playNote(note: string, duration: string = "8n", velocity: number = 0.8): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.piano) {
      console.error('Piano not initialized');
      return;
    }

    try {
      // Convert note format (e.g., "C", "Cs", "D" to "C4", "C#4", "D4")
      const normalizedNote = this.normalizeNote(note);
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

  private normalizeNote(note: string): string {
    // Convert note format from "C", "Cs", "D", etc. to "C4", "C#4", "D4", etc.
    const noteMap: { [key: string]: string } = {
      'C': 'C4', 'Cs': 'C#4', 'C#': 'C#4',
      'D': 'D4', 'Ds': 'D#4', 'D#': 'D#4',
      'E': 'E4', 'Es': 'E#4', 'E#': 'E#4',
      'F': 'F4', 'Fs': 'F#4', 'F#': 'F#4',
      'G': 'G4', 'Gs': 'G#4', 'G#': 'G#4',
      'A': 'A4', 'As': 'A#4', 'A#': 'A#4',
      'B': 'B4', 'Bs': 'B#4', 'B#': 'B#4',
    };

    return noteMap[note] || 'C4'; // Default to C4 if note not found
  }

  // Method to get available notes for testing
  getAvailableNotes(): string[] {
    return ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
  }

  // Method to check if service is ready
  isReady(): boolean {
    return this.isInitialized && this.piano !== null;
  }
}

// Create a singleton instance
const pianoService = new PianoService();

export default pianoService; 