import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { usePiano } from '../hooks/usePiano';
import InteractivePiano from './InteractivePiano';
const PianoTest = () => {
    const { isReady, isLoading, playNote: _playNote, playChord, stopAllNotes } = usePiano();
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [interactiveSelectedNotes, setInteractiveSelectedNotes] = useState([]);
    const notes = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
    const handleNoteSelect = (note) => {
        setSelectedNotes(prev => {
            if (prev.includes(note)) {
                return prev.filter(n => n !== note);
            }
            else {
                return [...prev, note];
            }
        });
    };
    const handlePlayChord = async () => {
        if (!isReady || selectedNotes.length === 0)
            return;
        try {
            await playChord(selectedNotes, "4n", 0.6);
        }
        catch (error) {
            console.error('Error playing chord:', error);
        }
    };
    const handleStopAll = () => {
        stopAllNotes();
    };
    const handleInteractiveNoteClick = (note, index) => {
        const noteWithIndex = `${note}-${index}`;
        setInteractiveSelectedNotes(prev => {
            if (prev.includes(noteWithIndex)) {
                return prev.filter(n => n !== noteWithIndex);
            }
            else {
                return [...prev, noteWithIndex];
            }
        });
    };
    return (_jsxs("div", { className: "p-6 bg-gray-800 rounded-lg", children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Piano Test (Tone.js) - Feedback Inmediato" }), _jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-gray-300", children: ["Status: ", isLoading ? 'Loading...' : isReady ? 'Ready' : 'Not Ready'] }), _jsx("p", { className: "text-green-400 text-sm mt-1", children: "\u2728 Ahora todas las notas se reproducen inmediatamente al tocarlas" })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Piano Interactivo" }), _jsx("p", { className: "text-gray-400 text-sm mb-4", children: "Haz clic en cualquier tecla para escuchar el sonido. Las teclas seleccionadas se resaltan en verde." }), _jsx(InteractivePiano, { selectedNotes: interactiveSelectedNotes, onNoteClick: handleInteractiveNoteClick, octave: 1, className: "mb-4" }), _jsx("div", { className: "text-center", children: _jsxs("p", { className: "text-gray-300 text-sm", children: ["Notas seleccionadas: ", interactiveSelectedNotes.length > 0
                                    ? interactiveSelectedNotes.map(n => n.split('-')[0]).join(', ')
                                    : 'Ninguna'] }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "Constructor de Acordes" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: notes.map(note => (_jsx("button", { onClick: () => handleNoteSelect(note), className: `px-4 py-2 rounded ${selectedNotes.includes(note)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-white hover:bg-gray-700'}`, children: note }, note))) }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: handlePlayChord, disabled: !isReady || selectedNotes.length === 0, className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed", children: ["Tocar Acorde (", selectedNotes.join(', '), ")"] }), _jsx("button", { onClick: handleStopAll, disabled: !isReady, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Detener Todo" })] })] }), _jsxs("div", { className: "text-sm text-gray-400", children: [_jsxs("p", { className: "mb-2", children: ["\uD83C\uDFB9 ", _jsx("strong", { children: "Nuevas Caracter\u00EDsticas:" })] }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Feedback inmediato al tocar cualquier nota" }), _jsx("li", { children: "Samples de piano de alta calidad con Tone.js" }), _jsx("li", { children: "Menor latencia y mejor respuesta" }), _jsx("li", { children: "Funciona tanto con teclado como con MIDI" }), _jsx("li", { children: "Fallback autom\u00E1tico si los samples no cargan" })] })] })] }));
};
export default PianoTest;
