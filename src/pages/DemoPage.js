"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { FaTimes, FaPlay, FaPause, FaArrowRight, FaArrowLeft, FaQuestion, FaLightbulb, FaMusic } from "react-icons/fa";
import Swal from 'sweetalert2';
import { usePiano } from '../hooks/usePiano';
const DemoPage = () => {
    const navigate = useNavigate();
    const [songTitle, setSongTitle] = useState("My Demo Song");
    const [octave, setOctave] = useState(1);
    const [tempo, setTempo] = useState(130);
    const [key, setKey] = useState("C Major");
    const [timeSignature, setTimeSignature] = useState("4/4");
    const [chordProgression, setChordProgression] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [editingChordIndex, setEditingChordIndex] = useState(null);
    const [showTutorial, setShowTutorial] = useState(true);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
    const [highlightArea, setHighlightArea] = useState(null);
    const metronomeRef = useRef(null);
    const playbackIntervalRef = useRef(null);
    const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
    const hasBlackKeyAfter = [true, true, false, true, true, true, false];
    // Piano hook
    const { isReady: pianoReady, playNote: playPianoNote, playChord: playPianoChord, stopAllNotes } = usePiano();
    const tutorialSteps = [
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
            }
            catch (error) {
                console.error(`Failed to load piano sound for ${note}:`, error);
            }
        });
        metronomeRef.current = new Audio("/metronome-click.mp3");
        metronomeRef.current.preload = "auto";
        return () => {
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
        }
        else {
            setHighlightArea(null);
        }
    }, [currentTutorialStep, showTutorial]);
    const handleOctaveChange = (newOctave) => {
        setOctave(newOctave);
    };
    const normalizeNote = (note) => {
        return note.replace('s', '#');
    };
    const handleEditChord = (index) => {
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
    };
    const handleKeyClick = async (note, index) => {
        const normalized = normalizeNote(note);
        const noteWithIndex = `${normalized}-${index}`;
        console.log("Clicked on note:", noteWithIndex);
        console.log("Current selected keys:", selectedKeys);
        // Always play the note when clicked (for better user feedback)
        if (pianoReady) {
            try {
                await playPianoNote(note, "8n", 0.7);
            }
            catch (error) {
                console.error('Error playing piano note:', error);
            }
        }
        setSelectedKeys(prev => {
            const alreadySelectedIndex = prev.findIndex(key => key === noteWithIndex);
            if (alreadySelectedIndex >= 0) {
                return prev.filter((_, idx) => idx !== alreadySelectedIndex);
            }
            else {
                return [...prev, noteWithIndex];
            }
        });
    };
    const playChordSound = async (chord) => {
        if (pianoReady) {
            try {
                const notes = chord.keys.map(key => {
                    const note = key.split('-')[0];
                    return note.replace('#', 's'); // Convert # to s for consistency
                });
                await playPianoChord(notes, "4n", 0.6);
            }
            catch (error) {
                console.error('Error playing chord sound:', error);
            }
        }
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
            }
            else {
                const newChord = { keys: normalizedKeys, selected: true };
                setChordProgression(prev => [...prev, newChord]);
            }
            setSelectedKeys([]);
        }
    };
    const handleDeleteChord = (index) => {
        setChordProgression(prev => prev.filter((_, i) => i !== index));
    };
    const handleCancelEdit = () => {
        setEditingChordIndex(null);
        setSelectedKeys([]);
    };
    const isNoteSelected = (note, index) => {
        const normalized = normalizeNote(note);
        const noteWithIndex = `${normalized}-${index}`;
        return selectedKeys.includes(noteWithIndex);
    };
    const nextTutorialStep = () => {
        if (currentTutorialStep < tutorialSteps.length - 1) {
            setCurrentTutorialStep(prev => prev + 1);
        }
        else {
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
        stopAllNotes();
    };
    const handlePlayPause = () => {
        if (isPlaying) {
            stopPlayback();
        }
        else {
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
    const MiniPiano = ({ chord }) => {
        const chordNotes = chord.keys.map(k => {
            const note = k.split('-')[0];
            return note.replace('s', '#');
        });
        return (_jsxs("div", { className: "relative h-10 w-full", children: [_jsx("div", { className: "flex h-full w-full", children: whiteKeys.map((note, idx) => (_jsx("div", { className: `flex-1 h-full ${chordNotes.includes(note) ? "bg-emerald-500" : "bg-white"} border border-gray-600 rounded-b-sm relative z-10` }, `mini-white-${idx}`))) }), _jsx("div", { className: "absolute top-0 left-0 right-0 h-3/5", children: whiteKeys.map((_, idx) => {
                        if (!hasBlackKeyAfter[idx])
                            return null;
                        const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                        const blackKeyIdx = [0, 1, 3, 4, 5].indexOf(idx);
                        if (blackKeyIdx === -1)
                            return null;
                        const blackNote = blackKeyNames[blackKeyIdx];
                        const isSelected = chordNotes.includes(blackNote);
                        const position = (idx + 1) / whiteKeys.length;
                        return (_jsx("div", { className: `absolute h-full ${isSelected ? "bg-emerald-500" : "bg-black"} z-20 w-4/25 rounded-b-sm border-x border-gray-600 box-border`, style: { left: `calc(${position * 100}% - 9%)` } }, `mini-black-${idx}`));
                    }) })] }));
    };
    useEffect(() => {
        return () => {
            if (playbackIntervalRef.current !== null) {
                clearInterval(playbackIntervalRef.current);
            }
        };
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("div", { className: "relative flex justify-center p-5 pt-8 text-white", children: [showTutorial && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center", children: _jsxs("div", { className: "bg-gray-800 rounded-lg p-8 max-w-lg w-full relative", children: [_jsx("button", { onClick: () => setShowTutorial(false), className: "absolute top-3 right-3 text-gray-400 hover:text-white", children: _jsx(FaTimes, {}) }), _jsx("div", { className: "text-emerald-500 text-4xl mb-4", children: _jsx(FaLightbulb, {}) }), _jsx("h2", { className: "text-2xl font-bold mb-2 text-emerald-500", children: tutorialSteps[currentTutorialStep].title }), _jsx("p", { className: "mb-6 text-gray-300", children: tutorialSteps[currentTutorialStep].content }), _jsxs("div", { className: "flex justify-between", children: [_jsxs("button", { onClick: prevTutorialStep, className: `flex items-center ${currentTutorialStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-emerald-500'}`, disabled: currentTutorialStep === 0, children: [_jsx(FaArrowLeft, { className: "mr-2" }), " Previous"] }), _jsxs("button", { onClick: nextTutorialStep, className: "flex items-center text-emerald-500 hover:text-emerald-400", children: [currentTutorialStep === tutorialSteps.length - 1 ? 'End Tutorial' : 'Next', currentTutorialStep < tutorialSteps.length - 1 && _jsx(FaArrowRight, { className: "ml-2" })] })] })] }) })), _jsx("button", { onClick: reopenTutorial, className: "fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-30", children: _jsx(FaQuestion, {}) }), _jsxs("div", { className: "w-full max-w-4xl flex flex-col gap-5", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-emerald-500 text-2xl font-bold", children: "Chordia Demo" }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: handlePlayPause, className: `py-2 px-4 rounded-md ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-black font-medium`, children: isPlaying ? _jsxs(_Fragment, { children: [_jsx(FaPause, { className: "inline mr-2" }), " Stop"] }) : _jsxs(_Fragment, { children: [_jsx(FaPlay, { className: "inline mr-2" }), " Play Progression"] }) }), _jsx("button", { onClick: handleDemoFinished, className: "py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium", children: "Try Full Version" })] })] }), _jsx("div", { className: "bg-gray-800 rounded-lg p-5", children: _jsx("input", { type: "text", placeholder: "Enter Song Title", value: songTitle, onChange: (e) => setSongTitle(e.target.value), className: "w-full py-3 px-4 bg-gray-700 border-none rounded-md text-white text-base" }) }), _jsx("div", { className: `bg-gray-800 rounded-lg p-5 ${highlightArea === 'song-parameters' ? 'ring-4 ring-emerald-500' : ''}`, id: "song-parameters", children: _jsxs("div", { className: "mb-4", children: [_jsx("span", { className: "text-emerald-500 text-base font-medium block mb-3", children: "Song Parameters" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "key-select", className: "block mb-2 text-gray-300 text-sm", children: "Key" }), _jsx("select", { id: "key-select", value: key, onChange: (e) => setKey(e.target.value), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer text-sm", children: [
                                                                "C Major", "G Major", "D Major", "A Major", "E Major", "B Major",
                                                                "F# Major", "C# Major", "F Major", "Bb Major", "Eb Major", "Ab Major",
                                                                "Db Major", "Gb Major", "Cb Major",
                                                                "A Minor", "E Minor", "B Minor", "F# Minor", "C# Minor", "G# Minor",
                                                                "D# Minor", "A# Minor", "D Minor", "G Minor", "C Minor", "F Minor",
                                                                "Bb Minor", "Eb Minor", "Ab Minor"
                                                            ].map((keyName) => (_jsx("option", { value: keyName, children: keyName }, keyName))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "time-select", className: "block mb-2 text-gray-300 text-sm", children: "Time Signature" }), _jsx("select", { id: "time-select", value: timeSignature, onChange: (e) => setTimeSignature(e.target.value), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer text-sm", children: ["4/4", "3/4", "2/4", "6/8", "9/8", "12/8", "5/4", "7/8"].map((time) => (_jsx("option", { value: time, children: time }, time))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "tempo-input", className: "block mb-2 text-gray-300 text-sm", children: "Tempo (BPM)" }), _jsx("div", { className: "flex items-center", children: _jsx("input", { id: "tempo-input", type: "number", min: "40", max: "240", value: tempo, onChange: (e) => setTempo(Number(e.target.value)), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 text-sm" }) })] })] })] }) }), _jsxs("div", { className: `bg-gray-800 rounded-lg p-5 ${highlightArea === 'piano-interface' ? 'ring-4 ring-emerald-500' : ''}`, id: "piano-interface", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("span", { className: "text-emerald-500 text-base font-medium", children: "Select Chords" }), _jsxs("div", { className: "flex items-center gap-2.5 text-gray-300", children: [_jsx("span", { children: "Octaves:" }), _jsx("select", { value: octave, onChange: (e) => handleOctaveChange(Number(e.target.value)), className: "bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer", children: [1, 2].map((o) => (_jsx("option", { value: o, children: o }, o))) })] })] }), _jsxs("div", { className: "flex flex-col justify-center my-5 overflow-hidden", children: [_jsxs("div", { className: "md:hidden flex flex-col gap-4", children: [_jsxs("div", { className: "relative flex h-24 sm:h-28 mx-auto", style: { width: `calc(100% - 20px)` }, children: [whiteKeys.map((note, index) => {
                                                                const isSelected = isNoteSelected(note, index);
                                                                return (_jsx("div", { onClick: () => handleKeyClick(note, index), className: `flex-1 h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`, children: _jsx("div", { className: `${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full text-[10px] sm:text-xs`, children: note }) }, `white-${index}`));
                                                            }), whiteKeys.map((_, keyIndex) => {
                                                                if (!hasBlackKeyAfter[keyIndex])
                                                                    return null;
                                                                const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                                                                const blackKeyIndex = [0, 1, 3, 4, 5].indexOf(keyIndex);
                                                                const note = blackKeyNames[blackKeyIndex];
                                                                const isSelected = isNoteSelected(note, keyIndex);
                                                                return (_jsx("div", { onClick: () => handleKeyClick(note, keyIndex), className: `absolute h-[60%] sm:h-[70%] ${isSelected ? 'bg-emerald-500' : 'bg-black'} z-20 w-[8%] sm:w-[10%] rounded-b-md cursor-pointer transition-colors`, style: { left: `calc(${(keyIndex + 1) * 100 / 7}% - 4%)` }, children: _jsx("div", { className: "text-white text-center absolute bottom-1 w-full text-[8px] sm:text-[10px]", children: note }) }, `black-${keyIndex}`));
                                                            })] }), octave === 2 && (_jsxs("div", { className: "relative flex h-24 sm:h-28 mx-auto", style: { width: `calc(100% - 20px)` }, children: [whiteKeys.map((note, index) => {
                                                                const actualIndex = index + 7;
                                                                const isSelected = isNoteSelected(note, actualIndex);
                                                                return (_jsx("div", { onClick: () => handleKeyClick(note, actualIndex), className: `flex-1 h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`, children: _jsx("div", { className: `${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full text-[10px] sm:text-xs`, children: note }) }, `white-${actualIndex}`));
                                                            }), whiteKeys.map((_, keyIndex) => {
                                                                if (!hasBlackKeyAfter[keyIndex])
                                                                    return null;
                                                                const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
                                                                const blackKeyIndex = [0, 1, 3, 4, 5].indexOf(keyIndex);
                                                                const note = blackKeyNames[blackKeyIndex];
                                                                const actualIndex = keyIndex + 10;
                                                                const isSelected = isNoteSelected(note, actualIndex);
                                                                return (_jsx("div", { onClick: () => handleKeyClick(note, actualIndex), className: `absolute h-[60%] sm:h-[70%] ${isSelected ? 'bg-emerald-500' : 'bg-black'} z-20 w-[8%] sm:w-[10%] rounded-b-md cursor-pointer transition-colors`, style: { left: `calc(${(keyIndex + 1) * 100 / 7}% - 4%)` }, children: _jsx("div", { className: "text-white text-center absolute bottom-1 w-full text-[8px] sm:text-[10px]", children: note }) }, `black-${actualIndex}`));
                                                            })] })), _jsxs("div", { className: "flex justify-center mt-3", id: "save-chord", children: [_jsxs("button", { onClick: handleSaveChord, className: `bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center ${highlightArea === 'save-chord' ? 'ring-4 ring-blue-400' : ''}`, children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z", clipRule: "evenodd" }) }), editingChordIndex !== null ? "Update Chord" : "Save Chord"] }), editingChordIndex !== null && (_jsx("button", { onClick: handleCancelEdit, className: "ml-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors duration-200", children: "Cancel" }))] })] }), _jsxs("div", { className: "hidden md:flex flex-col justify-center mx-auto overflow-x-auto md:overflow-visible", children: [_jsxs("div", { className: "relative flex h-36", style: { width: octave === 1 ? `${54 * 7}px` : `${54 * 7 * octave}px` }, children: [Array(octave)
                                                                .fill(whiteKeys)
                                                                .flat()
                                                                .map((note, index) => {
                                                                const isSelected = isNoteSelected(note, index);
                                                                return (_jsx("div", { onClick: () => handleKeyClick(note, index), className: `w-[54px] h-full ${isSelected ? 'bg-emerald-500' : 'bg-white'} ${index === 0 ? '' : 'border-l border-gray-600'} rounded-b-md relative z-10 cursor-pointer transition-colors`, children: _jsx("div", { className: `${isSelected ? 'text-white' : 'text-black'} text-center absolute bottom-1 w-full`, children: note }) }, `white-${index}`));
                                                            }), Array(octave)
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
                                                                return (_jsx("div", { onClick: () => handleKeyClick(note, octaveOffset * 10 + actualKeyIndex), className: `w-8 h-[90px] ${isSelected ? 'bg-emerald-500' : 'bg-black'} absolute top-0 z-20 rounded-b-md cursor-pointer transition-colors`, style: { left: `${position * 54 + 36}px` }, children: _jsx("div", { className: "text-white text-center absolute bottom-1 w-full text-xs", children: note }) }, `black-${octaveIndex}`));
                                                            })] }), _jsxs("div", { className: "flex justify-center mt-4", id: "save-chord", children: [_jsxs("button", { onClick: handleSaveChord, className: `bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-8 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center ${highlightArea === 'save-chord' ? 'ring-4 ring-blue-400' : ''}`, children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z", clipRule: "evenodd" }) }), editingChordIndex !== null ? "Update Chord" : "Save Chord"] }), editingChordIndex !== null && (_jsx("button", { onClick: handleCancelEdit, className: "ml-3 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md shadow-md transition-colors duration-200", children: "Cancel" }))] })] })] })] }), _jsxs("div", { className: `bg-gray-800 rounded-lg p-5 ${highlightArea === 'chord-progression' ? 'ring-4 ring-emerald-500' : ''}`, id: "chord-progression", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("span", { className: "text-emerald-500 text-base font-medium", children: "Chord Progression" }) }), chordProgression.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5", children: chordProgression.map((chord, index) => (_jsxs("div", { className: "bg-gray-700 rounded-md p-2 text-center", children: [_jsx(MiniPiano, { chord: chord }), _jsxs("div", { className: "flex justify-between mt-2 gap-1.5", children: [_jsx("button", { onClick: () => handleEditChord(index), className: "bg-emerald-500 text-white border-none rounded-md py-1 px-2 cursor-pointer flex-1 text-xs", children: "Edit" }), _jsx("button", { onClick: () => handleDeleteChord(index), className: "bg-red-500 text-white border-none rounded-md py-1 px-2 cursor-pointer flex-1 text-xs", children: "Delete" })] })] }, index))) })) : (_jsx("div", { className: "text-center italic text-gray-400 py-6", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx(FaMusic, { className: "text-3xl mb-3 text-emerald-500 opacity-70" }), _jsx("p", { children: "No chords created yet. Use the piano above to select notes and create a chord." })] }) }))] }), _jsxs("div", { className: "bg-gray-800 rounded-lg p-5 mt-4", children: [_jsx("h3", { className: "text-emerald-500 text-lg font-medium mb-3", children: "Quick Tips" }), _jsxs("ul", { className: "list-disc pl-5 text-gray-300 space-y-2", children: [_jsx("li", { children: "Click on piano keys to select notes for your chord" }), _jsx("li", { children: "Click \"Save Chord\" to add the chord to your progression" }), _jsx("li", { children: "You can edit or delete any chord in your progression" }), _jsx("li", { children: "Use the Play button to hear your chord progression" }), _jsx("li", { children: "In the full version, you can save your songs and access them anytime" })] })] }), _jsx(Link, { to: "/register", className: "bg-emerald-500 hover:bg-emerald-600 text-black border-none rounded-lg py-4 px-4 text-base font-semibold cursor-pointer w-full shadow-md transition-all duration-200 flex items-center justify-center", children: "Sign Up for Full Access" })] })] })] }));
};
export default DemoPage;
