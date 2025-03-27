"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { createSong } from "../firebase/songService"
import Swal from 'sweetalert2'
interface ChordType {
  keys: string[] 
  selected: boolean
}
const HeaderWithConfirmation = () => {
  const handleLinkClick = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    Swal.fire({
      title: 'Are you sure you want to leave?',
      text: "Your song will not be saved if you leave now.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, leave page',
      cancelButtonText: 'No, stay here'
    }).then((result) => {
      if (result.isConfirmed && href) {
        window.location.href = href;
      }
    });
  };
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const observer = new MutationObserver(() => {
      const headerLinks = header.querySelectorAll('a');
      headerLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
        link.addEventListener('click', handleLinkClick);
      });
    });
    observer.observe(header, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      const headerLinks = header.querySelectorAll('a');
      headerLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);
  return <Header />;
};
export default function CreateSongPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [songTitle, setSongTitle] = useState<string>("")
  const [octave, setOctave] = useState<number>(1)
  const [tempo, setTempo] = useState<number>(130)
  const [key, setKey] = useState<string>("C Major")
  const [timeSignature, setTimeSignature] = useState<string>("4/4")
  const [chordProgression, setChordProgression] = useState<ChordType[]>([])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [editingChordIndex, setEditingChordIndex] = useState<number | null>(null);
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"]
  const hasBlackKeyAfter = [true, true, false, true, true, true, false]
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      console.log(
        "Playing chord progression:",
        chordProgression.filter((c) => c.selected).map((c) => c.keys.join(", ")),
      )
      setTimeout(() => setIsPlaying(false), 4000) 
    }
  }
  const handleOctaveChange = (newOctave: number) => {
    setOctave(newOctave)
  }
  const handleKeyClick = (note: string, index: number) => {
    setSelectedKeys(prev => {
      const noteWithIndex = `${note}-${index}`;
      if (prev.includes(noteWithIndex)) {
        return prev.filter(key => key !== noteWithIndex);
      } else {
        return [...prev, noteWithIndex];
      }
    });
  };
  const handleSaveChord = () => {
    if (selectedKeys.length > 0) {
      if (editingChordIndex !== null) {
        setChordProgression(prev => {
          const updated = [...prev];
          updated[editingChordIndex] = { keys: [...selectedKeys], selected: true };
          return updated;
        });
        setEditingChordIndex(null);
      } else {
        const newChord: ChordType = { keys: [...selectedKeys], selected: true };
        setChordProgression(prev => [...prev, newChord]);
      }
      setSelectedKeys([]);
    }
  }
  const handleEditChord = (index: number) => {
    setEditingChordIndex(index);
    setSelectedKeys(chordProgression[index].keys);
  }
  const handleDeleteChord = (index: number) => {
    setChordProgression(prev => prev.filter((_, i) => i !== index));
  }
  const handleCancelEdit = () => {
    setEditingChordIndex(null);
    setSelectedKeys([]);
  }
  const handleSaveSong = async () => {
    if (!songTitle.trim()) {
      Swal.fire({
        title: 'Missing Title',
        text: 'Please enter a song title before saving',
        icon: 'error',
        confirmButtonColor: '#10b981',
      });
      return;
    }
    if (chordProgression.length === 0) {
      Swal.fire({
        title: 'No Chords',
        text: 'Please add at least one chord to your progression before saving',
        icon: 'error',
        confirmButtonColor: '#10b981',
      });
      return;
    }
    if (!currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You need to be logged in to save songs',
        icon: 'error',
        confirmButtonColor: '#10b981',
      });
      return;
    }
    try {
      setIsSaving(true);
      const songData = {
        userId: currentUser.uid,
        title: songTitle,
        tempo,
        key,
        timeSignature,
        chords: chordProgression,
        createdAt: new Date().toISOString()
      };
      const songId = await createSong(songData);
      Swal.fire({
        title: 'Success!',
        text: `Song "${songTitle}" saved successfully!`,
        icon: 'success',
        confirmButtonColor: '#10b981',
      }).then(() => {
        navigate('/library');
      });
    } catch (error) {
      console.error("Error saving song:", error);
      Swal.fire({
        title: 'Error',
        text: 'There was a problem saving your song. Please try again.',
        icon: 'error',
        confirmButtonColor: '#10b981',
      });
    } finally {
      setIsSaving(false);
    }
  };
  const MiniPiano = ({ chord }: { chord: ChordType }) => {
    const chordNotes = chord.keys.map(k => k.split('-')[0]);
    return (
      <div style={{ position: "relative", height: "40px", width: "100%" }}>
        
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          {whiteKeys.map((note, idx) => (
            <div
              key={`mini-white-${idx}`}
              style={{
                flex: 1,
                height: "100%",
                backgroundColor: chordNotes.includes(note) ? "#10b981" : "white",
                border: "1px solid #4b5563",
                borderRadius: "0 0 2px 2px",
                position: "relative",
                zIndex: 1,
              }}
            />
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
                key={`mini-black-${idx}`}
                style={{
                  position: "absolute",
                  height: "100%",
                  left: `calc(${position * 100}% - 9%)`,
                  backgroundColor: isSelected ? "#10b981" : "black",
                  zIndex: 2,
                  width: "16%", 
                  borderRadius: "0 0 2px 2px",
                  borderLeft: "1px solid #4b5563", 
                  borderRight: "1px solid #4b5563", 
                  boxSizing: "border-box",
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <>
    <HeaderWithConfirmation />
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        paddingTop: "30px", 
        color: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        
        <div
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Song Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "#374151",
              border: "none",
              borderRadius: "6px",
              color: "#ffffff",
              fontSize: "16px",
            }}
          />
        </div>
        
        <div
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <div
            style={{
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                color: "#10b981",
                fontSize: "16px",
                fontWeight: 500,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Song Parameters
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              
              <div>
                <label 
                  htmlFor="key-select" 
                  style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    color: "#d1d5db", 
                    fontSize: "14px" 
                  }}
                >
                  Key
                </label>
                <select
                  id="key-select"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#374151",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {[
                    "C Major", "G Major", "D Major", "A Major", "E Major", "B Major", 
                    "F# Major", "C# Major", "F Major", "Bb Major", "Eb Major", "Ab Major", 
                    "Db Major", "Gb Major", "Cb Major",
                    "A Minor", "E Minor", "B Minor", "F# Minor", "C# Minor", "G# Minor", 
                    "D# Minor", "A# Minor", "D Minor", "G Minor", "C Minor", "F Minor", 
                    "Bb Minor", "Eb Minor", "Ab Minor"
                  ].map((keyName) => (
                    <option key={keyName} value={keyName}>
                      {keyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label 
                  htmlFor="time-select" 
                  style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    color: "#d1d5db", 
                    fontSize: "14px" 
                  }}
                >
                  Time Signature
                </label>
                <select
                  id="time-select"
                  value={timeSignature}
                  onChange={(e) => setTimeSignature(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#374151",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {["4/4", "3/4", "2/4", "6/8", "9/8", "12/8", "5/4", "7/8"].map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label 
                  htmlFor="tempo-input" 
                  style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    color: "#d1d5db", 
                    fontSize: "14px" 
                  }}
                >
                  Tempo (BPM)
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    id="tempo-input"
                    type="number"
                    min="40"
                    max="240"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    style={{
                      width: "100%",
                      backgroundColor: "#374151",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                color: "#10b981",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Select Chords
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#d1d5db",
              }}
            >
              <span>Octaves:</span>
              <select
                value={octave}
                onChange={(e) => handleOctaveChange(Number(e.target.value))}
                style={{
                  backgroundColor: "#374151",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                {[1, 2].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button
              onClick={handleSaveChord}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              {editingChordIndex !== null ? "Update chord" : "Save chord"}
            </button>
            {editingChordIndex !== null && (
              <button
                onClick={handleCancelEdit}
                style={{
                  backgroundColor: "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
          
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                width: `${54 * 7 * 2}px`, 
                height: "150px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  width: `${54 * 7 * octave}px`, 
                  height: "150px",
                  margin: "0 auto", 
                }}
              >
                
                {Array(octave)
                  .fill(whiteKeys)
                  .flat()
                  .map((note, index) => {
                    const noteWithIndex = `${note}-${index}`;
                    const isSelected = selectedKeys.includes(noteWithIndex);
                    return (
                      <div
                        key={`white-${index}`}
                        onClick={() => handleKeyClick(note, index)}
                        style={{
                          width: "54px",
                          height: "100%",
                          backgroundColor: isSelected ? "#10b981" : "white",
                          borderLeft: index === 0 ? "none" : "1px solid #4b5563", 
                          borderRadius: "0 0 4px 4px",
                          position: "relative",
                          zIndex: 1,
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <div style={{ 
                          color: isSelected ? "white" : "black", 
                          textAlign: "center", 
                          position: "absolute", 
                          bottom: "5px", 
                          width: "100%" 
                        }}>
                          {note}
                        </div>
                      </div>
                    );
                  })}
                
                {Array(octave)
                  .fill([...Array(7).keys()])
                  .flat()
                  .map((keyIndex, octaveIndex) => {
                    const actualKeyIndex = keyIndex % 7;
                    if (!hasBlackKeyAfter[actualKeyIndex]) {
                      return null;
                    }
                    const octaveOffset = Math.floor(octaveIndex / 7);
                    const position = (octaveIndex % 7) + (octaveOffset * 7);
                    const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                    const blackKeyIndex = [0, 1, 3, 4, 5].indexOf(actualKeyIndex);
                    const note = blackKeyNames[blackKeyIndex];
                    const noteWithIndex = `${note}-${octaveOffset * 10 + actualKeyIndex}`;
                    const isSelected = selectedKeys.includes(noteWithIndex);
                    return (
                      <div
                        key={`black-${octaveIndex}`}
                        onClick={() => handleKeyClick(note, octaveOffset * 10 + actualKeyIndex)}
                        style={{
                          width: "32px",
                          height: "90px",
                          backgroundColor: isSelected ? "#10b981" : "black",
                          position: "absolute",
                          left: `${position * 54 + 36}px`,
                          top: 0,
                          zIndex: 2,
                          borderRadius: "0 0 4px 4px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <div style={{ 
                          color: "white", 
                          textAlign: "center", 
                          position: "absolute", 
                          bottom: "5px", 
                          width: "100%",
                          fontSize: "12px"
                        }}>
                          {note}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        
        <div
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                color: "#10b981",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Chord Progression
            </span>
          </div>
          {chordProgression.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {chordProgression.map((chord, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#374151",
                    borderRadius: "6px",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <MiniPiano chord={chord} />
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginTop: "8px", 
                    gap: "5px" 
                  }}>
                    <button
                      onClick={() => handleEditChord(index)}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "12px"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChord(index)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "12px"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", fontStyle: "italic", color: "#9CA3AF" }}>No chords created.</p>
          )}
        </div>
        
        <button
          onClick={handleSaveSong}
          disabled={isSaving}
          style={{
            backgroundColor: isSaving ? "#0d9488" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isSaving ? "not-allowed" : "pointer",
            width: "100%",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (!isSaving) {
              e.currentTarget.style.backgroundColor = "#059669";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseOut={(e) => {
            if (!isSaving) {
              e.currentTarget.style.backgroundColor = "#10b981";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {isSaving ? "Saving..." : "Save Song"}
        </button>
      </div>
    </div>
    </>
  )
}
