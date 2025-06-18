import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaMusic, FaPlay, FaPause, FaStepForward, FaStepBackward, FaKeyboard } from 'react-icons/fa';
import Header from '../components/Header';
import MIDITroubleshooting from '../components/MIDITroubleshooting';
import { getSongById } from '../api/songApi';
import { type Song, type ChordType } from '../firebase/songService';
import { useAuth } from '../context/AuthContext';
import { useMIDI } from '../hooks/useMIDI';
import { usePiano } from '../hooks/usePiano';

const LargePiano = ({ chord }: { chord: ChordType }) => {
  const chordNotes = chord.keys.map(k => {
    const note = k.split('-')[0];
    return note.includes('s') ? note.replace('s', '#') : note;
  });
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const hasBlackKeyAfter = [true, true, false, true, true, true, false];
  return (
    <div className="relative h-[120px] w-full max-w-[400px] mx-auto">
      <div className="flex h-full w-full">
        {whiteKeys.map((whiteKey, idx) => (
          <div
            key={`large-white-${idx}`}
            className={`flex-1 h-full border border-gray-600 rounded-b-sm relative z-10 ${
              chordNotes.includes(whiteKey) ? "bg-[#00E676]" : "bg-white"
            }`}
          >
            <div className={`absolute bottom-[5px] w-full text-center ${
              chordNotes.includes(whiteKey) ? "text-white font-bold" : "text-black font-normal"
            }`}>
              {whiteKey}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-[60%]">
        {whiteKeys.map((_, idx) => {
          if (!hasBlackKeyAfter[idx]) return null;
          const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
          const blackKeyIdx = [0, 1, 3, 4, 5].indexOf(idx);
          if (blackKeyIdx === -1) return null;
          const blackNote = blackKeyNames[blackKeyIdx];
          const isSelected = chordNotes.includes(blackNote);
          const position = (idx + 1) / whiteKeys.length;
          return (
            <div
              key={`large-black-${idx}`}
              className={`absolute h-full w-[16%] z-20 border-x border-gray-600 rounded-b-sm box-border ${
                isSelected ? "bg-[#00E676]" : "bg-black"
              }`}
              style={{ left: `calc(${position * 100}% - 9%)` }}
            >
              {isSelected && (
                <div className="absolute bottom-[5px] w-full text-center text-white font-bold text-xs">
                  {blackNote}
                </div>
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
  
  // Piano hook
  const { isReady: pianoReady, playChord: playPianoChord, stopAllNotes } = usePiano();
  
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

  // Demo mode keyboard mapping
  const demoKeyMapping: { [key: string]: number } = {
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
    if (!pianoSoundEnabled || !pianoReady) return;
    
    try {
      // Extract note names from chord keys
      const notes = chord.keys.map(key => {
        const note = key.split('-')[0];
        return note.replace('#', 's'); // Convert # to s for consistency
      });
      
      await playPianoChord(notes, "4n", 0.6);
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
    }
    if (song && pianoSoundEnabled) {
      playChordSound(song.chords[currentChordIndex]);
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
      stopAllPianoSounds();
    };
  }, [isPlaying, song]);

  useEffect(() => {
    if (song && pianoSoundEnabled) {
      if (!isFirstRenderRef.current) {
        playChordSound(song.chords[currentChordIndex]);
      }
    }
  }, [currentChordIndex, song]);

  const handleChordSelect = (index: number) => {
    setCurrentChordIndex(index);
    if (song && pianoSoundEnabled && !isFirstRenderRef.current) {
      playChordSound(song.chords[index]);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying && song) {
      setBeatCount(0);
      lastTickTimeRef.current = null;
    } else {
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
  };

  const handlePrevChord = () => {
    if (!song) return;
    setCurrentChordIndex(prev => {
      const nextIndex = prev - 1;
      return nextIndex < 0 ? song.chords.length - 1 : nextIndex;
    });
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
      const note = key.split('-')[0];
      // Convert 's' to '#' for consistency
      const normalizedNote = note.replace('s', '#');
      noteNames.add(normalizedNote);
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

  // Check if pressed keys match the current chord (note names only, no octave)
  const checkChordMatch = useCallback((pressedKeys: Set<number>, targetChord: ChordType): boolean => {
    const targetNoteNames = chordToNoteNames(targetChord);
    const pressedNoteNames = new Set(Array.from(pressedKeys).map(n => midiNoteToNoteNameOnly(n)));
    
    console.log('Checking chord match (note names only):');
    console.log('Target note names:', Array.from(targetNoteNames));
    console.log('Pressed note names:', Array.from(pressedNoteNames));
    
    // Check if all target notes are pressed (this is the main requirement)
    let allTargetNotesPressed = true;
    for (const noteName of targetNoteNames) {
      if (!pressedNoteNames.has(noteName)) {
        console.log(`Missing target note: ${noteName}`);
        allTargetNotesPressed = false;
        break;
      }
    }
    
    if (!allTargetNotesPressed) {
      console.log('❌ Chord match failed: Not all target notes are pressed');
      return false;
    }
    
    // Optional: Check for extra notes (can be disabled for more flexibility)
    const hasExtraNotes = Array.from(pressedNoteNames).some(pressedNote => !targetNoteNames.has(pressedNote));
    
    if (hasExtraNotes) {
      console.log('⚠️ Extra notes detected, but chord still matches (flexible mode)');
    }
    
    console.log('✅ Chord match successful!');
    return true;
  }, []);

  // Handle keyboard events for demo mode
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isDemoMode || !song) return;
    
    const key = event.key.toLowerCase();
    const midiNote = demoKeyMapping[key];
    
    if (midiNote !== undefined) {
      event.preventDefault();
      console.log(`Demo mode - Key pressed: ${key} -> MIDI note: ${midiNote} (${midiNoteToNoteName(midiNote)})`);
      
      setPressedKeys(prev => {
        const newPressedKeys = new Set(prev);
        newPressedKeys.add(midiNote);
        
        console.log('Current pressed keys:', Array.from(newPressedKeys).map(n => `${n}(${midiNoteToNoteName(n)})`));
        console.log('Current chord index:', currentChordIndex);
        console.log('Current chord:', song.chords[currentChordIndex]);
        
        // Check if the pressed keys match the current chord
        if (checkChordMatch(newPressedKeys, song.chords[currentChordIndex])) {
          console.log('🎉 Demo mode: Chord matched! Advancing to next chord...');
          
          // Play success sound
          if (pianoSoundEnabled) {
            playChordSound(song.chords[currentChordIndex]);
          }
          
          // Move to next chord immediately (no setTimeout to avoid race conditions)
          const nextIndex = (currentChordIndex + 1) % song.chords.length;
          console.log(`Advancing from chord ${currentChordIndex + 1} to chord ${nextIndex + 1} (index: ${currentChordIndex} -> ${nextIndex})`);
          setCurrentChordIndex(nextIndex);
          
          // Clear pressed keys immediately
          return new Set();
        }
        
        return newPressedKeys;
      });
    }
  }, [isDemoMode, song, currentChordIndex, pianoSoundEnabled, playChordSound, checkChordMatch, midiNoteToNoteName]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!isDemoMode) return;
    
    const key = event.key.toLowerCase();
    const midiNote = demoKeyMapping[key];
    
    if (midiNote !== undefined) {
      event.preventDefault();
      console.log(`Demo mode - Key released: ${key} -> MIDI note: ${midiNote} (${midiNoteToNoteName(midiNote)})`);
      
      setPressedKeys(prev => {
        const newPressedKeys = new Set(prev);
        newPressedKeys.delete(midiNote);
        return newPressedKeys;
      });
    }
  }, [isDemoMode, midiNoteToNoteName]);

  // Handle MIDI messages
  const handleMIDIMessage = useCallback((event: WebMidi.MIDIMessageEvent) => {
    if (!isPlayYourselfMode || !song) return;
    
    const [status, note, velocity] = event.data;
    const isNoteOn = (status & 0xF0) === 0x90;
    const isNoteOff = (status & 0xF0) === 0x80;
    
    console.log(`MIDI message: status=${status}, note=${note}, velocity=${velocity}, isNoteOn=${isNoteOn}, isNoteOff=${isNoteOff}`);
    
    if (isNoteOn && velocity > 0) {
      console.log(`MIDI - Note pressed: ${note} (${midiNoteToNoteName(note)})`);
      
      setPressedKeys(prev => {
        const newPressedKeys = new Set(prev);
        newPressedKeys.add(note);
        
        console.log('Current pressed keys:', Array.from(newPressedKeys).map(n => `${n}(${midiNoteToNoteName(n)})`));
        console.log('Current chord index:', currentChordIndex);
        console.log('Current chord:', song.chords[currentChordIndex]);
        
        // Check if the pressed keys match the current chord
        if (checkChordMatch(newPressedKeys, song.chords[currentChordIndex])) {
          console.log('🎉 MIDI: Chord matched! Advancing to next chord...');
          
          // Play success sound
          if (pianoSoundEnabled) {
            playChordSound(song.chords[currentChordIndex]);
          }
          
          // Move to next chord immediately (no setTimeout to avoid race conditions)
          const nextIndex = (currentChordIndex + 1) % song.chords.length;
          console.log(`Advancing from chord ${currentChordIndex + 1} to chord ${nextIndex + 1} (index: ${currentChordIndex} -> ${nextIndex})`);
          setCurrentChordIndex(nextIndex);
          
          // Clear pressed keys immediately
          return new Set();
        }
        
        return newPressedKeys;
      });
    } else if (isNoteOff || (isNoteOn && velocity === 0)) {
      console.log(`MIDI - Note released: ${note} (${midiNoteToNoteName(note)})`);
      
      setPressedKeys(prev => {
        const newPressedKeys = new Set(prev);
        newPressedKeys.delete(note);
        return newPressedKeys;
      });
    }
  }, [isPlayYourselfMode, song, currentChordIndex, pianoSoundEnabled, playChordSound, checkChordMatch, midiNoteToNoteName]);

  // Set up keyboard event listeners for demo mode
  useEffect(() => {
    if (isDemoMode) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isDemoMode, handleKeyDown, handleKeyUp]);

  // Initialize MIDI when Play Yourself mode is activated
  useEffect(() => {
    if (isPlayYourselfMode && !midiAccessRequested) {
      setMidiAccessRequested(true);
      requestMIDIAccess().then(success => {
        if (success && midiDevices.length > 0) {
          // Auto-connect to the first available device
          connectToDevice(midiDevices[0].id);
        }
      });
    }
  }, [isPlayYourselfMode, midiAccessRequested, midiDevices, requestMIDIAccess, connectToDevice]);

  // Set up MIDI handler when device is connected
  useEffect(() => {
    if (midiCurrentDevice && isPlayYourselfMode) {
      setupMIDIHandler(handleMIDIMessage);
    }
  }, [midiCurrentDevice, isPlayYourselfMode, setupMIDIHandler, handleMIDIMessage]);

  // Clean up when exiting Play Yourself mode
  useEffect(() => {
    if (!isPlayYourselfMode) {
      setPressedKeys(new Set());
      disconnectDevice();
      setMidiAccessRequested(false);
    }
  }, [isPlayYourselfMode, disconnectDevice]);

  // Reset chord index when entering Play Yourself mode
  const resetChordIndex = useCallback(() => {
    console.log('🔄 Resetting chord index to 0');
    setCurrentChordIndex(0);
    setPressedKeys(new Set());
  }, []);

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

  // Handle Play Yourself mode toggle
  const handlePlayYourselfToggle = () => {
    if (!midiSupported) {
      // If MIDI is not supported, offer demo mode
      setIsDemoMode(true);
      setIsPlayYourselfMode(true);
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
      resetChordIndex();
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
      resetChordIndex();
      if (isPlaying) {
        setIsPlaying(false);
      }
    }
  };

  // Handle MIDI device selection
  const handleMIDIDeviceSelect = (deviceId: string) => {
    connectToDevice(deviceId);
    setShowMIDIDialog(false);
    setIsPlayYourselfMode(true);
    setIsDemoMode(false);
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

  // Run test when song loads
  useEffect(() => {
    if (song && song.chords.length > 0) {
      testChordConversion();
    }
  }, [song, testChordConversion]);

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
                <button
                  onClick={handlePlayYourselfToggle}
                  disabled={midiInitializing}
                  className={`w-full px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    isPlayYourselfMode 
                      ? "bg-[#00E676] text-black" 
                      : "bg-[#0f1624] text-[#a0aec0] border border-[#a0aec0] hover:border-[#00E676] hover:text-[#00E676]"
                  } ${midiInitializing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <FaKeyboard />
                  {midiInitializing ? 'Detecting MIDI...' : (isPlayYourselfMode ? 'Exit Play Yourself' : 'Play Yourself')}
                </button>
                
                {/* MIDI Debug Information */}
                {midiError && (
                  <div className="w-full p-3 bg-red-900/20 border border-red-500 rounded text-sm text-red-300">
                    <div className="font-bold mb-1">MIDI Error:</div>
                    <div>{midiError}</div>
                  </div>
                )}
                
                {/* MIDI Status Information */}
                {!isPlayYourselfMode && midiSupported && (
                  <div className="w-full p-3 bg-[#0f1624] border border-[#a0aec0] rounded text-sm">
                    <div className="font-bold mb-2 text-[#00E676]">MIDI Status:</div>
                    <div className="space-y-1 text-xs text-[#a0aec0]">
                      <div>• Browser Support: {midiSupported ? '✅ Supported' : '❌ Not Supported'}</div>
                      <div>• Devices Found: {midiDevices.length}</div>
                      <div>• Connection Status: {midiConnected ? '✅ Connected' : '❌ Not Connected'}</div>
                      {midiDevices.length > 0 && (
                        <div className="mt-2">
                          <div className="font-medium text-white mb-1">Available Devices:</div>
                          {midiDevices.map(device => (
                            <div key={device.id} className="ml-2 text-xs">
                              • {device.name} ({device.manufacturer}) - {device.state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={refreshDevices}
                      className="mt-2 w-full p-2 bg-[#00E676] text-black rounded text-xs font-bold hover:bg-[#00D666] transition-colors"
                    >
                      Refresh MIDI Devices
                    </button>
                  </div>
                )}
                
                {/* MIDI Troubleshooting */}
                {!isPlayYourselfMode && (midiError || midiDevices.length === 0) && (
                  <MIDITroubleshooting
                    midiSupported={midiSupported}
                    midiDevices={midiDevices}
                    midiError={midiError}
                    onRefresh={refreshDevices}
                  />
                )}
                
                {isPlayYourselfMode && (
                  <div className="w-full text-center">
                    {isDemoMode ? (
                      <>
                        <div className="text-sm text-[#a0aec0] mb-2">
                          Demo Mode - Use your computer keyboard
                        </div>
                        <div className="text-xs text-[#a0aec0] mb-2">
                          Keys: A S D F G H J K L (white keys) | W E T Y U O P (black keys)
                        </div>
                        <div className="text-xs text-[#a0aec0]">
                          Play the highlighted chord to advance
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm text-[#a0aec0] mb-2">
                          {midiCurrentDevice ? (
                            <>Connected to: {midiCurrentDevice.name}</>
                          ) : (
                            <>No MIDI device connected</>
                          )}
                        </div>
                        <div className="text-xs text-[#a0aec0]">
                          Play the highlighted chord on your MIDI keyboard to advance
                        </div>
                      </>
                    )}
                    
                    {/* Debug Information */}
                    <div className="mt-4 p-3 bg-[#0f1624] border border-[#a0aec0] rounded text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-[#00E676]">Debug Info:</div>
                        <button
                          onClick={() => setShowDebugInfo(prev => !prev)}
                          className="px-2 py-1 bg-[#00E676] text-black rounded text-xs font-bold hover:bg-[#00D666] transition-colors"
                        >
                          {showDebugInfo ? 'Hide' : 'Show'} Debug
                        </button>
                      </div>
                      
                      {showDebugInfo && (
                        <>
                          <div className="space-y-1 text-[#a0aec0]">
                            <div>Current Chord: {currentChordIndex + 1} of {song?.chords.length}</div>
                            <div>Chord Index: {currentChordIndex}</div>
                            <div>Expected Notes: {song?.chords[currentChordIndex]?.keys.join(', ')}</div>
                            <div>Expected Note Names: {song?.chords[currentChordIndex] ? Array.from(chordToNoteNames(song.chords[currentChordIndex])).join(', ') : ''}</div>
                            <div>Pressed Keys: {Array.from(pressedKeys).map(n => midiNoteToNoteName(n)).join(', ') || 'None'}</div>
                            <div>Pressed Note Names: {Array.from(pressedKeys).map(n => midiNoteToNoteNameOnly(n)).join(', ') || 'None'}</div>
                            <div>Keys Count: {pressedKeys.size}</div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={testChordConversion}
                              className="flex-1 p-2 bg-[#00E676] text-black rounded text-xs font-bold hover:bg-[#00D666] transition-colors"
                            >
                              Test Chord Conversion
                            </button>
                            <button
                              onClick={resetChordIndex}
                              className="flex-1 p-2 bg-yellow-600 text-white rounded text-xs font-bold hover:bg-yellow-700 transition-colors"
                            >
                              Reset to Chord 1
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Demo Mode Button (only show if MIDI is supported) */}
                {midiSupported && !isPlayYourselfMode && (
                  <button
                    onClick={handleDemoModeToggle}
                    className="w-full px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-[#0f1624] text-[#a0aec0] border border-[#a0aec0] hover:border-[#00E676] hover:text-[#00E676]"
                  >
                    <FaKeyboard />
                    Try Demo Mode
                  </button>
                )}
                
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
