import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaMusic, FaPlay, FaPause, FaStepForward, FaStepBackward, FaKeyboard, FaInfoCircle } from 'react-icons/fa';
import Header from '../components/Header';
import MIDITroubleshooting from '../components/MIDITroubleshooting';
import { getSongById } from '../api/songApi';
import { type Song, type ChordType } from '../firebase/songService';
import { useAuth } from '../context/AuthContext';
import { useMIDI } from '../hooks/useMIDI';
import { usePiano } from '../hooks/usePiano';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as ReactDOM from 'react-dom';

const LargePiano = ({ chord }: { chord: ChordType }) => {
  // Encuentra la nota más baja de todos los acordes (por octava)
  const allNotes = chord.keys;
  const midiNumbers = allNotes.map(key => {
    // Convierte nota+octava a número MIDI
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const match = key.match(/^([A-G]#?)(\d)$/);
    if (!match) return 60; // fallback C4
    const noteIdx = noteNames.indexOf(match[1]);
    const octave = parseInt(match[2]);
    return (octave + 1) * 12 + noteIdx;
  });
  const minMidi = Math.min(...midiNumbers);
  // Calcula la raíz de la octava más baja (C de esa octava)
  const minOctave = Math.floor(minMidi / 12) - 1;
  // Rango de 2 octavas
  const octavesToShow = [minOctave, minOctave + 1];
  // Genera todas las teclas de esas 2 octavas
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes = ['C#', 'D#', 'F#', 'G#', 'A#'];
  const keysToShow: { note: string, midi: number, isWhite: boolean, key: string }[] = [];
  octavesToShow.forEach(octave => {
    noteNames.forEach(note => {
      const isWhite = whiteNotes.includes(note);
      const midi = (octave + 1) * 12 + noteNames.indexOf(note);
      keysToShow.push({ note, midi, isWhite, key: `${note}${octave}` });
    });
  });
  // Para resaltar solo las teclas exactas
  const chordSet = new Set(chord.keys);

  // Filtrar blancas y negras
  const whiteKeys = keysToShow.filter(k => k.isWhite);
  const blackKeys = keysToShow.filter(k => !k.isWhite);

  return (
    <div className="relative h-[120px] w-full max-w-[500px] mx-auto">
      {/* Teclas blancas */}
      <div className="flex h-full w-full relative z-10">
        {whiteKeys.map((k, idx) => (
          <div
            key={`white-${k.key}`}
            className={`flex-1 h-full border border-gray-600 rounded-b-sm relative ${chordSet.has(k.key) ? "bg-[#00E676]" : "bg-white"}`}
          >
            <div className={`absolute bottom-[5px] w-full text-center text-xs ${chordSet.has(k.key) ? "text-white font-bold" : "text-black font-normal"}`}>{k.key}</div>
          </div>
        ))}
      </div>
      {/* Teclas negras */}
      <div className="absolute top-0 left-0 h-[60%] w-full z-20 pointer-events-none">
        {blackKeys.map((k, idx) => {
          // Encuentra la posición entre las blancas
          // C# va entre C y D, D# entre D y E, F# entre F y G, etc
          // Buscamos el índice de la blanca anterior
          const whiteIdx = whiteKeys.findIndex(wk => wk.midi > k.midi) - 1;
          if (whiteIdx < 0) return null;
          // Calcula el ancho de cada blanca
          const whiteWidth = 100 / whiteKeys.length;
          // Posiciona la negra centrada entre las dos blancas
          const left = `calc(${whiteIdx * whiteWidth}% + ${whiteWidth * 0.65}%)`;
          return (
            <div
              key={`black-${k.key}`}
              className={`absolute h-full w-[6%] border-x border-gray-600 rounded-b-sm box-border ${chordSet.has(k.key) ? "bg-[#00E676]" : "bg-black"}`}
              style={{ left }}
            >
              {chordSet.has(k.key) && (
                <div className="absolute bottom-[5px] w-full text-center text-white font-bold text-xs">{k.key}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SongDetailsPage: React.FC = () => {
  const { songId } = useParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { } = useAuth(); // Keep the hook call without storing the result
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [beatCount, setBeatCount] = useState<number>(0);
  const metronomeRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef<boolean>(true);
  const lastChordChangeRef = useRef<number | null>(null);
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(true);
  const [pianoSoundEnabled, setPianoSoundEnabled] = useState<boolean>(true);
  const currentBeatRef = useRef(0);
  const metronomeEnabledRef = useRef(metronomeEnabled);
  
  // Play Yourself state
  const [isPlayYourselfMode, setIsPlayYourselfMode] = useState<boolean>(false);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [showMIDIDialog, setShowMIDIDialog] = useState<boolean>(false);
  const [midiAccessRequested, setMidiAccessRequested] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);
  const [midiActive, setMidiActive] = useState<boolean>(false);
  
  // Piano hook
  const { isReady: pianoReady, playChord: playPianoChord, stopAllNotes, playNote: playPianoNote } = usePiano();
  
  // MIDI hook
  const {
    isSupported: midiSupported,
    devices: midiDevices,
    isConnected: midiConnected,
    currentDevice: midiCurrentDevice,
    error: midiError,
    isInitializing: midiInitializing,
    requestMIDIAccess,
    connectToDevice,
    setupMIDIHandler,
    disconnectDevice,
    refreshDevices,
    midiNoteToNoteName,
  } = useMIDI();

  // Ref to track if chord conversion test has been run
  const chordTestRunRef = useRef<boolean>(false);
  
  // Ref to track pressed keys for better chord detection
  const pressedKeysRef = useRef<Set<number>>(new Set());
  
  // Ref to track timeout for chord detection
  const chordCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to track key release timeouts
  const keyReleaseTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Demo mode keyboard mapping with multiple octaves
  const demoKeyMapping: { [key: string]: number } = {
    // Lower octave (C3 to E4)
    'z': 48, // C3
    'x': 49, // C#3
    'c': 50, // D3
    'v': 51, // D#3
    'b': 52, // E3
    'n': 53, // F3
    'm': 54, // F#3
    ',': 55, // G3
    '.': 56, // G#3
    '/': 57, // A3
    '1': 58, // A#3
    '2': 59, // B3
    '3': 60, // C4
    
    // Middle octave (C4 to E5) - original mapping
    'a': 60, // C4
    'w': 61, // C#4
    's': 62, // D4
    'e': 63, // D#4
    'd': 64, // E4
    'f': 65, // F4
    't': 66, // F#4
    'g': 67, // G4
    'y': 68, // G#4
    'h': 69, // A4
    'u': 70, // A#4
    'j': 71, // B4
    'k': 72, // C5
    'o': 73, // C#5
    'l': 74, // D5
    'p': 75, // D#5
    ';': 76, // E5
    
    // Upper octave (C5 to E6)
    'q': 72, // C5
    'r': 73, // C#5
    'i': 74, // D5
    '[': 75, // D#5
    ']': 76, // E5
    '\\': 77, // F5
    '4': 78, // F#5
    '5': 79, // G5
    '6': 80, // G#5
    '7': 81, // A5
    '8': 82, // A#5
    '9': 83, // B5
    '0': 84, // C6
  };

  // Generate dynamic key mapping based on song's chord octaves
  const generateDynamicKeyMapping = useCallback(() => {
    if (!song) return demoKeyMapping;
    
    // Extract all octaves from all chords in the song
    const allOctaves: number[] = [];
    song.chords.forEach(chord => {
      chord.keys.forEach(key => {
        const octaveMatch = key.match(/\d+/);
        if (octaveMatch) {
          allOctaves.push(parseInt(octaveMatch[0]));
        }
      });
    });
    
    if (allOctaves.length === 0) return demoKeyMapping;
    
    const minOctave = Math.min(...allOctaves);
    const maxOctave = Math.max(...allOctaves);
    
    // If the song only uses one octave, use a simplified mapping
    if (minOctave === maxOctave) {
      return {
        'a': 60, // C4
        'w': 61, // C#4
        's': 62, // D4
        'e': 63, // D#4
        'd': 64, // E4
        'f': 65, // F4
        't': 66, // F#4
        'g': 67, // G4
        'y': 68, // G#4
        'h': 69, // A4
        'u': 70, // A#4
        'j': 71, // B4
        'k': 72, // C5
        'o': 73, // C#5
        'l': 74, // D5
        'p': 75, // D#5
        ';': 76, // E5
      };
    }
    
    // If the song uses multiple octaves, use the full mapping
    return demoKeyMapping;
  }, [song]);

  const currentKeyMapping = generateDynamicKeyMapping();

  useEffect(() => {
    metronomeEnabledRef.current = metronomeEnabled;
  }, [metronomeEnabled]);

  useEffect(() => {
    const fetchSong = async () => {
      if (!songId) return;
      try {
        setLoading(true);
        const songData = await getSongById(songId);
        setSong(songData);
        // Reset chord test ref when song changes
        chordTestRunRef.current = false;
      } catch (err) {
        console.error('Error fetching song:', err);
        setError('Failed to load song details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [songId]);

  const getBeatsPerMeasure = (timeSignature: string = "4/4") => {
    const [numerator] = timeSignature.split('/').map(Number);
    return numerator;
  };

  const playChordSound = useCallback(async (chord: ChordType) => {
    console.log('playChordSound called with:', { chord, pianoSoundEnabled, pianoReady });
    if (!pianoSoundEnabled || !pianoReady) {
      console.log('Piano not ready:', { pianoSoundEnabled, pianoReady });
      return;
    }
    try {
      // Extrae solo los nombres de las notas sin octava
      const noteNames = chord.keys.map(key => {
        // Extrae el nombre de la nota sin octava (e.g., "C4" -> "C", "F#5" -> "F#")
        return key.replace(/\d/g, '');
      });
      
      console.log('Playing chord:', chord.keys, '-> Notes for piano:', noteNames);
      
      // Reproduce el acorde con las notas simples - el pianoService se encargará de las octavas
      await playPianoChord(noteNames, "4n", 0.6);
      console.log('Chord played successfully');
    } catch (error) {
      console.error('Error playing chord sound:', error);
    }
  }, [pianoSoundEnabled, pianoReady, playPianoChord]);

  const stopAllPianoSounds = useCallback(() => {
    stopAllNotes();
  }, [stopAllNotes]);

  useEffect(() => {
    if (!isPlaying || !song) return;
    const tempo = song.tempo || 120;
    const beatsPerMeasure = getBeatsPerMeasure(song.timeSignature);
    const beatDuration = 60000 / tempo;
    if (isFirstRenderRef.current) {
      setCurrentChordIndex(0);
      setBeatCount(0);
      currentBeatRef.current = 0;
      isFirstRenderRef.current = false;
      // Play the first chord immediately when starting playback
      if (pianoSoundEnabled && pianoReady) {
        playChordSound(song.chords[0]);
      }
    }
    const tick = (timestamp: number) => {
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = timestamp - lastTickTimeRef.current;
      if (elapsed >= beatDuration) {
        currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
        if (metronomeRef.current && metronomeEnabledRef.current) {
          metronomeRef.current.currentTime = 0;
          metronomeRef.current.play().catch(e => console.error("Couldn't play metronome:", e));
        }
        setBeatCount(currentBeatRef.current);
        if (currentBeatRef.current === 0) {
          setCurrentChordIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            return nextIndex >= song.chords.length ? 0 : nextIndex;
          });
          lastChordChangeRef.current = timestamp;
        }
        lastTickTimeRef.current = timestamp - (elapsed % beatDuration);
      }
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTickTimeRef.current = null;
      lastChordChangeRef.current = null;
      setBeatCount(0);
      currentBeatRef.current = 0;
      isFirstRenderRef.current = true;
      // Don't stop piano sounds here - let the play/pause handler manage that
    };
  }, [isPlaying, song, pianoSoundEnabled, playChordSound, pianoReady]);

  useEffect(() => {
    if (song && pianoSoundEnabled && pianoReady && !isFirstRenderRef.current && isPlaying) {
      playChordSound(song.chords[currentChordIndex]);
    }
  }, [currentChordIndex, song, pianoSoundEnabled, playChordSound, pianoReady, isPlaying]);

  const handleChordSelect = (index: number) => {
    setCurrentChordIndex(index);
    if (song && pianoSoundEnabled && pianoReady) {
      playChordSound(song.chords[index]);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying && song) {
      setBeatCount(0);
      lastTickTimeRef.current = null;
      // Play the current chord immediately when starting playback
      if (pianoSoundEnabled && pianoReady) {
        playChordSound(song.chords[currentChordIndex]);
      }
    } else {
      // Stop all piano sounds when pausing
      stopAllPianoSounds();
    }
    setIsPlaying(prev => !prev);
  };

  const handleNextChord = () => {
    if (!song) return;
    setCurrentChordIndex(prev => {
      const nextIndex = prev + 1;
      return nextIndex >= song.chords.length ? 0 : nextIndex;
    });
    // Play the next chord sound
    if (pianoSoundEnabled && pianoReady) {
      const nextIndex = (currentChordIndex + 1) % song.chords.length;
      playChordSound(song.chords[nextIndex]);
    }
  };

  const handlePrevChord = () => {
    if (!song) return;
    setCurrentChordIndex(prev => {
      const nextIndex = prev - 1;
      return nextIndex < 0 ? song.chords.length - 1 : nextIndex;
    });
    // Play the previous chord sound
    if (pianoSoundEnabled && pianoReady) {
      const prevIndex = currentChordIndex - 1 < 0 ? song.chords.length - 1 : currentChordIndex - 1;
      playChordSound(song.chords[prevIndex]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Convert chord keys to note names (without octave) for comparison
  const chordToNoteNames = (chord: ChordType): Set<string> => {
    const noteNames = new Set<string>();
    
    chord.keys.forEach(key => {
      // Extract note name without octave (e.g., "C4" -> "C", "F#5" -> "F#")
      const noteName = key.replace(/\d/g, '');
      noteNames.add(noteName);
    });
    
    console.log('Chord to note names:', chord.keys, '->', Array.from(noteNames));
    return noteNames;
  };

  // Convert MIDI note number to note name (without octave)
  const midiNoteToNoteNameOnly = (midiNote: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = midiNote % 12;
    return noteNames[noteIndex];
  };

  // Convert MIDI note number to note name with octave
  const midiNoteToNoteNameWithOctave = (midiNote: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1; // MIDI note 60 = C4
    return `${noteNames[noteIndex]}${octave}`;
  };

  // Get octave from MIDI note number
  const getOctaveFromMidiNote = (midiNote: number): number => {
    return Math.floor(midiNote / 12) - 1; // MIDI note 60 = C4
  };

  // Check if pressed keys match the current chord (note names + octave, exact match)
  const checkChordMatch = useCallback((pressedKeys: Set<number>, targetChord: ChordType): boolean => {
    // Convert chord keys to MIDI numbers
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordMIDINotes = new Set(
      targetChord.keys.map(key => {
        const match = key.match(/^([A-G]#?)(\d)$/);
        if (!match) return null;
        const noteIdx = noteNames.indexOf(match[1]);
        const octave = parseInt(match[2]);
        return (octave + 1) * 12 + noteIdx;
      }).filter(n => n !== null)
    );
    // Compare sets
    if (pressedKeys.size !== chordMIDINotes.size) return false;
    for (const midi of chordMIDINotes) {
      if (!pressedKeys.has(midi as number)) return false;
    }
    return true;
  }, []);

  // Handle keyboard events for demo mode
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isDemoMode || !song) return;
    
    const key = event.key.toLowerCase();
    const midiNote = currentKeyMapping[key];
    
    if (midiNote !== undefined) {
      event.preventDefault();
      console.log(`Demo mode - Key pressed: ${key} -> MIDI note: ${midiNote} (${midiNoteToNoteNameWithOctave(midiNote)})`);
      
      // Clear any existing release timeout for this key
      if (keyReleaseTimeoutsRef.current.has(midiNote)) {
        clearTimeout(keyReleaseTimeoutsRef.current.get(midiNote)!);
        keyReleaseTimeoutsRef.current.delete(midiNote);
      }
      
      // Always play the note when pressed (for better user feedback)
      if (pianoReady) {
        const noteName = midiNoteToNoteName(midiNote);
        const noteWithoutOctave = noteName.replace(/\d/g, ''); // Remove octave number
        const octave = getOctaveFromMidiNote(midiNote);
        playPianoNote(noteWithoutOctave, "8n", 0.7, octave).catch(e => 
          console.error('Error playing note:', e)
        );
      }
      
      // Update both the ref and the state
      pressedKeysRef.current.add(midiNote);
      setPressedKeys(new Set(pressedKeysRef.current));
      
      console.log('Current pressed keys (ref):', Array.from(pressedKeysRef.current).map(n => `${n}(${midiNoteToNoteNameWithOctave(n)})`));
      console.log('Current chord index:', currentChordIndex);
      console.log('Current chord:', song.chords[currentChordIndex]);
      
      // Clear any existing chord check timeout
      if (chordCheckTimeoutRef.current) {
        clearTimeout(chordCheckTimeoutRef.current);
      }
      
      // Use a small timeout to allow all notes of the chord to be registered
      chordCheckTimeoutRef.current = setTimeout(() => {
        console.log('Checking chord match after timeout with keys:', Array.from(pressedKeysRef.current).map(n => `${n}(${midiNoteToNoteNameWithOctave(n)})`));
        
        if (checkChordMatch(pressedKeysRef.current, song.chords[currentChordIndex])) {
          console.log('🎉 Demo mode: Chord matched! Advancing to next chord...');
          
          // Move to next chord immediately
          const nextIndex = (currentChordIndex + 1) % song.chords.length;
          console.log(`Advancing from chord ${currentChordIndex + 1} to chord ${nextIndex + 1} (index: ${currentChordIndex} -> ${nextIndex})`);
          setCurrentChordIndex(nextIndex);
          
          // Clear pressed keys immediately
          pressedKeysRef.current.clear();
          setPressedKeys(new Set());
          
          // Clear all key release timeouts
          keyReleaseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
          keyReleaseTimeoutsRef.current.clear();
        }
        chordCheckTimeoutRef.current = null;
      }, 150); // Slightly longer delay to ensure all keys are registered
    }
  }, [isDemoMode, song, currentChordIndex, checkChordMatch, midiNoteToNoteName, midiNoteToNoteNameWithOctave, pianoReady, playPianoNote]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!isDemoMode) return;
    
    const key = event.key.toLowerCase();
    const midiNote = currentKeyMapping[key];
    
    if (midiNote !== undefined) {
      event.preventDefault();
      console.log(`Demo mode - Key released: ${key} -> MIDI note: ${midiNote} (${midiNoteToNoteNameWithOctave(midiNote)})`);
      
      // Set a timeout to actually release the key after a delay
      const releaseTimeout = setTimeout(() => {
        console.log(`Actually releasing key: ${midiNote} (${midiNoteToNoteNameWithOctave(midiNote)})`);
        pressedKeysRef.current.delete(midiNote);
        setPressedKeys(new Set(pressedKeysRef.current));
        keyReleaseTimeoutsRef.current.delete(midiNote);
      }, 200); // Delay key release to allow chord checking
      
      keyReleaseTimeoutsRef.current.set(midiNote, releaseTimeout);
    }
  }, [isDemoMode, midiNoteToNoteNameWithOctave]);

  // Handle MIDI messages
  const handleMIDIMessage = useCallback((event: WebMidi.MIDIMessageEvent) => {
    if (!isPlayYourselfMode || !song) return;
    
    const [status, note, velocity] = event.data;
    const isNoteOn = (status & 0xF0) === 0x90;
    const isNoteOff = (status & 0xF0) === 0x80;
    
    console.log(`MIDI message: status=${status}, note=${note}, velocity=${velocity}, isNoteOn=${isNoteOn}, isNoteOff=${isNoteOff}`);
    
    if (isNoteOn && velocity > 0) {
      console.log(`MIDI - Note pressed: ${note} (${midiNoteToNoteNameWithOctave(note)})`);
      
      // Always play the note when pressed (for better user feedback)
      if (pianoReady) {
        const noteName = midiNoteToNoteName(note);
        const noteWithoutOctave = noteName.replace(/\d/g, ''); // Remove octave number
        const octave = getOctaveFromMidiNote(note);
        playPianoNote(noteWithoutOctave, "8n", velocity / 127, octave).catch(e => 
          console.error('Error playing note:', e)
        );
      }
      
      // Update both the ref and the state
      pressedKeysRef.current.add(note);
      setPressedKeys(new Set(pressedKeysRef.current));
      
      console.log('Current pressed keys (ref):', Array.from(pressedKeysRef.current).map(n => `${n}(${midiNoteToNoteNameWithOctave(n)})`));
      console.log('Current chord index:', currentChordIndex);
      console.log('Current chord:', song.chords[currentChordIndex]);
      
      // Clear any existing timeout
      if (chordCheckTimeoutRef.current) {
        clearTimeout(chordCheckTimeoutRef.current);
      }
      
      // Use a small timeout to allow all notes of the chord to be registered
      chordCheckTimeoutRef.current = setTimeout(() => {
        console.log('Checking chord match after timeout with keys:', Array.from(pressedKeysRef.current).map(n => `${n}(${midiNoteToNoteNameWithOctave(n)})`));
        
        if (checkChordMatch(pressedKeysRef.current, song.chords[currentChordIndex])) {
          console.log('🎉 MIDI: Chord matched! Advancing to next chord...');
          
          // Move to next chord immediately
          const nextIndex = (currentChordIndex + 1) % song.chords.length;
          console.log(`Advancing from chord ${currentChordIndex + 1} to chord ${nextIndex + 1} (index: ${currentChordIndex} -> ${nextIndex})`);
          setCurrentChordIndex(nextIndex);
          
          // Clear pressed keys immediately
          pressedKeysRef.current.clear();
          setPressedKeys(new Set());
        }
        chordCheckTimeoutRef.current = null;
      }, 150); // Slightly longer delay to ensure all keys are registered
    } else if (isNoteOff || (isNoteOn && velocity === 0)) {
      console.log(`MIDI - Note released: ${note} (${midiNoteToNoteNameWithOctave(note)})`);
      
      // Set a timeout to actually release the key after a delay
      const releaseTimeout = setTimeout(() => {
        console.log(`Actually releasing MIDI key: ${note} (${midiNoteToNoteNameWithOctave(note)})`);
        pressedKeysRef.current.delete(note);
        setPressedKeys(new Set(pressedKeysRef.current));
        keyReleaseTimeoutsRef.current.delete(note);
      }, 200); // Delay key release to allow chord checking
      
      keyReleaseTimeoutsRef.current.set(note, releaseTimeout);
    }
  }, [isPlayYourselfMode, song, currentChordIndex, checkChordMatch, midiNoteToNoteName, midiNoteToNoteNameWithOctave, pianoReady, playPianoNote]);

  // Set up keyboard event listeners for demo mode
  useEffect(() => {
    if (isDemoMode) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    } else {
      // Clean up keyboard listeners when exiting demo mode
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [isDemoMode, handleKeyDown, handleKeyUp]);

  // Initialize MIDI when Play Yourself mode is activated
  useEffect(() => {
    if (isPlayYourselfMode && !midiAccessRequested && midiSupported) {
      console.log('Auto-initializing MIDI for Play Yourself mode');
      setMidiAccessRequested(true);
      requestMIDIAccess().then(success => {
        console.log('Auto MIDI initialization result:', success);
      });
    }
  }, [isPlayYourselfMode, midiAccessRequested, midiSupported, requestMIDIAccess]);

  // Set up MIDI handler when device is connected
  useEffect(() => {
    if (midiCurrentDevice && isPlayYourselfMode && !isDemoMode) {
      setupMIDIHandler(handleMIDIMessage);
    }
  }, [midiCurrentDevice, isPlayYourselfMode, isDemoMode, setupMIDIHandler, handleMIDIMessage]);

  // Auto-connect to first available device when devices are detected
  useEffect(() => {
    if (isPlayYourselfMode && !isDemoMode && midiDevices.length > 0 && !midiCurrentDevice && midiAccessRequested) {
      console.log('Auto-connecting to first available MIDI device:', midiDevices[0]);
      connectToDevice(midiDevices[0].id);
    }
  }, [isPlayYourselfMode, isDemoMode, midiDevices, midiCurrentDevice, midiAccessRequested, connectToDevice]);

  // Cleanup when component unmounts (user navigates away)
  useEffect(() => {
    // Function to handle page unload
    const handleBeforeUnload = () => {
      console.log('🔄 Page unloading - cleaning up all sounds and MIDI');
      stopAllPianoSounds();
      if (midiCurrentDevice) {
        disconnectDevice();
      }
    };

    // Function to handle visibility change (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔄 Page hidden - cleaning up all sounds and MIDI');
        stopAllPianoSounds();
        if (midiCurrentDevice) {
          disconnectDevice();
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log('🔄 Component unmounting - cleaning up all sounds and MIDI');
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Stop all piano sounds
      stopAllPianoSounds();
      // Disconnect MIDI device
      if (midiCurrentDevice) {
        disconnectDevice();
      }
      // Remove keyboard event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      // Cancel any ongoing animations
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clear chord check timeout
      if (chordCheckTimeoutRef.current) {
        clearTimeout(chordCheckTimeoutRef.current);
        chordCheckTimeoutRef.current = null;
      }
      // Clear all key release timeouts
      keyReleaseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      keyReleaseTimeoutsRef.current.clear();
    }
  }, []); // Empty dependency array - only run on mount/unmount

  // Separate cleanup for exiting Play Yourself mode
  useEffect(() => {
    if (!isPlayYourselfMode && midiCurrentDevice) {
      console.log('🔄 Exiting Play Yourself mode - cleaning up MIDI');
      setPressedKeys(new Set());
      pressedKeysRef.current.clear();
      if (chordCheckTimeoutRef.current) {
        clearTimeout(chordCheckTimeoutRef.current);
        chordCheckTimeoutRef.current = null;
      }
      // Clear all key release timeouts
      keyReleaseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      keyReleaseTimeoutsRef.current.clear();
      disconnectDevice();
      setMidiAccessRequested(false);
      setMidiActive(false);
      // Stop all piano sounds when exiting Play Yourself mode
      stopAllPianoSounds();
    }
  }, [isPlayYourselfMode, midiCurrentDevice, disconnectDevice, stopAllPianoSounds]);

  // Reset chord index when entering Play Yourself mode
  const resetChordIndex = useCallback(() => {
    console.log('🔄 Resetting chord index to 0');
    setCurrentChordIndex(0);
    setPressedKeys(new Set());
    pressedKeysRef.current.clear();
    if (chordCheckTimeoutRef.current) {
      clearTimeout(chordCheckTimeoutRef.current);
      chordCheckTimeoutRef.current = null;
    }
    // Clear all key release timeouts
    keyReleaseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    keyReleaseTimeoutsRef.current.clear();
    // Stop all piano sounds when resetting
    stopAllPianoSounds();
  }, [stopAllPianoSounds]);

  // Reset chord index when Play Yourself mode is activated
  useEffect(() => {
    if (isPlayYourselfMode && !isDemoMode) {
      console.log('🎯 Play Yourself mode activated - resetting chord index');
      resetChordIndex();
    }
  }, [isPlayYourselfMode, isDemoMode, resetChordIndex]);

  // Reset chord index when demo mode is activated
  useEffect(() => {
    if (isDemoMode) {
      console.log('🎯 Demo mode activated - resetting chord index');
      resetChordIndex();
    }
  }, [isDemoMode, resetChordIndex]);

  // Force MIDI initialization
  const initializeMIDI = useCallback(async () => {
    if (!midiSupported) {
      console.log('MIDI not supported in this browser');
      return false;
    }
    
    console.log('Forcing MIDI initialization...');
    setMidiAccessRequested(true);
    const success = await requestMIDIAccess();
    console.log('MIDI initialization result:', success);
    
    if (success) {
      console.log('MIDI devices found:', midiDevices.length);
      if (midiDevices.length > 0) {
        console.log('Auto-connecting to first device:', midiDevices[0]);
        connectToDevice(midiDevices[0].id);
        return true;
      } else {
        console.log('No MIDI devices found after initialization');
      }
    }
    return false;
  }, [midiSupported, requestMIDIAccess, midiDevices, connectToDevice]);

  // Handle Play Yourself mode toggle
  const handlePlayYourselfToggle = async () => {
    if (!midiSupported) {
      // If MIDI is not supported, offer demo mode
      setIsDemoMode(true);
      setIsPlayYourselfMode(true);
      setMidiActive(false); // No MIDI needed for demo mode
      resetChordIndex();
      if (isPlaying) {
        setIsPlaying(false);
      }
      return;
    }
    
    if (!midiConnected && !midiAccessRequested) {
      setShowMIDIDialog(true);
      return;
    }
    
    setIsPlayYourselfMode(prev => !prev);
    if (!isPlayYourselfMode) {
      setMidiActive(true); // Activate MIDI when entering Play Yourself mode
      // Force MIDI initialization if not already connected
      if (!midiConnected) {
        await initializeMIDI();
      }
      resetChordIndex();
    } else {
      setMidiActive(false); // Deactivate MIDI when exiting Play Yourself mode
      // Stop all piano sounds when exiting
      stopAllPianoSounds();
    }
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  // Handle demo mode toggle
  const handleDemoModeToggle = () => {
    setIsDemoMode(prev => !prev);
    if (!isDemoMode) {
      setIsPlayYourselfMode(true);
      setMidiActive(false); // No MIDI needed for demo mode
      resetChordIndex();
      if (isPlaying) {
        setIsPlaying(false);
      }
    } else {
      // Stop all piano sounds when exiting demo mode
      stopAllPianoSounds();
    }
  };

  // Handle MIDI device selection
  const handleMIDIDeviceSelect = async (deviceId: string) => {
    // Ensure MIDI is initialized first
    if (!midiConnected && !midiAccessRequested) {
      await initializeMIDI();
    }
    
    connectToDevice(deviceId);
    setShowMIDIDialog(false);
    setIsPlayYourselfMode(true);
    setIsDemoMode(false);
    setMidiActive(true); // Activate MIDI when device is selected
    resetChordIndex();
  };

  // Test function to verify chord conversion
  const testChordConversion = useCallback(() => {
    if (!song) return;
    
    console.log('=== CHORD CONVERSION TEST ===');
    song.chords.forEach((chord, index) => {
      const noteNames = chordToNoteNames(chord);
      console.log(`Chord ${index + 1}:`, chord.keys, '-> Note names:', Array.from(noteNames));
    });
    console.log('=== END TEST ===');
  }, [song, chordToNoteNames]);

  // Run test when song loads (only once)
  useEffect(() => {
    if (song && song.chords.length > 0 && !chordTestRunRef.current) {
      chordTestRunRef.current = true;
      testChordConversion();
    }
  }, [song]); // Remove testChordConversion from dependencies to prevent infinite loop

  // Stop piano sounds when switching modes
  useEffect(() => {
    if (!isPlayYourselfMode && !isDemoMode && !isPlaying) {
      // Stop all piano sounds when not in any interactive mode AND not playing normally
      stopAllPianoSounds();
    }
  }, [isPlayYourselfMode, isDemoMode, isPlaying, stopAllPianoSounds]);

  // Debug piano state
  useEffect(() => {
    console.log('Piano state changed:', { pianoReady, pianoSoundEnabled });
  }, [pianoReady, pianoSoundEnabled]);

  const [showMIDIModal, setShowMIDIModal] = useState(false);
  const MySwal = withReactContent(Swal);
  const openMIDIModal = useCallback(() => {
    MySwal.fire({
      title: <span style={{color: '#00E676'}}>MIDI Status & Troubleshooting</span>,
      html: (
        <div>
          {/* MIDI Status Information */}
          {midiSupported && (
            <div className="w-full p-3 bg-[#0f1624] border border-[#a0aec0] rounded text-sm mb-4">
              <div className="font-bold mb-2 text-[#00E676]">MIDI Status:</div>
              <div className="space-y-1 text-xs text-[#a0aec0]">
                <div>• Browser Support: {midiSupported ? '✅ Supported' : '❌ Not Supported'}</div>
                <div>• Devices Found: {midiDevices.length}</div>
                <div>• Connection Status: {midiConnected ? '✅ Connected' : '❌ Not Connected'}</div>
                <div>• MIDI Active: {midiActive ? '✅ Yes' : '❌ No'}</div>
                <div>• Access Requested: {midiAccessRequested ? '✅ Yes' : '❌ No'}</div>
                <div>• Initializing: {midiInitializing ? '🔄 Yes' : '❌ No'}</div>
                {midiCurrentDevice && (
                  <div>• Current Device: {midiCurrentDevice.name} ({midiCurrentDevice.manufacturer})</div>
                )}
                {midiError && (
                  <div className="text-red-400">• Error: {midiError}</div>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={async () => {
                    await refreshDevices();
                    setMidiRefreshRequested(true);
                  }}
                  className="flex-1 p-2 bg-[#00E676] text-black rounded text-xs font-bold hover:bg-[#00D666] transition-colors"
                >
                  Refresh MIDI Devices
                </button>
                {!midiAccessRequested && (
                  <button
                    onClick={initializeMIDI}
                    className="flex-1 p-2 bg-[#0f1624] text-[#a0aec0] border border-[#a0aec0] rounded text-xs font-bold hover:border-[#00E676] hover:text-[#00E676] transition-colors"
                  >
                    Initialize MIDI
                  </button>
                )}
                {midiAccessRequested && midiDevices.length > 0 && !midiConnected && (
                  <button
                    onClick={() => {
                      connectToDevice(midiDevices[0].id);
                    }}
                    className="flex-1 p-2 bg-yellow-600 text-white rounded text-xs font-bold hover:bg-yellow-700 transition-colors"
                  >
                    Reconnect
                  </button>
                )}
              </div>
              {/* Available Devices List */}
              {midiDevices.length > 0 && (
                <div className="mt-3 p-2 bg-[#0f1624] rounded border border-[#a0aec0]">
                  <div className="font-medium text-white mb-1 text-xs">Available Devices:</div>
                  {midiDevices.map(device => (
                    <div key={device.id} className="text-xs text-[#a0aec0] ml-2 mb-1">
                      • {device.name} ({device.manufacturer}) - {device.state}
                      {midiCurrentDevice?.id === device.id && (
                        <span className="text-[#00E676] ml-1">← Connected</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* MIDI Troubleshooting */}
          <MIDITroubleshooting
            midiSupported={midiSupported}
            midiDevices={midiDevices}
            midiError={midiError}
            onRefresh={async () => {
              await refreshDevices();
              setMidiRefreshRequested(true);
            }}
          />
        </div>
      ),
      showConfirmButton: false,
      showCloseButton: true,
      width: '48rem',
      background: '#0a101b',
      customClass: {
        popup: 'swal2-mt-modal',
      },
      didClose: () => setShowMIDIModal(false),
    });
  }, [midiSupported, midiDevices, midiConnected, midiActive, midiAccessRequested, midiInitializing, midiCurrentDevice, midiError, refreshDevices, initializeMIDI, connectToDevice]);

  const [midiRefreshRequested, setMidiRefreshRequested] = useState(false);
  const prevDevicesRef = useRef(midiDevices);

  useEffect(() => {
    // Si se pidió refresh y la lista de dispositivos cambió, reabrir el modal
    if (midiRefreshRequested && prevDevicesRef.current !== midiDevices) {
      setMidiRefreshRequested(false);
      setShowMIDIModal(false);
      setTimeout(() => setShowMIDIModal(true), 100);
    }
    prevDevicesRef.current = midiDevices;
  }, [midiDevices, midiRefreshRequested]);

  useEffect(() => {
    if (showMIDIModal) openMIDIModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMIDIModal]);

  return (
    <div className="bg-[#0a101b] min-h-screen text-white">
      <Header />
      <audio ref={metronomeRef} src="/metronome-click.mp3" preload="auto" />
      <div className="p-4 md:p-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-[#a0aec0] no-underline mb-8 transition-colors hover:text-[#00E676]"
        >
          <FaArrowLeft /> Back to Stage
        </Link>
        {loading ? (
          <div className="text-center py-12 text-[#a0aec0]">
            Loading song details...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : !song ? (
          <div className="text-center py-12 text-[#a0aec0]">
            Song not found
          </div>
        ) : (
          <>
            <div className="bg-[#1a2332]/30 rounded-lg p-4 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-[#1a2332] rounded-full flex items-center justify-center border-2 border-[#00E676]">
                  <FaMusic className="text-3xl text-[#00E676]" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl mb-2 text-center md:text-left">
                    {song.title}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#a0aec0] text-sm md:text-base">
                    <div>Key: {song.key}</div>
                    <div>{song.timeSignature}</div>
                    <div>{song.tempo} BPM</div>
                    <div>Created: {formatDate(song.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#1a2332]/30 rounded-lg p-4 md:p-8 mb-6 flex flex-col items-center gap-6">
              <h2 className="text-xl md:text-2xl text-[#00E676]">
                Current Chord ({currentChordIndex + 1} of {song.chords.length})
              </h2>
              <LargePiano chord={song.chords[currentChordIndex]} />
              {isPlaying && (
                <div className="flex gap-2 mt-2">
                  {Array.from({ length: getBeatsPerMeasure(song.timeSignature) }).map((_, index) => (
                    <div 
                      key={`beat-${index}`}
                      className={`w-2.5 h-2.5 rounded-full ${
                        beatCount === index ? "bg-[#00E676]" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-4 items-center w-full max-w-md mt-4">
                <div className="flex justify-between w-full mb-2 flex-wrap gap-2">
                  <button
                    onClick={() => setMetronomeEnabled(prev => !prev)}
                    className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all ${
                      metronomeEnabled 
                        ? "bg-[#00E676] text-black" 
                        : "bg-[#0f1624] text-[#a0aec0] border border-[#a0aec0]"
                    }`}
                  >
                    {metronomeEnabled ? 'Metronome: ON' : 'Metronome: OFF'}
                  </button>
                  <button
                    onClick={() => setPianoSoundEnabled(prev => !prev)}
                    className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all ${
                      pianoSoundEnabled 
                        ? "bg-[#00E676] text-black" 
                        : "bg-[#0f1624] text-[#a0aec0] border border-[#a0aec0]"
                    }`}
                  >
                    {pianoSoundEnabled ? 'Piano Sound: ON' : 'Piano Sound: OFF'}
                  </button>
                </div>
                
                {/* Play Yourself Button */}
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={handlePlayYourselfToggle}
                    disabled={midiInitializing}
                    className={`flex-1 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                      isPlayYourselfMode 
                        ? "bg-[#00E676] text-black" 
                        : "bg-[#0f1624] text-[#a0aec0] border border-[#a0aec0] hover:border-[#00E676] hover:text-[#00E676]"
                    } ${midiInitializing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <FaKeyboard />
                    {midiInitializing ? 'Detecting MIDI...' : (isPlayYourselfMode ? 'Exit Play Yourself' : 'Play Yourself')}
                  </button>
                  <button
                    onClick={() => setShowMIDIModal(true)}
                    className="ml-2 p-3 rounded-full bg-[#0f1624] border border-[#a0aec0] text-[#00E676] hover:bg-[#00E676] hover:text-black transition-colors flex items-center justify-center"
                    title="MIDI Info & Troubleshooting"
                  >
                    <FaInfoCircle size={22} />
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handlePrevChord}
                    className="w-12 h-12 rounded-full bg-[#0f1624] text-white border border-[#a0aec0] flex items-center justify-center cursor-pointer"
                  >
                    <FaStepBackward />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${
                      isPlaying 
                        ? "bg-[#0f1624] text-[#00E676] border-2 border-[#00E676]" 
                        : "bg-[#00E676] text-black"
                    }`}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    onClick={handleNextChord}
                    className="w-12 h-12 rounded-full bg-[#0f1624] text-white border border-[#a0aec0] flex items-center justify-center cursor-pointer"
                  >
                    <FaStepForward />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#1a2332]/30 rounded-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl text-[#00E676] mb-6">
                Chord Progression
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {song.chords.map((chord, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-6 cursor-pointer ${
                      currentChordIndex === index 
                        ? "bg-[#00E676]/20 border-2 border-[#00E676]" 
                        : "bg-[#1a2332]"
                    }`}
                    onClick={() => handleChordSelect(index)}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className={`font-bold ${
                        currentChordIndex === index ? "text-[#00E676]" : "text-white"
                      }`}>
                        Chord {index + 1}
                      </div>
                      {currentChordIndex === index && (
                        <div className="bg-[#00E676] text-black rounded-full text-xs font-bold px-2 py-1">
                          Current
                        </div>
                      )}
                    </div>
                    <LargePiano chord={chord} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* MIDI Device Selection Dialog */}
            {showMIDIDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#1a2332] rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold mb-4 text-[#00E676]">
                    Select MIDI Device
                  </h3>
                  {midiDevices.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[#a0aec0] mb-4">No MIDI devices found</p>
                      <p className="text-sm text-[#a0aec0] mb-6">
                        Please connect a MIDI keyboard or other MIDI device and refresh the page.
                      </p>
                      <button
                        onClick={() => {
                          setShowMIDIDialog(false);
                          handleDemoModeToggle();
                        }}
                        className="w-full p-3 bg-[#00E676] text-black rounded font-bold hover:bg-[#00D666] transition-colors"
                      >
                        Try Demo Mode Instead
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4">
                        {midiDevices.map(device => (
                          <button
                            key={device.id}
                            onClick={() => handleMIDIDeviceSelect(device.id)}
                            className="w-full p-3 text-left bg-[#0f1624] rounded border border-[#a0aec0] hover:border-[#00E676] transition-colors"
                          >
                            <div className="font-medium text-white">{device.name}</div>
                            <div className="text-sm text-[#a0aec0]">{device.manufacturer}</div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setShowMIDIDialog(false);
                          handleDemoModeToggle();
                        }}
                        className="w-full p-3 bg-[#0f1624] text-[#a0aec0] rounded border border-[#a0aec0] hover:border-[#00E676] hover:text-[#00E676] transition-colors"
                      >
                        Try Demo Mode Instead
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowMIDIDialog(false)}
                    className="w-full mt-4 p-3 bg-[#0f1624] text-[#a0aec0] rounded border border-[#a0aec0] hover:border-[#00E676] hover:text-[#00E676] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SongDetailsPage;
