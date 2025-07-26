import React, { useState } from 'react';
import { usePiano } from '../hooks/usePiano';

interface InteractivePianoProps {
  selectedNotes?: string[];
  onNoteClick?: (note: string, index: number) => void;
  octave?: number;
  className?: string;
  showLabels?: boolean;
}

const InteractivePiano: React.FC<InteractivePianoProps> = ({
  selectedNotes = [],
  onNoteClick,
  octave = 1,
  className = "",
  showLabels = true
}) => {
  const { isReady: pianoReady, playNote } = usePiano();
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const hasBlackKeyAfter = [true, true, false, true, true, true, false];

  const handleKeyClick = async (note: string, index: number) => {
    if (pianoReady) {
      try {
        await playNote(note, "8n", 0.7);
      } catch (error) {
        console.error('Error playing piano note:', error);
      }
    }
    if (onNoteClick) {
      onNoteClick(note, index);
    }
  };

  const isNoteSelected = (note: string, index: number): boolean => {
    const noteWithIndex = `${note}-${index}`;
    return selectedNotes.includes(noteWithIndex);
  };

  const getKeyClass = (note: string, index: number, isBlack: boolean = false) => {
    const baseClass = isBlack 
      ? "absolute h-full w-[16%] z-20 border-x border-gray-600 rounded-b-sm box-border cursor-pointer transition-all duration-150"
      : "flex-1 h-full border border-gray-600 rounded-b-sm relative z-10 cursor-pointer transition-all duration-150";
    
    const isSelected = isNoteSelected(note, index);
    const isHovered = hoveredNote === `${note}-${index}`;
    
    if (isBlack) {
      if (isSelected) {
        return `${baseClass} bg-[#00E676] hover:bg-[#00D666]`;
      } else if (isHovered) {
        return `${baseClass} bg-gray-700 hover:bg-gray-600`;
      } else {
        return `${baseClass} bg-black hover:bg-gray-800`;
      }
    } else {
      if (isSelected) {
        return `${baseClass} bg-[#00E676] hover:bg-[#00D666]`;
      } else if (isHovered) {
        return `${baseClass} bg-gray-200 hover:bg-gray-300`;
      } else {
        return `${baseClass} bg-white hover:bg-gray-100`;
      }
    }
  };

  const getLabelClass = (note: string, index: number, isBlack: boolean = false) => {
    const isSelected = isNoteSelected(note, index);
    
    if (isBlack) {
      return `absolute bottom-[5px] w-full text-center text-xs font-bold ${
        isSelected ? "text-white" : "text-transparent"
      }`;
    } else {
      return `absolute bottom-[5px] w-full text-center ${
        isSelected ? "text-white font-bold" : "text-black font-normal"
      }`;
    }
  };

  return (
    <div className={`relative h-[120px] w-full max-w-[400px] mx-auto ${className}`}>
      <div className="flex h-full w-full">
        {Array(octave)
          .fill(whiteKeys)
          .flat()
          .map((note, index) => (
            <div
              key={`white-${index}`}
              className={getKeyClass(note, index)}
              onClick={() => handleKeyClick(note, index)}
              onMouseEnter={() => setHoveredNote(`${note}-${index}`)}
              onMouseLeave={() => setHoveredNote(null)}
            >
              {showLabels && (
                <div className={getLabelClass(note, index)}>
                  {note}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-[60%]">
        {Array(octave)
          .fill(whiteKeys)
          .flat()
          .map((_, idx) => {
            if (!hasBlackKeyAfter[idx % 7]) return null;
            
            const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
            const blackKeyIdx = [0, 1, 3, 4, 5].indexOf(idx % 7);
            if (blackKeyIdx === -1) return null;
            
            const blackNote = blackKeyNames[blackKeyIdx];
            const octaveOffset = Math.floor(idx / 7);
            const adjustedPosition = (octaveOffset * 7 + (idx % 7) + 1) / (octave * 7);
            
            return (
              <div
                key={`black-${idx}`}
                className={getKeyClass(blackNote, idx, true)}
                style={{ left: `calc(${adjustedPosition * 100}% - 9%)` }}
                onClick={() => handleKeyClick(blackNote, idx)}
                onMouseEnter={() => setHoveredNote(`${blackNote}-${idx}`)}
                onMouseLeave={() => setHoveredNote(null)}
              >
                {showLabels && (
                  <div className={getLabelClass(blackNote, idx, true)}>
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

export default InteractivePiano; 