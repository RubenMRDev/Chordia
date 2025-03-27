import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaMusic, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import Header from '../components/Header';
import { getSongById, type Song, type ChordType } from '../firebase/songService';
import { useAuth } from '../context/AuthContext';
const LargePiano = ({ chord }: { chord: ChordType }) => {
  const chordNotes = chord.keys.map(k => k.split('-')[0]);
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const hasBlackKeyAfter = [true, true, false, true, true, true, false];
  return (
    <div style={{ position: "relative", height: "120px", width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        {whiteKeys.map((note, idx) => (
          <div
            key={`large-white-${idx}`}
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: chordNotes.includes(note) ? "var(--accent-green)" : "white",
              border: "1px solid #4b5563",
              borderRadius: "0 0 4px 4px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ 
              position: "absolute", 
              bottom: "5px", 
              width: "100%", 
              textAlign: "center",
              color: chordNotes.includes(note) ? "white" : "black",
              fontWeight: chordNotes.includes(note) ? "bold" : "normal"
            }}>
              {note}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%" }}>
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
              style={{
                position: "absolute",
                height: "100%",
                left: `calc(${position * 100}% - 9%)`,
                backgroundColor: isSelected ? "var(--accent-green)" : "black",
                zIndex: 2,
                width: "16%",
                borderRadius: "0 0 4px 4px",
                borderLeft: "1px solid #4b5563",
                borderRight: "1px solid #4b5563",
                boxSizing: "border-box",
              }}
            >
              {isSelected && (
                <div style={{ 
                  position: "absolute", 
                  bottom: "5px", 
                  width: "100%", 
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.8rem"
                }}>
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
    if (!isPlaying || !song) return;
    const tempo = song.tempo || 120;
    const beatsPerMeasure = getBeatsPerMeasure(song.timeSignature);
    const beatDuration = 60000 / tempo; 
    if (isFirstRenderRef.current) {
      setCurrentChordIndex(0);
      isFirstRenderRef.current = false;
    }
    const tick = (timestamp: number) => {
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = timestamp - lastTickTimeRef.current;
      if (elapsed >= beatDuration) {
        if (metronomeRef.current) {
          metronomeRef.current.currentTime = 0;
          metronomeRef.current.play().catch(e => console.error("Couldn't play metronome:", e));
        }
        setBeatCount(prev => {
          const newBeatCount = (prev + 1) % beatsPerMeasure;
          if (newBeatCount === 0 && prev !== 0 && timestamp !== lastChordChangeRef.current) {
            lastChordChangeRef.current = timestamp;
            setTimeout(() => {
              setCurrentChordIndex(prevChordIndex => {
                const nextIndex = prevChordIndex + 1;
                if (nextIndex >= (song?.chords.length || 0)) {
                  return 0; 
                }
                return nextIndex;
              });
            }, 0);
          }
          return newBeatCount;
        });
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
      isFirstRenderRef.current = true;
    };
  }, [isPlaying, song]);
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
    setBeatCount(0);
    lastTickTimeRef.current = null;
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
    <div style={{ 
      backgroundColor: 'var(--background-darker)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      <Header />
      
      <audio ref={metronomeRef} src="/metronome-click.mp3" preload="auto" />
      <div style={{ padding: '2rem' }}>
        <Link to="/dashboard" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: '2rem',
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-green)'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <FaArrowLeft /> Back to Stage
        </Link>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            color: 'var(--text-secondary)' 
          }}>
            Loading song details...
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            color: '#ef4444' 
          }}>
            {error}
          </div>
        ) : !song ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            color: 'var(--text-secondary)' 
          }}>
            Song not found
          </div>
        ) : (
          <>
            
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#1f2937',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--accent-green)'
                }}>
                  <FaMusic style={{ fontSize: '2rem', color: 'var(--accent-green)' }} />
                </div>
                <div>
                  <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
                    {song.title}
                  </h1>
                  <div style={{ 
                    display: 'flex',
                    gap: '1.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '1rem'
                  }}>
                    <div>Key: {song.key}</div>
                    <div>{song.timeSignature}</div>
                    <div>{song.tempo} BPM</div>
                    <div>Created: {formatDate(song.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }}>
                Current Chord ({currentChordIndex + 1} of {song.chords.length})
              </h2>
              <LargePiano chord={song.chords[currentChordIndex]} />
              
              {isPlaying && (
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  {Array.from({ length: getBeatsPerMeasure(song.timeSignature) }).map((_, index) => (
                    <div 
                      key={`beat-${index}`}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: beatCount === index ? 'var(--accent-green)' : 'rgba(255,255,255,0.3)'
                      }}
                    />
                  ))}
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <button
                  onClick={handlePrevChord}
                  style={{
                    backgroundColor: 'var(--background-dark)',
                    color: 'var(--text-primary)',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    border: '1px solid var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <FaStepBackward />
                </button>
                <button
                  onClick={handlePlayPause}
                  style={{
                    backgroundColor: isPlaying ? 'var(--background-dark)' : 'var(--accent-green)',
                    color: isPlaying ? 'var(--accent-green)' : '#000',
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    border: isPlaying ? '2px solid var(--accent-green)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={handleNextChord}
                  style={{
                    backgroundColor: 'var(--background-dark)',
                    color: 'var(--text-primary)',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    border: '1px solid var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <FaStepForward />
                </button>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '2rem'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: 'var(--accent-green)',
                marginBottom: '1.5rem'
              }}>
                Chord Progression
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {song.chords.map((chord, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: currentChordIndex === index ? 'rgba(16, 185, 129, 0.2)' : '#1f2937',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      border: currentChordIndex === index ? '2px solid var(--accent-green)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentChordIndex(index)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        fontWeight: 'bold',
                        color: currentChordIndex === index ? 'var(--accent-green)' : 'var(--text-primary)'
                      }}>
                        Chord {index + 1}
                      </div>
                      {currentChordIndex === index && (
                        <div style={{
                          backgroundColor: 'var(--accent-green)',
                          color: '#000',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          padding: '0.25rem 0.5rem'
                        }}>
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
