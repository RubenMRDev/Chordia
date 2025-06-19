"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { createSong } from '../api/songApi'
import Swal from 'sweetalert2'
import { usePiano } from '../hooks/usePiano'
import AIChordGenerator from '../components/AIChordGenerator'

interface ChordType {
  keys: string[] 
  selected: boolean
}

// Circle of Fifths data
const circleOfFifths = {
  major: [
    { key: "C", chords: ["C", "F", "G"] },
    { key: "G", chords: ["G", "C", "D"] },
    { key: "D", chords: ["D", "G", "A"] },
    { key: "A", chords: ["A", "D", "E"] },
    { key: "E", chords: ["E", "A", "B"] },
    { key: "B", chords: ["B", "E", "F#"] },
    { key: "F#", chords: ["F#", "B", "C#"] },
    { key: "C#", chords: ["C#", "F#", "G#"] },
    { key: "F", chords: ["F", "Bb", "C"] },
    { key: "Bb", chords: ["Bb", "Eb", "F"] },
    { key: "Eb", chords: ["Eb", "Ab", "Bb"] },
    { key: "Ab", chords: ["Ab", "Db", "Eb"] }
  ],
  minor: [
    { key: "Am", chords: ["Am", "Dm", "Em"] },
    { key: "Em", chords: ["Em", "Am", "Bm"] },
    { key: "Bm", chords: ["Bm", "Em", "F#m"] },
    { key: "F#m", chords: ["F#m", "Bm", "C#m"] },
    { key: "C#m", chords: ["C#m", "F#m", "G#m"] },
    { key: "G#m", chords: ["G#m", "C#m", "A#m"] },
    { key: "Dm", chords: ["Dm", "Gm", "Am"] },
    { key: "Gm", chords: ["Gm", "Cm", "Dm"] },
    { key: "Cm", chords: ["Cm", "Fm", "Gm"] },
    { key: "Fm", chords: ["Fm", "Bbm", "Cm"] },
    { key: "Bbm", chords: ["Bbm", "Ebm", "Fm"] },
    { key: "Ebm", chords: ["Ebm", "Abm", "Bbm"] }
  ]
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
  const [_isPlaying, _setIsPlaying] = useState<boolean>(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [editingChordIndex, setEditingChordIndex] = useState<number | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(true);
  const [selectedKeyType, setSelectedKeyType] = useState<"major" | "minor">("major");
  const [selectedCircleKey, setSelectedCircleKey] = useState<string>("C");
  const [selectedCircleChords, setSelectedCircleChords] = useState<string[]>([]);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState<boolean>(false);
  
  // Piano hook
  const {} = usePiano();
  
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"]
  const hasBlackKeyAfter = [true, true, false, true, true, true, false]

  // Función para generar notas con octavas correctas
  const generateNotesWithOctaves = (octaveCount: number): string[] => {
    const notes: string[] = [];
    for (let oct = 4; oct < 4 + octaveCount; oct++) {
      whiteKeys.forEach(note => {
        notes.push(`${note}${oct}`);
      });
    }
    return notes;
  };

  // Función para generar teclas negras con octavas correctas
  const generateBlackKeysWithOctaves = (octaveCount: number): string[] => {
    const blackKeys = ["C#", "D#", "F#", "G#", "A#"];
    const notes: string[] = [];
    for (let oct = 4; oct < 4 + octaveCount; oct++) {
      blackKeys.forEach(note => {
        notes.push(`${note}${oct}`);
      });
    }
    return notes;
  };

  const handleOctaveChange = (newOctave: number) => {
    setOctave(newOctave)
  }
  
  const handleKeyClick = (note: string) => {
    setSelectedKeys(prev => {
      if (prev.includes(note)) {
        return prev.filter(key => key !== note);
      } else {
        return [...prev, note];
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
      // Using void to explicitly ignore the returned value
      void await createSong(songData);
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
  
  const MiniPiano = ({ chord, pianoClassName = '' }: { chord: ChordType, pianoClassName?: string }) => {
    // Detectar si el acorde tiene notas de 2 octavas
    const octaves = [...new Set(chord.keys.map(k => k.slice(-1)))].sort();
    const hasTwoOctaves = octaves.length > 1;
    
    // Separar notas por octava
    const notesByOctave: { [key: string]: string[] } = {};
    chord.keys.forEach(note => {
      const octave = note.slice(-1);
      const noteName = note.replace(/\d/g, '');
      if (!notesByOctave[octave]) {
        notesByOctave[octave] = [];
      }
      notesByOctave[octave].push(noteName);
    });

    // Estilos comunes
    const pianoBg = "bg-[#232e3a]";
    const whiteKeyBase = "border border-gray-700 h-full transition-colors duration-150";
    const whiteKeySelected = "bg-emerald-500 shadow-[0_2px_8px_#10b98155] border-emerald-600";
    const whiteKeyUnselected = "bg-white hover:bg-gray-200";
    const blackKeyBase = "absolute top-0 rounded-b-md border-x border-gray-800 z-20 transition-colors duration-150";
    const blackKeySelected = "bg-emerald-500 shadow-[0_2px_8px_#10b98155] border-emerald-600";
    const blackKeyUnselected = "bg-black";
    const pianoShadow = "rounded-lg shadow-lg";

    // Para 2 octavas: 14 teclas blancas, 10 negras
    const whiteKeys2Oct = [
      ...whiteKeys.map(n => n + '4'),
      ...whiteKeys.map(n => n + '5')
    ];
    // Índices de teclas blancas donde va cada negra (centrada entre dos blancas)
    const blackKeys2Oct = [
      { note: 'C#4', idx: 0 }, { note: 'D#4', idx: 1 },
      { note: 'F#4', idx: 3 }, { note: 'G#4', idx: 4 }, { note: 'A#4', idx: 5 },
      { note: 'C#5', idx: 7 }, { note: 'D#5', idx: 8 },
      { note: 'F#5', idx: 10 }, { note: 'G#5', idx: 11 }, { note: 'A#5', idx: 12 }
    ];

    const renderSingleOctave = (octaveNotes: string[], octaveLabel?: string) => (
      <div className={`relative w-full h-12 md:h-10 flex flex-col items-center ${pianoShadow} ${pianoBg} py-1 px-2 ${pianoClassName}`}>
        {octaveLabel && (
          <div className="text-center mb-1">
            <span className="text-emerald-400 text-xs font-medium">{octaveLabel}</span>
          </div>
        )}
        <div className="relative w-full h-full">
          <div className="grid grid-cols-7 w-full h-full">
            {whiteKeys.map((note, idx) => (
              <div
                key={`mini-white-${idx}`}
                className={`${whiteKeyBase} ${octaveNotes.includes(note) ? whiteKeySelected : whiteKeyUnselected} rounded-b-md relative z-10`}
                style={{ minWidth: 0 }}
              />
            ))}
          </div>
          {/* Teclas negras */}
          {whiteKeys.map((_, idx) => {
            if (!hasBlackKeyAfter[idx]) return null;
            const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
            const blackKeyIdx = [0, 1, 3, 4, 5].indexOf(idx);
            if (blackKeyIdx === -1) return null;
            const blackNote = blackKeyNames[blackKeyIdx];
            const isSelected = octaveNotes.includes(blackNote);
            // Posición relativa al grid de 7 columnas
            const left = ((idx + 1) / 7) * 100;
            return (
              <div
                key={`mini-black-${idx}`}
                className={`${blackKeyBase} ${isSelected ? blackKeySelected : blackKeyUnselected}`}
                style={{ left: `calc(${left}% - 7%)`, width: '12%', height: '65%' }}
              />
            );
          })}
        </div>
      </div>
    );

    const renderTwoOctaves = () => {
      // Notas seleccionadas por nombre y octava
      const selectedNotes = chord.keys;
      return (
        <div className={`relative w-full h-12 md:h-10 flex flex-col items-center ${pianoShadow} ${pianoBg} py-1 px-2 ${pianoClassName}`}>
          <div className="relative w-full h-full">
            <div className="grid grid-cols-14 w-full h-full">
              {whiteKeys2Oct.map((note, idx) => {
                const isSelected = selectedNotes.includes(note);
                return (
                  <div
                    key={`mini-white2oct-${idx}`}
                    className={`${whiteKeyBase} ${isSelected ? whiteKeySelected : whiteKeyUnselected} rounded-b-md relative z-10`}
                    style={{ minWidth: 0 }}
                  />
                );
              })}
            </div>
            {/* 10 teclas negras */}
            {blackKeys2Oct.map((b, idx) => {
              const isSelected = selectedNotes.includes(b.note);
              // Centrar la tecla negra entre dos teclas blancas
              const left = `calc(${((b.idx + 1) / 14) * 100}% - 3.5%)`;
              return (
                <div
                  key={`mini-black2oct-${idx}`}
                  className={`${blackKeyBase} ${isSelected ? blackKeySelected : blackKeyUnselected}`}
                  style={{ left, width: '7%', height: '55%' }}
                />
              );
            })}
          </div>
        </div>
      );
    };

    // Si tiene 2 octavas, mostrar una fila de 14 teclas blancas, sino mostrar 1 octava
    return hasTwoOctaves ? renderTwoOctaves() : renderSingleOctave(chord.keys.map(k => k.replace(/\d/g, '')));
  };

  const handleCircleChordSelect = (chord: string) => {
    setSelectedCircleChords(prev => {
      if (prev.includes(chord)) {
        return prev.filter(c => c !== chord);
      } else {
        return [...prev, chord];
      }
    });
  };

  const handleAddCircleChords = () => {
    if (selectedCircleChords.length > 0) {
      const newChords: ChordType[] = selectedCircleChords.map(chord => {
        // Convert chord names to piano keys with correct octaves
        const chordToKeys: { [key: string]: string[] } = {
          "C": ["C4", "E4", "G4"],
          "F": ["F4", "A4", "C5"],
          "G": ["G4", "B4", "D5"],
          "D": ["D4", "F#4", "A4"],
          "A": ["A4", "C#5", "E5"],
          "E": ["E4", "G#4", "B4"],
          "B": ["B4", "D#5", "F#5"],
          "F#": ["F#4", "A#4", "C#5"],
          "C#": ["C#4", "E#4", "G#4"],
          "Bb": ["Bb4", "D5", "F5"],
          "Eb": ["Eb4", "G4", "Bb4"],
          "Ab": ["Ab4", "C5", "Eb5"],
          "Db": ["Db4", "F4", "Ab4"],
          "Am": ["A4", "C5", "E5"],
          "Dm": ["D4", "F4", "A4"],
          "Em": ["E4", "G4", "B4"],
          "Bm": ["B4", "D5", "F#5"],
          "F#m": ["F#4", "A4", "C#5"],
          "C#m": ["C#4", "E4", "G#4"],
          "G#m": ["G#4", "B4", "D#5"],
          "Gm": ["G4", "Bb4", "D5"],
          "Cm": ["C4", "Eb4", "G4"],
          "Fm": ["F4", "Ab4", "C5"],
          "Bbm": ["Bb4", "Db5", "F5"],
          "Ebm": ["Eb4", "Gb4", "Bb4"]
        };
        
        return {
          keys: chordToKeys[chord] || ["C4", "E4", "G4"], // Default to C major if not found
          selected: true
        };
      });
      
      setChordProgression(prev => [...prev, ...newChords]);
      setSelectedCircleChords([]);
    }
  };

  const CircleOfFifthsSVG = () => {
    // Datos de acordes en círculo (mayores afuera, menores adentro)
    const majorChords = [
      "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"
    ];
    const minorChords = [
      "Am", "Em", "Bm", "F#m", "C#m", "G#m", "Ebm", "Bbm", "Fm", "Cm", "Gm", "Dm"
    ];
    // Ángulos para cada acorde
    const angleStep = 360 / 12;
    // Estado para acorde seleccionado
    const [selectedCircleChord, setSelectedCircleChord] = useState<string | null>(null);

    // Mapeo de acordes a teclas con octavas correctas
    const chordToKeys: { [key: string]: string[] } = {
      "C": ["C4", "E4", "G4"],
      "G": ["G4", "B4", "D5"],
      "D": ["D4", "F#4", "A4"],
      "A": ["A4", "C#5", "E5"],
      "E": ["E4", "G#4", "B4"],
      "B": ["B4", "D#5", "F#5"],
      "F#": ["F#4", "A#4", "C#5"],
      "Db": ["Db4", "F4", "Ab4"],
      "Ab": ["Ab4", "C5", "Eb5"],
      "Eb": ["Eb4", "G4", "Bb4"],
      "Bb": ["Bb4", "D5", "F5"],
      "F": ["F4", "A4", "C5"],
      "Am": ["A4", "C5", "E5"],
      "Em": ["E4", "G4", "B4"],
      "Bm": ["B4", "D5", "F#5"],
      "F#m": ["F#4", "A4", "C#5"],
      "C#m": ["C#4", "E4", "G#4"],
      "G#m": ["G#4", "B4", "D#5"],
      "Ebm": ["Eb4", "Gb4", "Bb4"],
      "Bbm": ["Bb4", "Db5", "F5"],
      "Fm": ["F4", "Ab4", "C5"],
      "Cm": ["C4", "Eb4", "G4"],
      "Gm": ["G4", "Bb4", "D5"],
      "Dm": ["D4", "F4", "A4"]
    };

    const handleAddChord = () => {
      if (selectedCircleChord) {
        setChordProgression(prev => [
          ...prev,
          { keys: chordToKeys[selectedCircleChord] || ["C4", "E4", "G4"], selected: true }
        ]);
        setSelectedCircleChord(null);
      }
    };

    // SVG size and radii
    const size = 380;
    const center = size / 2;
    const outerRadius = 120;
    const innerRadius = 75;

    // Utilidad para calcular posición en círculo
    const getCoords = (radius: number, angleDeg: number) => {
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      return {
        x: center + radius * Math.cos(angleRad),
        y: center + radius * Math.sin(angleRad)
      };
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <svg width={size} height={size}>
          {/* Círculo exterior (mayores) */}
          {majorChords.map((chord, i) => {
            const { x, y } = getCoords(outerRadius, i * angleStep);
            const isSelected = selectedCircleChord === chord;
            return (
              <g key={chord}>
                <circle
                  cx={x}
                  cy={y}
                  r={24}
                  fill={isSelected ? "#10b981" : "#222"}
                  stroke="#fff"
                  strokeWidth={isSelected ? 4 : 2}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => setSelectedCircleChord(chord)}
                />
                <text
                  x={x}
                  y={y + 6}
                  textAnchor="middle"
                  fontSize="20"
                  fill={isSelected ? "#fff" : "#eee"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  style={{ pointerEvents: "none" }}
                >
                  {chord}
                </text>
              </g>
            );
          })}
          {/* Círculo interior (menores) */}
          {minorChords.map((chord, i) => {
            const { x, y } = getCoords(innerRadius, i * angleStep);
            const isSelected = selectedCircleChord === chord;
            return (
              <g key={chord}>
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill={isSelected ? "#10b981" : "#444"}
                  stroke="#fff"
                  strokeWidth={isSelected ? 4 : 2}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => setSelectedCircleChord(chord)}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fill={isSelected ? "#fff" : "#eee"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  style={{ pointerEvents: "none" }}
                >
                  {chord}
                </text>
              </g>
            );
          })}
        </svg>
        <button
          onClick={handleAddChord}
          disabled={!selectedCircleChord}
          className={`mt-2 px-6 py-2 rounded-md font-medium text-white transition-colors ${selectedCircleChord ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-600 cursor-not-allowed"}`}
        >
          Agregar acorde
        </button>
      </div>
    );
  };

  const handleAIGeneratedChords = (chords: ChordType[]) => {
    setChordProgression(prev => [...prev, ...chords]);
  };

  // Generar notas para el piano
  const whiteKeysWithOctaves = generateNotesWithOctaves(octave);
  const blackKeysWithOctaves = generateBlackKeysWithOctaves(octave);

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
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <div className="flex flex-row gap-2 flex-1">
                <button
                  onClick={() => setIsAdvancedMode(false)}
                  className={`flex-1 px-3 py-1 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
                    !isAdvancedMode 
                      ? "bg-emerald-500 text-white" 
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                >
                  Simple
                </button>
                <button
                  onClick={() => setIsAdvancedMode(true)}
                  className={`flex-1 px-3 py-1 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
                    isAdvancedMode 
                      ? "bg-emerald-500 text-white" 
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                >
                  Advanced
                </button>
                <button
                  onClick={() => setIsAIGeneratorOpen(true)}
                  className="flex-1 px-3 py-1 rounded-md text-sm font-semibold transition-colors bg-cyan-500 hover:bg-cyan-600 text-white whitespace-nowrap"
                >
                  IA Generate
                </button>
              </div>
            </div>
          </div>
          
          {!isAdvancedMode ? (
            <CircleOfFifthsSVG />
          ) : (
            <>
              <div className="flex items-center gap-2.5 text-gray-300 mb-4">
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
              <div className="flex flex-col justify-center my-5 overflow-hidden">
                <div className="md:hidden flex flex-col gap-4">
                  {/* Primera octava */}
                  <div className="text-center mb-2">
                    <span className="text-emerald-400 text-sm font-medium">Octave 4 (C4 - B4)</span>
                  </div>
                  <div className="relative flex h-24 sm:h-28 mx-auto" style={{ width: `calc(100% - 20px)` }}>
                    {whiteKeysWithOctaves.slice(0, 7).map((note, index) => {
                      const isSelected = selectedKeys.includes(note);
                      const noteName = note.replace(/\d/g, '');
                      return (
                        <div
                          key={`white-${index}`}
                          onClick={() => handleKeyClick(note)}
                          className={`flex-1 h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                        >
                          <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full text-[10px] sm:text-xs`}>
                            {noteName}
                          </div>
                        </div>
                      );
                    })}
                    {whiteKeysWithOctaves.slice(0, 7).map((_, keyIndex) => {
                      if (!hasBlackKeyAfter[keyIndex]) return null;
                      const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                      const blackKeyIndex = [0, 1, 3, 4, 5].indexOf(keyIndex);
                      const note = blackKeyNames[blackKeyIndex] + "4";
                      const isSelected = selectedKeys.includes(note);
                      return (
                        <div
                          key={`black-${keyIndex}`}
                          onClick={() => handleKeyClick(note)}
                          className={`absolute h-[60%] sm:h-[70%] ${isSelected ? 'bg-emerald-500' : 'bg-black'} z-20 w-[8%] sm:w-[10%] rounded-b-md cursor-pointer transition-colors`}
                          style={{ left: `calc(${(keyIndex + 1) * 100 / 7}% - 4%)` }}
                        >
                          <div className="text-white text-center absolute bottom-1 w-full text-[8px] sm:text-[10px]">
                            {note.replace(/\d/g, '')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Segunda octava (si está seleccionada) */}
                  {octave === 2 && (
                    <>
                      <div className="text-center mb-2">
                        <span className="text-emerald-400 text-sm font-medium">Octave 5 (C5 - B5)</span>
                      </div>
                      <div className="relative flex h-24 sm:h-28 mx-auto" style={{ width: `calc(100% - 20px)` }}>
                        {whiteKeysWithOctaves.slice(7, 14).map((note, index) => {
                          const isSelected = selectedKeys.includes(note);
                          const noteName = note.replace(/\d/g, '');
                          return (
                            <div
                              key={`white-${index + 7}`}
                              onClick={() => handleKeyClick(note)}
                              className={`flex-1 h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                            >
                              <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full text-[10px] sm:text-xs`}>
                                {noteName}
                              </div>
                            </div>
                          );
                        })}
                        {whiteKeysWithOctaves.slice(7, 14).map((_, keyIndex) => {
                          if (!hasBlackKeyAfter[keyIndex]) return null;
                          const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                          const blackKeyIndex = [0, 1, 3, 4, 5].indexOf(keyIndex);
                          const note = blackKeyNames[blackKeyIndex] + "5";
                          const isSelected = selectedKeys.includes(note);
                          return (
                            <div
                              key={`black-${keyIndex + 7}`}
                              onClick={() => handleKeyClick(note)}
                              className={`absolute h-[60%] sm:h-[70%] ${isSelected ? 'bg-emerald-500' : 'bg-black'} z-20 w-[8%] sm:w-[10%] rounded-b-md cursor-pointer transition-colors`}
                              style={{ left: `calc(${(keyIndex + 1) * 100 / 7}% - 4%)` }}
                            >
                              <div className="text-white text-center absolute bottom-1 w-full text-[8px] sm:text-[10px]">
                                {note.replace(/\d/g, '')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
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
                  {octave === 1 ? (
                    <>
                      <div className="text-center mb-3">
                        <span className="text-emerald-400 text-sm font-medium">Octave 4 (C4 - B4)</span>
                      </div>
                      <div className="relative flex h-36" style={{ width: `${54 * 7}px` }}>
                        {/* Teclas blancas */}
                        {whiteKeysWithOctaves.slice(0, 7).map((note, index) => {
                          const isSelected = selectedKeys.includes(note);
                          const noteName = note.replace(/\d/g, '');
                          return (
                            <div
                              key={`white-${index}`}
                              onClick={() => handleKeyClick(note)}
                              className={`w-[54px] h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                            >
                              <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full`}>
                                {noteName}
                              </div>
                            </div>
                          );
                        })}
                        {/* Teclas negras */}
                        {blackKeysWithOctaves.slice(0, 5).map((note, index) => {
                          const isSelected = selectedKeys.includes(note);
                          const noteName = note.replace(/\d/g, '');
                          const blackKeyPositions = [0, 1, 3, 4, 5];
                          const position = blackKeyPositions[index];
                          
                          return (
                            <div
                              key={`black-${index}`}
                              onClick={() => handleKeyClick(note)}
                              className={`w-8 h-[90px] ${isSelected ? 'bg-emerald-500' : 'bg-black'} absolute top-0 z-20 rounded-b-md cursor-pointer transition-colors`}
                              style={{ left: `${position * 54 + 36}px` }}
                            >
                              <div className="text-white text-center absolute bottom-1 w-full text-xs">
                                {noteName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Primera octava */}
                      <div className="text-center mb-3">
                        <span className="text-emerald-400 text-sm font-medium">Octave 4 (C4 - B4)</span>
                      </div>
                      <div className="relative flex h-36 mb-4" style={{ width: `${54 * 7}px` }}>
                        {/* Teclas blancas */}
                        {whiteKeysWithOctaves.slice(0, 7).map((note, index) => {
                          const isSelected = selectedKeys.includes(note);
                          const noteName = note.replace(/\d/g, '');
                          return (
                            <div
                              key={`white-${index}`}
                              onClick={() => handleKeyClick(note)}
                              className={`w-[54px] h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                            >
                              <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full`}>
                                {noteName}
                              </div>
                            </div>
                          );
                        })}
                        {/* Teclas negras */}
                        {blackKeysWithOctaves.slice(0, 5).map((note, index) => {
                          const isSelected = selectedKeys.includes(note);
                          const noteName = note.replace(/\d/g, '');
                          const blackKeyPositions = [0, 1, 3, 4, 5];
                          const position = blackKeyPositions[index];
                          
                          return (
                            <div
                              key={`black-${index}`}
                              onClick={() => handleKeyClick(note)}
                              className={`w-8 h-[90px] ${isSelected ? 'bg-emerald-500' : 'bg-black'} absolute top-0 z-20 rounded-b-md cursor-pointer transition-colors`}
                              style={{ left: `${position * 54 + 36}px` }}
                            >
                              <div className="text-white text-center absolute bottom-1 w-full text-xs">
                                {noteName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Segunda octava */}
                      <div className="text-center mb-3">
                        <span className="text-emerald-400 text-sm font-medium">Octave 5 (C5 - B5)</span>
                      </div>
                      <div className="relative flex h-36" style={{ width: `${54 * 7}px` }}>
                        {/* Teclas blancas */}
                        {whiteKeysWithOctaves.slice(7, 14).map((note, index) => {
                          const isSelected = selectedKeys.includes(note);
                          const noteName = note.replace(/\d/g, '');
                          return (
                            <div
                              key={`white-${index + 7}`}
                              onClick={() => handleKeyClick(note)}
                              className={`w-[54px] h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`}
                            >
                              <div className={`${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full`}>
                                {noteName}
                              </div>
                            </div>
                          );
                        })}
                        {/* Teclas negras */}
                        {blackKeysWithOctaves.slice(5, 10).map((note, index) => {
                          const isSelected = selectedKeys.includes(note);
                          const noteName = note.replace(/\d/g, '');
                          const blackKeyPositions = [0, 1, 3, 4, 5];
                          const position = blackKeyPositions[index];
                          
                          return (
                            <div
                              key={`black-${index + 5}`}
                              onClick={() => handleKeyClick(note)}
                              className={`w-8 h-[90px] ${isSelected ? 'bg-emerald-500' : 'bg-black'} absolute top-0 z-20 rounded-b-md cursor-pointer transition-colors`}
                              style={{ left: `${position * 54 + 36}px` }}
                            >
                              <div className="text-white text-center absolute bottom-1 w-full text-xs">
                                {noteName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
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
            </>
          )}
        </div>
        <div className="bg-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-emerald-500 text-base font-medium">
              Chord Progression
            </span>
          </div>
          {chordProgression.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {chordProgression.map((chord, index) => {
                const octaves = [...new Set(chord.keys.map(k => k.slice(-1)))];
                const isDouble = octaves.length > 1;
                return (
                  <div
                    key={index}
                    className={`bg-gray-700 rounded-md p-3 text-center flex flex-col items-center justify-between ${isDouble ? 'max-w-[640px]' : 'max-w-[320px]'} w-full`}
                  >
                    <div className="w-full">
                      <MiniPiano chord={chord} pianoClassName="h-20 md:h-24 w-full" />
                    </div>
                    <div className="flex justify-between mt-3 gap-2 w-full">
                      <button
                        onClick={() => handleEditChord(index)}
                        className="bg-emerald-500 text-white border-none rounded-md py-2 px-3 cursor-pointer flex-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteChord(index)}
                        className="bg-red-500 text-white border-none rounded-md py-2 px-3 cursor-pointer flex-1 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
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

    {/* AI Chord Generator Modal */}
    <AIChordGenerator
      isOpen={isAIGeneratorOpen}
      onClose={() => setIsAIGeneratorOpen(false)}
      onChordsGenerated={handleAIGeneratedChords}
    />
    </>
  )
}
