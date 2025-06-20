import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIChordGenerator from './AIChordGenerator';
import aiChordService from '../services/aiChordService';
import Swal from 'sweetalert2';

// Mock the aiChordService
jest.mock('../services/aiChordService');

const mockAiChordService = aiChordService as jest.Mocked<typeof aiChordService>;

// Mock SweetAlert2
jest.mock('sweetalert2');

const mockSwal = Swal as jest.Mocked<typeof Swal>;

describe('AIChordGenerator', () => {
  const mockOnChordsGenerated = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockAiChordService.generateChordProgression.mockResolvedValue({
      chords: ['C', 'Am', 'F', 'G'],
      progression: ['C', 'Am', 'F', 'G'],
      explanation: 'A classic pop progression'
    });
    mockAiChordService.convertChordsToPianoKeys.mockReturnValue([
      ['C', 'E', 'G'],
      ['A', 'C', 'E'],
      ['F', 'A', 'C'],
      ['G', 'B', 'D']
    ]);
  });

  test('renders the AI chord generator modal', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('AI Chord Generator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Progression' })).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('AI Chord Generator')).not.toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const descriptionInput = screen.getByLabelText('Describe Your Vision *');
    fireEvent.change(descriptionInput, { target: { value: 'Happy pop song' } });

    expect(descriptionInput).toHaveValue('Happy pop song');
  });

  test('handles style selection', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const styleSelect = screen.getByLabelText('Musical Style');
    fireEvent.change(styleSelect, { target: { value: 'jazz' } });

    expect(styleSelect).toHaveValue('jazz');
  });

  test('handles mood selection', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const moodSelect = screen.getByLabelText('Mood');
    fireEvent.change(moodSelect, { target: { value: 'sad' } });

    expect(moodSelect).toHaveValue('sad');
  });

  test('handles key selection', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const keySelect = screen.getByLabelText('Key');
    fireEvent.change(keySelect, { target: { value: 'G' } });

    expect(keySelect).toHaveValue('G');
  });

  test('handles length selection', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const lengthSelect = screen.getByLabelText('Number of Chords');
    fireEvent.change(lengthSelect, { target: { value: '6' } });

    expect(lengthSelect).toHaveValue('6');
  });

  test('handles complexity selection', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const complexitySelect = screen.getByLabelText('Complexity');
    fireEvent.change(complexitySelect, { target: { value: 'complex' } });

    expect(complexitySelect).toHaveValue('complex');
  });

  test('disables generate button when description is empty and enables it when filled', async () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const generateButton = screen.getByRole('button', { name: /Generate/i });
    expect(generateButton).toBeDisabled();

    const descriptionInput = screen.getByLabelText('Describe Your Vision *');
    fireEvent.change(descriptionInput, { target: { value: 'A test description' } });

    expect(generateButton).not.toBeDisabled();

    fireEvent.change(descriptionInput, { target: { value: ' ' } });
    expect(generateButton).toBeDisabled();
  });

  test('generates chord progression successfully', async () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Fill in description
    const descriptionInput = screen.getByLabelText('Describe Your Vision *');
    fireEvent.change(descriptionInput, { target: { value: 'Happy pop song' } });

    // Click generate button
    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockAiChordService.generateChordProgression).toHaveBeenCalledWith({
        style: 'pop',
        mood: 'happy',
        key: 'C',
        length: 4,
        complexity: 'medium',
        description: 'Happy pop song'
      });
    });

    await waitFor(() => {
      expect(mockAiChordService.convertChordsToPianoKeys).toHaveBeenCalledWith(['C', 'Am', 'F', 'G']);
    });

    await waitFor(() => {
      expect(mockSwal.fire).toHaveBeenCalledWith({
        title: 'Chord Progression Generated!',
        html: `
          <div class="text-left">
            <p class="mb-3"><strong>Generated chords:</strong> C - Am - F - G</p>
            <p class="mb-3"><strong>Explanation:</strong> A classic pop progression</p>
            <p class="text-sm text-gray-400">The chords have been added to your progression.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
    });

    await waitFor(() => {
      expect(mockOnChordsGenerated).toHaveBeenCalledWith([
        { keys: ['C', 'E', 'G'], selected: true },
        { keys: ['A', 'C', 'E'], selected: true },
        { keys: ['F', 'A', 'C'], selected: true },
        { keys: ['G', 'B', 'D'], selected: true }
      ]);
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('handles generation error', async () => {
    const error = new Error('API Error');
    mockAiChordService.generateChordProgression.mockRejectedValue(error);

    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Fill in description
    const descriptionInput = screen.getByLabelText('Describe Your Vision *');
    fireEvent.change(descriptionInput, { target: { value: 'Happy pop song' } });

    // Click generate button
    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockSwal.fire).toHaveBeenCalledWith({
        title: 'Generation Failed',
        text: 'There was an error generating your chord progression. Please try again.',
        icon: 'error',
        confirmButtonColor: "var(--accent-green)",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
    });
  });

  test('closes modal when close button is clicked', () => {
    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows loading state during generation', async () => {
    // Make the API call take some time
    mockAiChordService.generateChordProgression.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ chords: [], progression: [], explanation: '' }), 100))
    );

    render(
      <AIChordGenerator
        onChordsGenerated={mockOnChordsGenerated}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Fill in description
    const descriptionInput = screen.getByLabelText('Describe Your Vision *');
    fireEvent.change(descriptionInput, { target: { value: 'Happy pop song' } });

    // Click generate button
    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);

    // Check that button shows loading state
    await waitFor(() => {
      expect(generateButton).toBeDisabled();
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });
  });
}); 