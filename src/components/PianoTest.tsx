import React, { useState } from 'react';
import { usePiano } from '../hooks/usePiano';

const PianoTest: React.FC = () => {
  const { isReady, isLoading, playNote, playChord, stopAllNotes } = usePiano();
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const notes = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

  const handleNoteClick = async (note: string) => {
    if (!isReady) return;
    
    try {
      await playNote(note, "8n", 0.8);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  };

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

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Piano Test (Tone.js)</h2>
      
      <div className="mb-4">
        <p className="text-gray-300">
          Status: {isLoading ? 'Loading...' : isReady ? 'Ready' : 'Not Ready'}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Individual Notes</h3>
        <div className="flex flex-wrap gap-2">
          {notes.map(note => (
            <button
              key={note}
              onClick={() => handleNoteClick(note)}
              disabled={!isReady}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Chord Builder</h3>
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
            Play Chord ({selectedNotes.join(', ')})
          </button>
          <button
            onClick={handleStopAll}
            disabled={!isReady}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Stop All
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <p>This component tests the new Tone.js piano service.</p>
        <p>Click individual notes to play them, or select multiple notes to play as a chord.</p>
      </div>
    </div>
  );
};

export default PianoTest; 