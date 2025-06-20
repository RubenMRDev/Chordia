import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import InteractivePiano from './InteractivePiano';

jest.mock('../hooks/usePiano', () => ({
  usePiano: () => ({
    isReady: true,
    isLoading: false,
    playNote: jest.fn(() => Promise.resolve()),
    playChord: jest.fn(() => Promise.resolve()),
    stopAllNotes: jest.fn(),
    initialize: jest.fn(() => Promise.resolve()),
    triggerAttack: jest.fn(),
    triggerRelease: jest.fn(),
  })
}));

describe('InteractivePiano', () => {
  it('calls onNoteClick for white key (C)', async () => {
    const onNoteClick = jest.fn();
    const { getByText } = render(<InteractivePiano onNoteClick={onNoteClick} />);
    const label = getByText('C');
    fireEvent.click(label.parentElement!);
    await waitFor(() => {
      expect(onNoteClick).toHaveBeenCalledWith('C', 0);
    });
  });

  it('calls onNoteClick for black key (C#)', async () => {
    const onNoteClick = jest.fn();
    const { getByText } = render(<InteractivePiano onNoteClick={onNoteClick} />);
    const label = getByText('C#');
    fireEvent.click(label.parentElement!);
    await waitFor(() => {
      expect(onNoteClick).toHaveBeenCalledWith('C#', 0);
    });
  });

  it('calls onNoteClick when a white key (E) is clicked', async () => {
    const onNoteClick = jest.fn();
    const { getByText } = render(<InteractivePiano onNoteClick={onNoteClick} />);
    const label = getByText('E');
    fireEvent.click(label.parentElement!);
    await waitFor(() => {
      expect(onNoteClick).toHaveBeenCalledWith('E', 2);
    });
  });

  it('calls onNoteClick when a black key (D#) is clicked', async () => {
    const onNoteClick = jest.fn();
    const { getByText } = render(<InteractivePiano onNoteClick={onNoteClick} />);
    const label = getByText('D#');
    fireEvent.click(label.parentElement!);
    await waitFor(() => {
      expect(onNoteClick).toHaveBeenCalledWith('D#', 1);
    });
  });
}); 