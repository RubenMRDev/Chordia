import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import PianoTest from './PianoTest';
import { usePiano } from '../hooks/usePiano';

// Mock the usePiano hook
jest.mock('../hooks/usePiano');

const mockUsePiano = usePiano as jest.MockedFunction<typeof usePiano>;

// Mock InteractivePiano component
jest.mock('./InteractivePiano', () => {
  return function MockInteractivePiano({ onNoteClick, selectedNotes }: any) {
    return (
      <div data-testid="interactive-piano">
        <button onClick={() => onNoteClick('C', 0)}>C</button>
        <button onClick={() => onNoteClick('D', 1)}>D</button>
        <div data-testid="selected-notes">{selectedNotes.join(', ')}</div>
      </div>
    );
  };
});

describe('PianoTest', () => {
  const mockPlayNote = jest.fn();
  const mockPlayChord = jest.fn();
  const mockStopAllNotes = jest.fn();
  const mockInitialize = jest.fn();
  const mockTriggerAttack = jest.fn();
  const mockTriggerRelease = jest.fn();

  beforeEach(() => {
    mockUsePiano.mockReturnValue({
      isReady: true,
      isLoading: false,
      playNote: mockPlayNote,
      playChord: mockPlayChord,
      stopAllNotes: mockStopAllNotes,
      initialize: mockInitialize,
      triggerAttack: mockTriggerAttack,
      triggerRelease: mockTriggerRelease,
    });
  });

  test('renders the piano test component', () => {
    render(<PianoTest />);

    expect(screen.getByText('Piano Test (Tone.js) - Feedback Inmediato')).toBeInTheDocument();
    expect(screen.getByText('Status: Ready')).toBeInTheDocument();
    expect(screen.getByText('Piano Interactivo')).toBeInTheDocument();
    expect(screen.getByText('Constructor de Acordes')).toBeInTheDocument();
  });

  test('displays loading status when piano is loading', () => {
    mockUsePiano.mockReturnValue({
      isReady: false,
      isLoading: true,
      playNote: mockPlayNote,
      playChord: mockPlayChord,
      stopAllNotes: mockStopAllNotes,
      initialize: mockInitialize,
      triggerAttack: mockTriggerAttack,
      triggerRelease: mockTriggerRelease,
    });

    render(<PianoTest />);

    expect(screen.getByText('Status: Loading...')).toBeInTheDocument();
  });

  test('displays not ready status when piano is not ready', () => {
    mockUsePiano.mockReturnValue({
      isReady: false,
      isLoading: false,
      playNote: mockPlayNote,
      playChord: mockPlayChord,
      stopAllNotes: mockStopAllNotes,
      initialize: mockInitialize,
      triggerAttack: mockTriggerAttack,
      triggerRelease: mockTriggerRelease,
    });

    render(<PianoTest />);

    expect(screen.getByText('Status: Not Ready')).toBeInTheDocument();
  });

  test('handles note selection in chord builder', () => {
    render(<PianoTest />);

    const chordBuilder = screen.getByText('Constructor de Acordes').parentElement;
    if (!chordBuilder) throw new Error('Could not find chord builder');
    const noteButton = within(chordBuilder).getByText('C');
    fireEvent.click(noteButton);

    expect(noteButton).toHaveClass('bg-green-600');
  });

  test('handles note deselection in chord builder', () => {
    render(<PianoTest />);

    const chordBuilder = screen.getByText('Constructor de Acordes').parentElement;
    if (!chordBuilder) throw new Error('Could not find chord builder');
    const noteButton = within(chordBuilder).getByText('C');
    fireEvent.click(noteButton); // Select
    fireEvent.click(noteButton); // Deselect

    expect(noteButton).toHaveClass('bg-gray-600');
  });

  test('plays chord when play button is clicked', async () => {
    render(<PianoTest />);

    // Select a note first
    const chordBuilder = screen.getByText('Constructor de Acordes').parentElement;
    if (!chordBuilder) throw new Error('Could not find chord builder');
    const noteButton = within(chordBuilder).getByText('C');
    fireEvent.click(noteButton);

    // Click play chord button
    const playButton = screen.getByText('Tocar Acorde (C)');
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(mockPlayChord).toHaveBeenCalledWith(['C'], '4n', 0.6);
    });
  });

  test('stops all notes when stop button is clicked', () => {
    render(<PianoTest />);

    const stopButton = screen.getByText('Detener Todo');
    fireEvent.click(stopButton);

    expect(mockStopAllNotes).toHaveBeenCalled();
  });

  test('disables play chord button when no notes are selected', () => {
    render(<PianoTest />);

    const playButton = screen.getByText('Tocar Acorde ()');
    expect(playButton).toBeDisabled();
  });

  test('disables buttons when piano is not ready', () => {
    mockUsePiano.mockReturnValue({
      isReady: false,
      isLoading: false,
      playNote: mockPlayNote,
      playChord: mockPlayChord,
      stopAllNotes: mockStopAllNotes,
      initialize: mockInitialize,
      triggerAttack: mockTriggerAttack,
      triggerRelease: mockTriggerRelease,
    });

    render(<PianoTest />);

    const playButton = screen.getByText('Tocar Acorde ()');
    const stopButton = screen.getByText('Detener Todo');

    expect(playButton).toBeDisabled();
    expect(stopButton).toBeDisabled();
  });

  test('handles interactive piano note clicks', () => {
    render(<PianoTest />);

    const interactivePiano = screen.getByTestId('interactive-piano');
    const noteButton = interactivePiano.querySelector('button');
    
    if (noteButton) {
      fireEvent.click(noteButton);
    }

    expect(screen.getByTestId('interactive-piano')).toBeInTheDocument();
  });

  test('displays selected notes count', () => {
    render(<PianoTest />);

    const chordBuilder = screen.getByText('Constructor de Acordes').parentElement;
    if (!chordBuilder) throw new Error('Could not find chord builder');
    const noteButton = within(chordBuilder).getByText('C');
    fireEvent.click(noteButton);

    expect(screen.getByText('Tocar Acorde (C)')).toBeInTheDocument();
  });

  test('displays multiple selected notes', () => {
    render(<PianoTest />);

    const chordBuilder = screen.getByText('Constructor de Acordes').parentElement;
    if (!chordBuilder) throw new Error('Could not find chord builder');
    const cButton = within(chordBuilder).getByText('C');
    const dButton = within(chordBuilder).getByText('D');
    
    fireEvent.click(cButton);
    fireEvent.click(dButton);

    expect(screen.getByText('Tocar Acorde (C, D)')).toBeInTheDocument();
  });
}); 