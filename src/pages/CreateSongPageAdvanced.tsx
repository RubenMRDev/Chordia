import React, { useRef, useEffect, useState } from "react";
import Header from "../components/Header";

const NUM_KEYS = 88;
const NUM_STEPS = 64;
const STEP_WIDTH = 20;
const KEY_HEIGHT = 20;

interface Note {
  note: number;
  step: number;
  length: number;
}

function midiToNoteName(midi: number) {
  const notesNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const note = notesNames[midi % 12];
  return note + octave;
}

function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

const CreateSongPageAdvanced: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playPos, setPlayPos] = useState(0);
  const playheadRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const playInterval = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sincronizar scroll vertical teclado y roll
  useEffect(() => {
    const roll = rollRef.current;
    const keyboard = keyboardRef.current;
    if (!roll || !keyboard) return;
    const onScroll = () => {
      keyboard.scrollTop = roll.scrollTop;
    };
    roll.addEventListener('scroll', onScroll);
    return () => {
      roll.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Inicializar AudioContext
  useEffect(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Playhead animación y reproducción
  useEffect(() => {
    if (!isPlaying) {
      if (playInterval.current) clearTimeout(playInterval.current);
      setPlayPos(0);
      return;
    }
    let pos = 0;
    const stepMs = 60000 / bpm / 4;
    function playStep() {
      if (!isPlaying) return; // Detener si se ha parado
      setPlayPos(pos);
      // Reproducir todas las notas que empiezan en pos
      notes.forEach(n => {
        if (n.step === pos) {
          playNote(midiToFrequency(n.note), n.length * stepMs / 1000);
        }
      });
      pos++;
      if (pos > NUM_STEPS) {
        setIsPlaying(false);
        setPlayPos(0);
        return;
      }
      playInterval.current = setTimeout(playStep, stepMs);
    }
    playStep();
    return () => {
      if (playInterval.current) clearTimeout(playInterval.current);
    };
    // eslint-disable-next-line
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) setPlayPos(0);
  }, [isPlaying]);

  function playNote(freq: number, duration = 0.3) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  // Renderizado de teclado
  const renderKeyboard = () => {
    const keys = [];
    for (let i = NUM_KEYS - 1; i >= 0; i--) {
      const keyNumber = i + 21;
      const noteName = midiToNoteName(keyNumber);
      const noteInOctave = (keyNumber - 12) % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);
      keys.push(
        <div
          key={keyNumber}
          data-note={keyNumber}
          className={`key ${isBlack ? "black" : "white"}`}
          style={{ height: KEY_HEIGHT, lineHeight: `${KEY_HEIGHT}px` }}
          onClick={() => {
            const lengthToUse = selectedNote ? selectedNote.length : 4;
            if (notes.find(n => n.note === keyNumber && n.step === 0)) return;
            setNotes([...notes, { note: keyNumber, step: 0, length: lengthToUse }]);
          }}
        >
          {noteName}
        </div>
      );
    }
    return keys;
  };

  // Renderizado de grid
  const renderGrid = () => {
    const rows = [];
    for (let i = NUM_KEYS - 1; i >= 0; i--) {
      const noteNumber = i + 21;
      const cells = [];
      for (let j = 0; j < NUM_STEPS; j++) {
        cells.push(
          <div
            key={j}
            className="cell"
            style={{ borderLeft: j % 16 === 0 ? '2px solid #555' : undefined }}
            data-step={j}
            data-note={noteNumber}
            onClick={e => {
              const lengthToUse = selectedNote ? selectedNote.length : 4;
              if (notes.find(n => n.note === noteNumber && n.step === j)) return;
              setNotes([...notes, { note: noteNumber, step: j, length: lengthToUse }]);
            }}
          />
        );
      }
      rows.push(
        <div className="row" style={{ height: KEY_HEIGHT }} key={noteNumber} data-note={noteNumber}>
          {cells}
        </div>
      );
    }
    return rows;
  };

  // Renderizado de notas
  const renderNotes = () => {
    return notes.map((n, idx) => {
      const noteIndex = n.note - 21;
      const top = (KEY_HEIGHT * (NUM_KEYS - 1 - noteIndex) + 1);
      const left = (n.step * STEP_WIDTH + 1);
      const width = (n.length * STEP_WIDTH - 2);
      return (
        <div
          key={idx}
          className={`note${selectedNote === n ? " selected" : ""}`}
          style={{ top, left, width, height: 18, position: 'absolute', zIndex: 5, paddingLeft: 3, fontSize: 11, color: selectedNote === n ? '#700000' : '#222', background: selectedNote === n ? '#f28b82cc' : '#08bc7c', borderRadius: 3, display: 'flex', alignItems: 'center', userSelect: 'none', cursor: 'grab' }}
          onMouseDown={ev => {
            ev.preventDefault();
            if ((ev.target as HTMLElement).classList.contains('resizer')) {
              // Resize
              let startX = ev.clientX;
              let startLength = n.length;
              const onMove = (moveEv: MouseEvent) => {
                const dx = moveEv.clientX - startX;
                let newLength = startLength + Math.round(dx / STEP_WIDTH);
                newLength = Math.max(1, Math.min(NUM_STEPS - n.step, newLength));
                setNotes(notes => notes.map((note, i) => i === idx ? { ...note, length: newLength } : note));
              };
              const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            } else {
              // Drag
              let startX = ev.clientX;
              let startY = ev.clientY;
              let dragNoteStartStep = n.step;
              let dragNoteStartNote = n.note;
              setSelectedNote(n);
              const onMove = (moveEv: MouseEvent) => {
                const dx = moveEv.clientX - startX;
                const dy = moveEv.clientY - startY;
                let newStep = dragNoteStartStep + Math.round(dx / STEP_WIDTH);
                let newNote = dragNoteStartNote - Math.round(dy / KEY_HEIGHT);
                newStep = Math.max(0, Math.min(NUM_STEPS - n.length, newStep));
                newNote = Math.max(21, Math.min(108, newNote));
                setNotes(notes => notes.map((note, i) => i === idx ? { ...note, step: newStep, note: newNote } : note));
              };
              const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }
          }}
          onContextMenu={ev => {
            ev.preventDefault();
            setNotes(notes => notes.filter((_, i) => i !== idx));
            if (selectedNote === n) setSelectedNote(null);
          }}
        >
          {midiToNoteName(n.note)}
          <div className="resizer" style={{ position: 'absolute', right: 0, top: 0, width: 6, height: '100%', cursor: 'ew-resize', background: 'rgba(0,0,0,0.2)', borderRadius: '0 3px 3px 0' }} />
        </div>
      );
    });
  };

  // Playhead
  const playheadStyle: React.CSSProperties = {
    position: 'absolute',
    top: rollRef.current ? rollRef.current.scrollTop : 0,
    left: playPos * STEP_WIDTH,
    width: 2,
    background: '#08bc7c',
    height: NUM_KEYS * KEY_HEIGHT,
    pointerEvents: 'none',
    zIndex: 10,
  };

  // Estilos en línea para evitar conflictos globales
  const styles = `
    .key { height: 20px; border-bottom: 1px solid #444; box-sizing: border-box; cursor: pointer; position: relative; user-select: none; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; }
    .white { background: #eee; color: black; }
    .black { background: #333; color: #08bc7c; }
    .row { display: flex; border-bottom: 1px solid #333; height: 20px; box-sizing: border-box; }
    .cell { border-right: 1px solid #222; width: 20px; height: 20px; box-sizing: border-box; cursor: pointer; }
    .cell:nth-child(16n + 1) { border-left: 2px solid #555; }
    .note { transition: background-color 0.2s ease; }
    .note.selected { background-color: #f28b82cc !important; color: #700000 !important; }
    .note:active { cursor: grabbing; }
    .note .resizer { position: absolute; right: 0; top: 0; width: 6px; height: 100%; cursor: ew-resize; background: rgba(0,0,0,0.2); border-radius: 0 3px 3px 0; }
    #topbar { height: 40px; background: #222; color: white; display: flex; align-items: center; padding: 0 10px; gap: 10px; box-sizing: border-box; flex-shrink: 0; }
    #topbar label { user-select: none; }
    #topbar input[type=number] { width: 60px; background: #111; border: 1px solid #444; color: white; font-size: 14px; padding: 3px 6px; border-radius: 4px; }
    #playButton { background: #08bc7c; border: none; color: #222; padding: 6px 12px; font-weight: bold; cursor: pointer; border-radius: 4px; }
    #playButton:disabled { background: #555; cursor: not-allowed; }
    #container { display: flex; flex: 1; height: calc(100vh - 40px); overflow: hidden; position: relative; }
    #keyboard { width: 60px; background: #222; border-right: 1px solid #444; position: relative; overflow-y: scroll; flex-shrink: 0; }
    #roll { flex: 1; background: #111; overflow: auto; position: relative; }
    #grid { position: relative; width: 1280px; height: 1760px; box-sizing: border-box; }
    #playhead { position: absolute; top: 0; width: 2px; background: #08bc7c; height: 1760px; pointer-events: none; z-index: 10; left: 0; }
  `;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header />
      <style>{styles}</style>
      <div id="topbar">
        <label htmlFor="bpm">BPM:</label>
        <input
          type="number"
          id="bpm"
          min={20}
          max={300}
          value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          style={{ width: 60, background: '#111', border: '1px solid #444', color: 'white', fontSize: 14, padding: '3px 6px', borderRadius: 4 }}
        />
        <button
          id="playButton"
          onClick={() => setIsPlaying(p => !p)}
          style={{ background: isPlaying ? '#555' : '#08bc7c', color: '#222', padding: '6px 12px', fontWeight: 'bold', borderRadius: 4, border: 'none', cursor: isPlaying ? 'pointer' : 'pointer' }}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
      <div id="container" style={{ display: 'flex', flex: 1, height: 'calc(100vh - 40px)', overflow: 'hidden', position: 'relative' }}>
        <div id="keyboard" ref={keyboardRef} style={{ width: 60, background: '#222', borderRight: '1px solid #444', position: 'relative', overflowY: 'scroll', flexShrink: 0 }}>
          {renderKeyboard()}
        </div>
        <div id="roll" ref={rollRef} style={{ flex: 1, background: '#111', overflow: 'auto', position: 'relative' }}>
          <div id="grid" style={{ position: 'relative', width: 1280, height: 1760, boxSizing: 'border-box' }}>
            {renderGrid()}
            {renderNotes()}
            <div id="playhead" ref={playheadRef} style={playheadStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSongPageAdvanced;
