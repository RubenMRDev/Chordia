import React, { useState } from 'react';
import { usePiano } from '../hooks/usePiano';
import InteractivePiano from './InteractivePiano';

const PianoTest: React.FC = () => {
  const { isReady, isLoading, playNote, playChord, stopAllNotes } = usePiano();
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [interactiveSelectedNotes, setInteractiveSelectedNotes] = useState<string[]>([]);

  const notes = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

  const handleNoteSelect = (note: string) => {
    setSelectedNotes(prev => {
      if (prev.includes(note)) {
        return prev.filter(n => n !== note);
      } else {
        return [...prev, note];
      }
    });
  };

  const handlePlayChord = async () => {
    if (!isReady || selectedNotes.length === 0) return;
    
    try {
      await playChord(selectedNotes, "4n", 0.6);
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  };

  const handleStopAll = () => {
    stopAllNotes();
  };

  const handleInteractiveNoteClick = (note: string, index: number) => {
    const noteWithIndex = `${note}-${index}`;
    setInteractiveSelectedNotes(prev => {
      if (prev.includes(noteWithIndex)) {
        return prev.filter(n => n !== noteWithIndex);
      } else {
        return [...prev, noteWithIndex];
      }
    });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Piano Test (Tone.js) - Feedback Inmediato</h2>
      
      <div className="mb-4">
        <p className="text-gray-300">
          Status: {isLoading ? 'Loading...' : isReady ? 'Ready' : 'Not Ready'}
        </p>
        <p className="text-green-400 text-sm mt-1">
          ✨ Ahora todas las notas se reproducen inmediatamente al tocarlas
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Piano Interactivo</h3>
        <p className="text-gray-400 text-sm mb-4">
          Haz clic en cualquier tecla para escuchar el sonido. Las teclas seleccionadas se resaltan en verde.
        </p>
        <InteractivePiano
          selectedNotes={interactiveSelectedNotes}
          onNoteClick={handleInteractiveNoteClick}
          octave={1}
          className="mb-4"
        />
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Notas seleccionadas: {interactiveSelectedNotes.length > 0 
              ? interactiveSelectedNotes.map(n => n.split('-')[0]).join(', ')
              : 'Ninguna'
            }
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Constructor de Acordes</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {notes.map(note => (
            <button
              key={note}
              onClick={() => handleNoteSelect(note)}
              className={`px-4 py-2 rounded ${
                selectedNotes.includes(note)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePlayChord}
            disabled={!isReady || selectedNotes.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tocar Acorde ({selectedNotes.join(', ')})
          </button>
          <button
            onClick={handleStopAll}
            disabled={!isReady}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Detener Todo
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <p className="mb-2">🎹 <strong>Nuevas Características:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Feedback inmediato al tocar cualquier nota</li>
          <li>Samples de piano de alta calidad con Tone.js</li>
          <li>Menor latencia y mejor respuesta</li>
          <li>Funciona tanto con teclado como con MIDI</li>
          <li>Fallback automático si los samples no cargan</li>
        </ul>
      </div>
    </div>
  );
};

export default PianoTest; 