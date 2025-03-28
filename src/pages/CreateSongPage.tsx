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
      confirmButtonColor: "var(--accent-green)",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Yes, leave page',
      cancelButtonText: 'No, stay here',
      background: "var(--background-darker)",
      color: "var(--text-secondary)",
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
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
      return;
    }
    if (chordProgression.length === 0) {
      Swal.fire({
        title: 'No Chords',
        text: 'Please add at least one chord to your progression before saving',
        icon: 'error',
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
      return;
    }
    if (!currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You need to be logged in to save songs',
        icon: 'error',
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
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
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      }).then(() => {
        navigate('/library');
      });
    } catch (error) {
      console.error("Error saving song:", error);
      Swal.fire({
        title: 'Error',
        text: 'There was a problem saving your song. Please try again.',
        icon: 'error',
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const MiniPiano = ({ chord }: { chord: ChordType }) => {
    const chordNotes = chord.keys.map(k => k.split('-')[0]);
    return (
      <div className="relative h-10 w-full">
        <div className="flex h-full w-full">
          {whiteKeys.map((note, idx) => (
            <div
              key={`mini-white-${idx}`}
              className={`flex-1 h-full ${chordNotes.includes(note) ? "bg-emerald-500" : "bg-white"} border border-gray-600 rounded-b-sm relative z-10`}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 right-0 h-3/5">
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
                className={`absolute h-full ${isSelected ? "bg-emerald-500" : "bg-black"} z-20 w-4/25 rounded-b-sm border-x border-gray-600 box-border`}
                style={{ left: `calc(${position * 100}% - 9%)` }}
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
    <div className="flex justify-center p-5 pt-8 text-white">
      <div className="w-full max-w-4xl flex flex-col gap-5">
        <div className="bg-gray-800 rounded-lg p-5">
          <input
            type="text"
            placeholder="Enter Song Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full py-3 px-4 bg-gray-700 border-none rounded-md text-white text-base"
          />
        </div>
        <div className="bg-gray-800 rounded-lg p-5">
          <div className="mb-4">
            <span className="text-emerald-500 text-base font-medium block mb-3">
              Song Parameters
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label 
                  htmlFor="key-select" 
                  className="block mb-2 text-gray-300 text-sm"
                >
                  Key
                </label>
                <select
                  id="key-select"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer text-sm"
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
                  className="block mb-2 text-gray-300 text-sm"
                >
                  Time Signature
                </label>
                <select
                  id="time-select"
                  value={timeSignature}
                  onChange={(e) => setTimeSignature(e.target.value)}
                  className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer text-sm"
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
                  className="block mb-2 text-gray-300 text-sm"
                >
                  Tempo (BPM)
                </label>
                <div className="flex items-center">
                  <input
                    id="tempo-input"
                    type="number"
                    min="40"
                    max="240"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-emerald-500 text-base font-medium">
              Select Chords
            </span>
            <div className="flex items-center gap-2.5 text-gray-300">
              <span>Octaves:</span>
              <select
                value={octave}
                onChange={(e) => handleOctaveChange(Number(e.target.value))}
                className="bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer"
              >
                {[1, 2].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-center my-5 overflow-hidden">
            <div className="md:hidden flex flex-col gap-4">
              <div className="relative flex h-24 sm:h-28 mx-auto" style={{ width: `calc(100% - 20px)` }}>
                {whiteKeys.map((note, index) => {
                  const noteWithIndex = `${note}-${index}`;
                  const isSelected = selectedKeys.includes(noteWithIndex);
                  return (
                    <div
                      key={`white-${index}`}
                      onClick={() => handleKeyClick(note, index)}
                      className={`flex-1 h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                    >
                      <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full text-[10px] sm:text-xs`}>
                        {note}
                      </div>
                    </div>
                  );
                })}
                {whiteKeys.map((_, keyIndex) => {
                  if (!hasBlackKeyAfter[keyIndex]) return null;
                  const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                  const blackKeyIndex = [0, 1, 3, 4, 5].indexOf(keyIndex);
                  const note = blackKeyNames[blackKeyIndex];
                  const noteWithIndex = `${note}-${keyIndex}`;  
                  const isSelected = selectedKeys.includes(noteWithIndex);
                  return (
                    <div
                      key={`black-${keyIndex}`}
                      onClick={() => handleKeyClick(note, keyIndex)}
                      className={`absolute h-[60%] sm:h-[70%] ${isSelected ? 'bg-emerald-500' : 'bg-black'} z-20 w-[8%] sm:w-[10%] rounded-b-md cursor-pointer transition-colors`}
                      style={{ left: `calc(${(keyIndex + 1) * 100 / 7}% - 4%)` }}
                    >
                      <div className="text-white text-center absolute bottom-1 w-full text-[8px] sm:text-[10px]">
                        {note}
                      </div>
                    </div>
                  );
                })}
              </div>
              {octave === 2 && (
                <div className="relative flex h-24 sm:h-28 mx-auto" style={{ width: `calc(100% - 20px)` }}>
                  {whiteKeys.map((note, index) => {
                    const actualIndex = index + 7;
                    const noteWithIndex = `${note}-${actualIndex}`;
                    const isSelected = selectedKeys.includes(noteWithIndex);
                    return (
                      <div
                        key={`white-${actualIndex}`}
                        onClick={() => handleKeyClick(note, actualIndex)}
                        className={`flex-1 h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                      >
                        <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full text-[10px] sm:text-xs`}>
                          {note}
                        </div>
                      </div>
                    );
                  })}
                  {whiteKeys.map((_, keyIndex) => {
                    if (!hasBlackKeyAfter[keyIndex]) return null;
                    const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                    const blackKeyIndex = [0, 1, 3, 4, 5].indexOf(keyIndex);
                    const note = blackKeyNames[blackKeyIndex];
                    const actualIndex = keyIndex + 10;
                    const noteWithIndex = `${note}-${actualIndex}`;
                    const isSelected = selectedKeys.includes(noteWithIndex);
                    return (
                      <div
                        key={`black-${actualIndex}`}
                        onClick={() => handleKeyClick(note, actualIndex)}
                        className={`absolute h-[60%] sm:h-[70%] ${isSelected ? 'bg-emerald-500' : 'bg-black'} z-20 w-[8%] sm:w-[10%] rounded-b-md cursor-pointer transition-colors`}
                        style={{ left: `calc(${(keyIndex + 1) * 100 / 7}% - 4%)` }}
                      >
                        <div className="text-white text-center absolute bottom-1 w-full text-[8px] sm:text-[10px]">
                          {note}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleSaveChord}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {editingChordIndex !== null ? "Update Chord" : "Save Chord"}
                </button>
                {editingChordIndex !== null && (
                  <button
                    onClick={handleCancelEdit}
                    className="ml-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col justify-center mx-auto overflow-x-auto md:overflow-visible">
              <div
                className="relative flex h-36"
                style={{ width: octave === 1 ? `${54 * 7}px` : `${54 * 7 * octave}px` }}
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
                        className={`w-[54px] h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                      >
                        <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full`}>
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
                        className={`w-8 h-[90px] ${isSelected ? 'bg-emerald-500' : 'bg-black'} absolute top-0 z-20 rounded-b-md cursor-pointer transition-colors`}
                        style={{ left: `${position * 54 + 36}px` }}
                      >
                        <div className="text-white text-center absolute bottom-1 w-full text-xs">
                          {note}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSaveChord}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-8 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {editingChordIndex !== null ? "Update Chord" : "Save Chord"}
                </button>
                {editingChordIndex !== null && (
                  <button
                    onClick={handleCancelEdit}
                    className="ml-3 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-emerald-500 text-base font-medium">
              Chord Progression
            </span>
          </div>
          {chordProgression.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {chordProgression.map((chord, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-md p-2 text-center"
                >
                  <MiniPiano chord={chord} />
                  <div className="flex justify-between mt-2 gap-1.5">
                    <button
                      onClick={() => handleEditChord(index)}
                      className="bg-emerald-500 text-white border-none rounded-md py-1 px-2 cursor-pointer flex-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChord(index)}
                      className="bg-red-500 text-white border-none rounded-md py-1 px-2 cursor-pointer flex-1 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center italic text-gray-400">No chords created.</p>
          )}
        </div>
        <button
          onClick={handleSaveSong}
          disabled={isSaving}
          className={`${isSaving ? 'bg-teal-600' : 'bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5'} text-white border-none rounded-lg py-4 px-4 text-base font-semibold cursor-pointer w-full shadow-md transition-all duration-200 ${isSaving ? 'cursor-not-allowed' : ''}`}
        >
          {isSaving ? "Saving..." : "Save Song"}
        </button>
      </div>
    </div>
    </>
  )
}
