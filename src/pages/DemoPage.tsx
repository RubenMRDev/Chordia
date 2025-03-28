"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import Header from "../components/Header"
import { FaTimes, FaPlay, FaPause, FaArrowRight, FaArrowLeft, FaQuestion, FaLightbulb, FaMusic } from "react-icons/fa"
import Swal from 'sweetalert2'
interface ChordType {
  keys: string[] 
  selected: boolean
}
interface TutorialStep {
  title: string;
  content: string;
  target?: string;
  position: "top" | "bottom" | "left" | "right";
}
const DemoPage = () => {
  const navigate = useNavigate()
  const [songTitle, setSongTitle] = useState<string>("My Demo Song")
  const [octave, setOctave] = useState<number>(1)
  const [tempo, setTempo] = useState<number>(130)
  const [key, setKey] = useState<string>("C Major")
  const [timeSignature, setTimeSignature] = useState<string>("4/4")
  const [chordProgression, setChordProgression] = useState<ChordType[]>([])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [editingChordIndex, setEditingChordIndex] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [currentTutorialStep, setCurrentTutorialStep] = useState<number>(0);
  const [highlightArea, setHighlightArea] = useState<string | null>(null);
  const metronomeRef = useRef<HTMLAudioElement | null>(null);
  const pianoSoundsRef = useRef<{[key: string]: HTMLAudioElement}>({});
  const playbackIntervalRef = useRef<number | null>(null);
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"]
  const hasBlackKeyAfter = [true, true, false, true, true, true, false]
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Chordia Demo!",
      content: "This interactive demo shows you how to create your own songs with chord progressions. Let's get started!",
      position: "top"
    },
    {
      title: "Set Song Parameters",
      content: "First, set basic song parameters like key, time signature, and tempo. These define the musical structure of your song.",
      target: "song-parameters",
      position: "bottom"
    },
    {
      title: "Piano Interface",
      content: "Use this piano keyboard to select notes and create chords. Click on keys to select or deselect them.",
      target: "piano-interface",
      position: "top"
    },
    {
      title: "Create Chords",
      content: "After selecting keys, click 'Save Chord' to add it to your progression. You can create as many chords as you want.",
      target: "save-chord",
      position: "bottom"
    },
    {
      title: "Chord Progression",
      content: "Your saved chords will appear here. You can edit or delete them as needed.",
      target: "chord-progression",
      position: "top"
    },
    {
      title: "Try It Yourself!",
      content: "Now it's your turn! Experiment with creating your own chord progression. Click 'End Tutorial' to start creating.",
      position: "bottom"
    }
  ];
  useEffect(() => {
    const notes = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];
    notes.forEach(note => {
      try {
        const audio = new Audio(`/piano-sounds/${note}.mp3`);
        audio.preload = "auto";
        pianoSoundsRef.current[note] = audio;
      } catch (error) {
        console.error(`Failed to load piano sound for ${note}:`, error);
      }
    });
    metronomeRef.current = new Audio("/metronome-click.mp3");
    metronomeRef.current.preload = "auto";
    return () => {
      Object.values(pianoSoundsRef.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      if (metronomeRef.current) {
        metronomeRef.current.pause();
        metronomeRef.current.currentTime = 0;
      }
      if (playbackIntervalRef.current !== null) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (showTutorial && tutorialSteps[currentTutorialStep].target) {
      setHighlightArea(tutorialSteps[currentTutorialStep].target || null);
    } else {
      setHighlightArea(null);
    }
  }, [currentTutorialStep, showTutorial]);
  const handleOctaveChange = (newOctave: number) => {
    setOctave(newOctave)
  }
  const normalizeNote = (note: string): string => {
    return note.replace('s', '#');
  }
  const handleEditChord = (index: number) => {
    console.log("Editing chord", index, chordProgression[index]);
    setEditingChordIndex(index);
    setSelectedKeys([]);
    const chordToEdit = chordProgression[index];
    const normalizedKeys = chordToEdit.keys.map(key => {
      const [notePart, indexPart] = key.split('-');
      return `${normalizeNote(notePart)}-${indexPart}`;
    });
    console.log("Setting selected keys to:", normalizedKeys);
    setTimeout(() => {
      setSelectedKeys(normalizedKeys);
    }, 50);
  }
  const handleKeyClick = (note: string, index: number) => {
    const normalized = normalizeNote(note);
    const noteWithIndex = `${normalized}-${index}`;
    console.log("Clicked on note:", noteWithIndex);
    console.log("Current selected keys:", selectedKeys);
    setSelectedKeys(prev => {
      const alreadySelectedIndex = prev.findIndex(key => key === noteWithIndex);
      if (alreadySelectedIndex >= 0) {
        return prev.filter((_, idx) => idx !== alreadySelectedIndex);
      } else {
        playPianoSound(note);
        return [...prev, noteWithIndex];
      }
    });
  };
  const playPianoSound = (note: string) => {
    const formattedNote = note.replace('#', 's');
    if (pianoSoundsRef.current[formattedNote]) {
      try {
        const audioClone = pianoSoundsRef.current[formattedNote].cloneNode(true) as HTMLAudioElement;
        audioClone.volume = 0.7;
        audioClone.play().catch(e => console.error(`Couldn't play piano sound:`, e));
      } catch (error) {
        console.error(`Error playing piano sound:`, error);
      }
    }
  };
  const playChordSound = (chord: ChordType) => {
    chord.keys.forEach(key => {
      const note = key.split('-')[0];
      playPianoSound(note);
    });
  };
  const handleSaveChord = () => {
    if (selectedKeys.length > 0) {
      const normalizedKeys = selectedKeys.map(key => {
        const [notePart, indexPart] = key.split('-');
        return `${normalizeNote(notePart)}-${indexPart}`;
      });
      if (editingChordIndex !== null) {
        setChordProgression(prev => {
          const updated = [...prev];
          updated[editingChordIndex] = { keys: normalizedKeys, selected: true };
          return updated;
        });
        setEditingChordIndex(null);
      } else {
        const newChord: ChordType = { keys: normalizedKeys, selected: true };
        setChordProgression(prev => [...prev, newChord]);
      }
      setSelectedKeys([]);
    }
  }
  const handleDeleteChord = (index: number) => {
    setChordProgression(prev => prev.filter((_, i) => i !== index));
  }
  const handleCancelEdit = () => {
    setEditingChordIndex(null);
    setSelectedKeys([]);
  }
  const isNoteSelected = (note: string, index: number | string): boolean => {
    const normalized = normalizeNote(note);
    const noteWithIndex = `${normalized}-${index}`;
    return selectedKeys.includes(noteWithIndex);
  }
  const nextTutorialStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
    }
  };
  const prevTutorialStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(prev => prev - 1);
    }
  };
  const startPlayback = () => {
    if (playbackIntervalRef.current !== null) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    setIsPlaying(true);
    let currentChordIndex = 0;
    const playNextChord = () => {
      if (chordProgression.length > 0) {
        playChordSound(chordProgression[currentChordIndex]);
        currentChordIndex = (currentChordIndex + 1) % chordProgression.length;
      }
    };
    playNextChord();
    const beatDuration = 60000 / tempo;
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0]);
    const interval = beatDuration * beatsPerMeasure;
    playbackIntervalRef.current = window.setInterval(playNextChord, interval);
  };
  const stopPlayback = () => {
    setIsPlaying(false);
    if (playbackIntervalRef.current !== null) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    Object.values(pianoSoundsRef.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };
  const handlePlayPause = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };
  const handleDemoFinished = () => {
    Swal.fire({
      title: 'Ready to Create Your Own Songs?',
      text: "Sign up to save your compositions and access all features!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: "var(--accent-green)",
      cancelButtonColor: "#6B7280",
      confirmButtonText: 'Sign Up Now',
      cancelButtonText: 'Continue Demo',
      background: "var(--background-darker)",
      color: "var(--text-secondary)",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/register');
      }
    });
  };
  const reopenTutorial = () => {
    setCurrentTutorialStep(0);
    setShowTutorial(true);
  };
  const MiniPiano = ({ chord }: { chord: ChordType }) => {
    const chordNotes = chord.keys.map(k => {
      const note = k.split('-')[0];
      return note.replace('s', '#');
    });
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
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current !== null) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);
  return (
    <>
      <Header />
      <div className="relative flex justify-center p-5 pt-8 text-white">
        {}
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full relative">
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
              <div className="text-emerald-500 text-4xl mb-4">
                <FaLightbulb />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-emerald-500">
                {tutorialSteps[currentTutorialStep].title}
              </h2>
              <p className="mb-6 text-gray-300">
                {tutorialSteps[currentTutorialStep].content}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={prevTutorialStep}
                  className={`flex items-center ${currentTutorialStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-emerald-500'}`}
                  disabled={currentTutorialStep === 0}
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
                <button
                  onClick={nextTutorialStep}
                  className="flex items-center text-emerald-500 hover:text-emerald-400"
                >
                  {currentTutorialStep === tutorialSteps.length - 1 ? 'End Tutorial' : 'Next'} 
                  {currentTutorialStep < tutorialSteps.length - 1 && <FaArrowRight className="ml-2" />}
                </button>
              </div>
            </div>
          </div>
        )}
        {}
        <button 
          onClick={reopenTutorial}
          className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-30"
        >
          <FaQuestion />
        </button>
        <div className="w-full max-w-4xl flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h1 className="text-emerald-500 text-2xl font-bold">Chordia Demo</h1>
            <div className="flex space-x-3">
              <button
                onClick={handlePlayPause}
                className={`py-2 px-4 rounded-md ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-black font-medium`}
              >
                {isPlaying ? <><FaPause className="inline mr-2" /> Stop</> : <><FaPlay className="inline mr-2" /> Play Progression</>}
              </button>
              <button
                onClick={handleDemoFinished}
                className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
              >
                Try Full Version
              </button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-5">
            <input
              type="text"
              placeholder="Enter Song Title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="w-full py-3 px-4 bg-gray-700 border-none rounded-md text-white text-base"
            />
          </div>
          <div className={`bg-gray-800 rounded-lg p-5 ${highlightArea === 'song-parameters' ? 'ring-4 ring-emerald-500' : ''}`} id="song-parameters">
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
          <div className={`bg-gray-800 rounded-lg p-5 ${highlightArea === 'piano-interface' ? 'ring-4 ring-emerald-500' : ''}`} id="piano-interface">
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
                    const isSelected = isNoteSelected(note, index);
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
                    const isSelected = isNoteSelected(note, keyIndex);
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
                      const isSelected = isNoteSelected(note, actualIndex);
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
                      const isSelected = isNoteSelected(note, actualIndex);
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
                <div className="flex justify-center mt-3" id="save-chord">
                  <button
                    onClick={handleSaveChord}
                    className={`bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center ${highlightArea === 'save-chord' ? 'ring-4 ring-blue-400' : ''}`}
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
                      const isSelected = isNoteSelected(note, index);
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
                      const isSelected = isNoteSelected(note, octaveOffset * 10 + actualKeyIndex);
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
                <div className="flex justify-center mt-4" id="save-chord">
                  <button
                    onClick={handleSaveChord}
                    className={`bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-8 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center ${highlightArea === 'save-chord' ? 'ring-4 ring-blue-400' : ''}`}
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
          <div className={`bg-gray-800 rounded-lg p-5 ${highlightArea === 'chord-progression' ? 'ring-4 ring-emerald-500' : ''}`} id="chord-progression">
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
              <div className="text-center italic text-gray-400 py-6">
                <div className="flex flex-col items-center">
                  <FaMusic className="text-3xl mb-3 text-emerald-500 opacity-70" />
                  <p>No chords created yet. Use the piano above to select notes and create a chord.</p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-800 rounded-lg p-5 mt-4">
            <h3 className="text-emerald-500 text-lg font-medium mb-3">Quick Tips</h3>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>Click on piano keys to select notes for your chord</li>
              <li>Click "Save Chord" to add the chord to your progression</li>
              <li>You can edit or delete any chord in your progression</li>
              <li>Use the Play button to hear your chord progression</li>
              <li>In the full version, you can save your songs and access them anytime</li>
            </ul>
          </div>
          <Link
            to="/register"
            className="bg-emerald-500 hover:bg-emerald-600 text-black border-none rounded-lg py-4 px-4 text-base font-semibold cursor-pointer w-full shadow-md transition-all duration-200 flex items-center justify-center"
          >
            Sign Up for Full Access
          </Link>
        </div>
      </div>
    </>
  );
};
export default DemoPage;
