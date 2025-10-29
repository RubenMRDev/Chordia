import React from 'react';
interface InteractivePianoProps {
    selectedNotes?: string[];
    onNoteClick?: (note: string, index: number) => void;
    octave?: number;
    className?: string;
    showLabels?: boolean;
}
declare const InteractivePiano: React.FC<InteractivePianoProps>;
export default InteractivePiano;
