import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Swal from 'sweetalert2';
import aiChordService from '../services/aiChordService';
export default function AIChordGenerator({ onChordsGenerated, isOpen, onClose }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        style: 'pop',
        mood: 'happy',
        key: 'C',
        length: 4,
        complexity: 'medium',
        description: ''
    });
    const styles = [
        'pop', 'rock', 'jazz', 'blues', 'folk', 'country', 'electronic', 'classical', 'reggae', 'funk'
    ];
    const moods = [
        'happy', 'sad', 'melancholic', 'energetic', 'calm', 'dramatic', 'romantic', 'mysterious', 'uplifting', 'nostalgic'
    ];
    const keys = [
        'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
        'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm'
    ];
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleGenerate = async () => {
        if (!formData.description.trim()) {
            Swal.fire({
                title: 'Description Required',
                text: 'Please describe how you want your chord progression to sound',
                icon: 'warning',
                confirmButtonColor: "var(--accent-green)",
                background: "var(--background-darker)",
                color: "var(--text-secondary)",
            });
            return;
        }
        setIsGenerating(true);
        try {
            const request = {
                style: formData.style,
                mood: formData.mood,
                key: formData.key,
                length: formData.length,
                complexity: formData.complexity,
                description: formData.description
            };
            const response = await aiChordService.generateChordProgression(request);
            const chordKeys = aiChordService.convertChordsToPianoKeys(response.chords);
            const chords = chordKeys.map(keys => ({
                keys,
                selected: true
            }));
            Swal.fire({
                title: 'Chord Progression Generated!',
                html: `
          <div class="text-left">
            <p class="mb-3"><strong>Generated chords:</strong> ${response.chords.join(' - ')}</p>
            <p class="mb-3"><strong>Explanation:</strong> ${response.explanation}</p>
            <p class="text-sm text-gray-400">The chords have been added to your progression.</p>
          </div>
        `,
                icon: 'success',
                confirmButtonColor: "var(--accent-green)",
                background: "var(--background-darker)",
                color: "var(--text-secondary)",
            });
            onChordsGenerated(chords);
            onClose();
        }
        catch (error) {
            console.error('Error generating chords:', error);
            Swal.fire({
                title: 'Generation Failed',
                text: 'There was an error generating your chord progression. Please try again.',
                icon: 'error',
                confirmButtonColor: "var(--accent-green)",
                background: "var(--background-darker)",
                color: "var(--text-secondary)",
            });
        }
        finally {
            setIsGenerating(false);
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "AI Chord Generator" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white text-2xl font-bold", children: "\u00D7" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "style-select", className: "block text-gray-300 text-sm font-medium mb-2", children: "Musical Style" }), _jsx("select", { id: "style-select", value: formData.style, onChange: (e) => handleInputChange('style', e.target.value), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer", children: styles.map(style => (_jsx("option", { value: style, children: style.charAt(0).toUpperCase() + style.slice(1) }, style))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mood-select", className: "block text-gray-300 text-sm font-medium mb-2", children: "Mood" }), _jsx("select", { id: "mood-select", value: formData.mood, onChange: (e) => handleInputChange('mood', e.target.value), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer", children: moods.map(mood => (_jsx("option", { value: mood, children: mood.charAt(0).toUpperCase() + mood.slice(1) }, mood))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "key-select", className: "block text-gray-300 text-sm font-medium mb-2", children: "Key" }), _jsx("select", { id: "key-select", value: formData.key, onChange: (e) => handleInputChange('key', e.target.value), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer", children: keys.map(key => (_jsx("option", { value: key, children: key }, key))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "length-select", className: "block text-gray-300 text-sm font-medium mb-2", children: "Number of Chords" }), _jsx("select", { id: "length-select", value: formData.length, onChange: (e) => handleInputChange('length', Number(e.target.value)), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer", children: [3, 4, 5, 6, 7, 8].map(length => (_jsx("option", { value: length, children: length }, length))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "complexity-select", className: "block text-gray-300 text-sm font-medium mb-2", children: "Complexity" }), _jsxs("select", { id: "complexity-select", value: formData.complexity, onChange: (e) => handleInputChange('complexity', e.target.value), className: "w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer", children: [_jsx("option", { value: "simple", children: "Simple" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "complex", children: "Complex" })] })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description-textarea", className: "block text-gray-300 text-sm font-medium mb-2", children: "Describe Your Vision *" }), _jsx("textarea", { id: "description-textarea", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: "Describe how you want your chord progression to sound. For example: 'A sad progression that builds tension and resolves beautifully' or 'An energetic rock progression with a strong driving feel'", className: "w-full bg-gray-700 text-white border-none rounded-md py-3 px-3 resize-none", rows: 4 })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { onClick: handleGenerate, disabled: isGenerating || !formData.description.trim(), className: `flex-1 py-3 px-6 rounded-md font-medium text-white transition-colors ${isGenerating || !formData.description.trim()
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-emerald-500 hover:bg-emerald-600'}`, children: isGenerating ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Generating..."] })) : ('Generate Progression') }), _jsx("button", { onClick: onClose, className: "px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors", children: "Cancel" })] })] })] }) }));
}
