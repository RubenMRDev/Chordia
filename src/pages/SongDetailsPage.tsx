import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaMusic, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import Header from '../components/Header';
import { getSongById, type Song, type ChordType } from '../firebase/songService';
import { useAuth } from '../context/AuthContext';
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
        {whiteKeys.map((note, idx) => (
          <div
            key={`large-white-${idx}`}
            className={`flex-1 h-full border border-gray-600 rounded-b-sm relative z-10 ${
              chordNotes.includes(note) ? "bg-[#00E676]" : "bg-white"
            }`}
          >
            <div className={`absolute bottom-[5px] w-full text-center ${
              chordNotes.includes(note) ? "text-white font-bold" : "text-black font-normal"
            }`}>
              {note}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-[60%]">
        {whiteKeys.map((note, idx) => {
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
  const { currentUser } = useAuth();
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
  const pianoSoundsRef = useRef<{[key: string]: HTMLAudioElement}>({});
  const currentBeatRef = useRef(0);
  const metronomeEnabledRef = useRef(metronomeEnabled);
  
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
  useEffect(() => {
    if (pianoSoundEnabled) {
      const notes = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];
      notes.forEach(note => {
        const audio = new Audio(`/piano-sounds/${note}.mp3`);
        audio.preload = "auto";
        pianoSoundsRef.current[note] = audio;
      });
    }
  }, [pianoSoundEnabled]);
  const playChordSound = (chord: ChordType) => {
    if (!pianoSoundEnabled) return;
    Object.values(pianoSoundsRef.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    chord.keys.forEach(key => {
      const note = key.split('-')[0];
      const formattedNote = note.replace('#', 's');
      if (pianoSoundsRef.current[formattedNote]) {
        const audioClone = pianoSoundsRef.current[formattedNote].cloneNode(true) as HTMLAudioElement;
        audioClone.play().catch(e => console.error(`Couldn't play piano sound for ${formattedNote}:`, e));
      }
    });
  };
  const stopAllPianoSounds = () => {
    Object.values(pianoSoundsRef.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };
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
      // Only play chord sound when manually changing chords or during playback,
      // not during initial load
      if (!isFirstRenderRef.current) {
        playChordSound(song.chords[currentChordIndex]);
      }
    }
  }, [currentChordIndex, song]);

  // To handle clicks on chord boxes which should play sounds
  const handleChordSelect = (index: number) => {
    setCurrentChordIndex(index);
    // Only play sound if piano is enabled and we're not in the initial load
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
          </>
        )}
      </div>
    </div>
  );
};
export default SongDetailsPage;
