import { useState } from 'react';
import { useT } from '@/i18n';
import aiChordService, { AIChordRequest, AIChordResponse } from '../services/aiChordService';
import { openDialog } from '@/ui/dialog';

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
  const { t } = useT();
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
      openDialog({
        title: t('ai.needDescription'),
        text: t('ai.needDescriptionBody'),
        icon: 'warning',
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

      openDialog({
        title: 'Chord Progression Generated!',
        html: `
          <div class="text-left">
            <p class="mb-3"><strong>Generated chords:</strong> ${response.chords.join(' - ')}</p>
            <p class="mb-3"><strong>Explanation:</strong> ${response.explanation}</p>
            <p class="text-sm text-ink-low">{t('ai.added')}</p>
          </div>
        `,
        icon: 'success',
      });

      onChordsGenerated(chords);
      onClose();

    } catch (error) {
      console.error('Error generating chords:', error);
      openDialog({
        title: t('ai.failed'),
        text: t('ai.failedBody'),
        icon: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-ground-2 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{t('ai.generatorTitle')}</h2>
          <button
            onClick={onClose}
            className="text-ink-low hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="style-select" className="block text-ink-mid text-sm font-medium mb-2">
              Musical Style
            </label>
            <select
              id="style-select"
              value={formData.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full bg-ground-3 text-white border-none rounded-md py-2 px-3 cursor-pointer"
            >
              {styles.map(style => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mood-select" className="block text-ink-mid text-sm font-medium mb-2">
              Mood
            </label>
            <select
              id="mood-select"
              value={formData.mood}
              onChange={(e) => handleInputChange('mood', e.target.value)}
              className="w-full bg-ground-3 text-white border-none rounded-md py-2 px-3 cursor-pointer"
            >
              {moods.map(mood => (
                <option key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="key-select" className="block text-ink-mid text-sm font-medium mb-2">
              Key
            </label>
            <select
              id="key-select"
              value={formData.key}
              onChange={(e) => handleInputChange('key', e.target.value)}
              className="w-full bg-ground-3 text-white border-none rounded-md py-2 px-3 cursor-pointer"
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
              <label htmlFor="length-select" className="block text-ink-mid text-sm font-medium mb-2">
                Number of Chords
              </label>
              <select
                id="length-select"
                value={formData.length}
                onChange={(e) => handleInputChange('length', Number(e.target.value))}
                className="w-full bg-ground-3 text-white border-none rounded-md py-2 px-3 cursor-pointer"
              >
                {[3, 4, 5, 6, 7, 8].map(length => (
                  <option key={length} value={length}>
                    {length}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="complexity-select" className="block text-ink-mid text-sm font-medium mb-2">
                Complexity
              </label>
              <select
                id="complexity-select"
                value={formData.complexity}
                onChange={(e) => handleInputChange('complexity', e.target.value as 'simple' | 'medium' | 'complex')}
                className="w-full bg-ground-3 text-white border-none rounded-md py-2 px-3 cursor-pointer"
              >
                <option value="simple">{t('ai.simple')}</option>
                <option value="medium">{t('ai.medium')}</option>
                <option value="complex">{t('ai.complex')}</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description-textarea" className="block text-ink-mid text-sm font-medium mb-2">
              Describe Your Vision *
            </label>
            <textarea
              id="description-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('ai.describePlaceholder')}
              className="w-full bg-ground-3 text-white border-none rounded-md py-3 px-3 resize-none"
              rows={4}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.description.trim()}
              className={`flex-1 py-3 px-6 rounded-md font-medium text-white transition-colors ${
                isGenerating || !formData.description.trim()
                  ? 'bg-ground-4 cursor-not-allowed'
                  : 'bg-hand-right hover:bg-hand-right-deep'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2.5">
                  {/*
                    Three keys lighting in turn, rather than a spinning border:
                    the product already has a language for "working".
                  */}
                  <span aria-hidden className="flex items-end gap-[3px] h-3">
                    {[0, 1, 2].map((step) => (
                      <span
                        key={step}
                        className="w-[3px] h-full rounded-[1px] bg-current sustain"
                        style={{ animationDelay: `${step * 180}ms` }}
                      />
                    ))}
                  </span>
                  {t('ai.generating')}
                </span>
              ) : (
                t('ai.generate')
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-ground-4 hover:bg-ground-3 text-white rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 