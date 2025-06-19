import React, { useState } from 'react';
import Swal from 'sweetalert2';
import aiChordService, { AIChordRequest, AIChordResponse } from '../services/aiChordService';

interface ChordType {
  keys: string[];
  selected: boolean;
}

interface AIChordGeneratorProps {
  onChordsGenerated: (chords: ChordType[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChordGenerator({ onChordsGenerated, isOpen, onClose }: AIChordGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    style: 'pop',
    mood: 'happy',
    key: 'C',
    length: 4,
    complexity: 'medium' as 'simple' | 'medium' | 'complex',
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

  const handleInputChange = (field: string, value: string | number) => {
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
      const request: AIChordRequest = {
        style: formData.style,
        mood: formData.mood,
        key: formData.key,
        length: formData.length,
        complexity: formData.complexity,
        description: formData.description
      };

      const response: AIChordResponse = await aiChordService.generateChordProgression(request);
      
      const chordKeys = aiChordService.convertChordsToPianoKeys(response.chords);
      
      const chords: ChordType[] = chordKeys.map(keys => ({
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

    } catch (error) {
      console.error('Error generating chords:', error);
      Swal.fire({
        title: 'Generation Failed',
        text: 'There was an error generating your chord progression. Please try again.',
        icon: 'error',
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">AI Chord Generator</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Musical Style
            </label>
            <select
              value={formData.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer"
            >
              {styles.map(style => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Mood
            </label>
            <select
              value={formData.mood}
              onChange={(e) => handleInputChange('mood', e.target.value)}
              className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer"
            >
              {moods.map(mood => (
                <option key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Key
            </label>
            <select
              value={formData.key}
              onChange={(e) => handleInputChange('key', e.target.value)}
              className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer"
            >
              {keys.map(key => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Number of Chords
              </label>
              <select
                value={formData.length}
                onChange={(e) => handleInputChange('length', Number(e.target.value))}
                className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer"
              >
                {[3, 4, 5, 6, 7, 8].map(length => (
                  <option key={length} value={length}>
                    {length}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Complexity
              </label>
              <select
                value={formData.complexity}
                onChange={(e) => handleInputChange('complexity', e.target.value as 'simple' | 'medium' | 'complex')}
                className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-3 cursor-pointer"
              >
                <option value="simple">Simple</option>
                <option value="medium">Medium</option>
                <option value="complex">Complex</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Describe Your Vision *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe how you want your chord progression to sound. For example: 'A sad progression that builds tension and resolves beautifully' or 'An energetic rock progression with a strong driving feel'"
              className="w-full bg-gray-700 text-white border-none rounded-md py-3 px-3 resize-none"
              rows={4}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.description.trim()}
              className={`flex-1 py-3 px-6 rounded-md font-medium text-white transition-colors ${
                isGenerating || !formData.description.trim()
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate Progression'
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 