import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DemoPage from './DemoPage';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

jest.mock('../hooks/usePiano', () => ({
  usePiano: () => ({
    isReady: true,
    playNote: jest.fn(),
    playChord: jest.fn(),
    stopAllNotes: jest.fn(),
  })
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

describe('DemoPage', () => {
  it('renders and shows tutorial', () => {
    renderWithAuth(<DemoPage />);
    expect(screen.getByText(/Welcome to Chordia Demo/i)).toBeInTheDocument();
  });

  it('can advance and close tutorial', () => {
    renderWithAuth(<DemoPage />);
    // Avanza hasta el último paso
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    }
    // Ahora debe aparecer el botón 'End Tutorial'
    fireEvent.click(screen.getByRole('button', { name: /end tutorial/i }));
    expect(screen.queryByText(/Welcome to Chordia Demo/i)).not.toBeInTheDocument();
  });

  it('can add a chord', () => {
    renderWithAuth(<DemoPage />);
    // Avanza hasta el último paso y cierra el tutorial
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    }
    fireEvent.click(screen.getByRole('button', { name: /end tutorial/i }));
    // Simula click en una tecla
    const pianoKeys = screen.getAllByText('C');
    fireEvent.click(pianoKeys[0]);
    // Click en el primer botón Save Chord
    const saveChordButtons = screen.getAllByRole('button', { name: /save chord/i });
    fireEvent.click(saveChordButtons[0]);
    expect(screen.getAllByText(/Chord Progression/i).length).toBeGreaterThan(0);
  });
}); 