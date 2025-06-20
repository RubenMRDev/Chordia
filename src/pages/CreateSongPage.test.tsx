import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateSongPage from './CreateSongPage';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as songApi from '../api/songApi';

jest.mock('../hooks/usePiano', () => ({
  usePiano: () => ({})
}));
jest.mock('../api/songApi', () => ({
  createSong: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const mockAuth = {
  currentUser: { uid: 'test', displayName: 'Test User' },
  userProfile: { displayName: 'Test User', bio: '', location: '', website: '', socialLinks: {} },
  updateProfileInContext: jest.fn(),
};

const renderWithAuth = (ui) =>
  render(
    <AuthContext.Provider value={mockAuth}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('CreateSongPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(songApi, 'createSong').mockResolvedValue('1');
  });

  it('renders and allows title change', () => {
    renderWithAuth(<CreateSongPage />);
    const input = screen.getByPlaceholderText(/song title/i);
    fireEvent.change(input, { target: { value: 'Test Song' } });
    expect(input).toHaveValue('Test Song');
  });

  it('can add and save a chord', async () => {
    renderWithAuth(<CreateSongPage />);
    // Simula click en una tecla
    const pianoKeys = screen.getAllByText('C');
    fireEvent.click(pianoKeys[0]);
    // Click en el primer botón Save Chord
    const saveChordButtons = screen.getAllByRole('button', { name: /save chord/i });
    fireEvent.click(saveChordButtons[0]);
    expect(screen.getByText(/Chord Progression/i)).toBeInTheDocument();
  });

  it('muestra alerta si se intenta guardar sin título', () => {
    renderWithAuth(<CreateSongPage />);
    const saveBtn = screen.getByText(/save song/i);
    fireEvent.click(saveBtn);
    expect(require('sweetalert2').fire).toHaveBeenCalledWith(expect.objectContaining({ title: expect.stringMatching(/missing title/i) }));
  });
}); 