import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { getAllSongs } from '../api/songApi';
import { getDoc } from 'firebase/firestore';
import DiscoverPage from './DiscoverPage';
import { AuthContext } from '../context/AuthContext';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../api/songApi');
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDoc: jest.fn(),
  doc: jest.fn((_db, _collection, id) => ({ id: id, path: `${_collection}/${id}` })),
}));

const mockNavigate = jest.fn();

const mockSongsFromApi = [
  { id: '1', title: 'Song A', userId: 'user1', createdAt: '2023-01-01T12:00:00Z', key: 'C', timeSignature: '4/4', tempo: 120 },
  { id: '2', title: 'Song B', userId: 'user2', createdAt: '2023-01-02T12:00:00Z', key: 'G', timeSignature: '4/4', tempo: 130 },
  { id: '3', title: 'Song C', userId: 'user1', createdAt: '2023-01-03T12:00:00Z', key: 'Am', timeSignature: '3/4', tempo: 90 },
];

const mockUserDocs = {
  user1: {
    exists: () => true,
    data: () => ({ username: 'userone' }),
  },
  user2: {
    exists: () => true,
    data: () => ({ displayName: 'User Two' }),
  },
};

const mockAuthContext = {
    currentUser: { uid: 'test-user' } as any,
    loading: false,
    logout: jest.fn(),
    userProfile: null,
    login: jest.fn(),
    register: jest.fn(),
    updateUserProfile: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithFacebook: jest.fn(),
    error: null,
    setError: jest.fn(),
    updateProfileInContext: jest.fn(),
    refreshUserProfile: jest.fn(),
};

describe('DiscoverPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (getAllSongs as jest.Mock).mockResolvedValue(mockSongsFromApi);
    (getDoc as jest.Mock).mockImplementation((docRef: any) => {
        const userId = docRef.id as keyof typeof mockUserDocs;
        return Promise.resolve(mockUserDocs[userId] || { exists: () => false, data: () => ({}) });
    });
  });

  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore();
  })

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <DiscoverPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  it('should display loading state initially', async () => {
    (getAllSongs as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading songs...')).toBeInTheDocument();
  });

  it('should display a message if no songs are available', async () => {
    (getAllSongs as jest.Mock).mockResolvedValue([]);
    renderComponent();
    expect(await screen.findByText('No hay canciones disponibles en este momento.')).toBeInTheDocument();
  });

  it('should fetch and display songs with user data', async () => {
    renderComponent();
    
    expect(await screen.findByText('Song C')).toBeInTheDocument();
    const useroneElements = await screen.findAllByText('@userone');
    expect(useroneElements).toHaveLength(2);
    expect(screen.getByText('@User Two')).toBeInTheDocument();
  });

  it('should sort songs by recent by default and handle random sorting deterministically', async () => {
    renderComponent();

    // Default: recent
    let songs = await screen.findAllByRole('heading', { level: 3 });
    expect(songs.map(s => s.textContent)).toEqual(['Song C', 'Song B', 'Song A']);

    // Mock Math.random for deterministic shuffle
    const randomValues = [0.8, 0.1, 0.4, 0.9, 0.2, 0.7]; // A sequence for shuffling
    let callCount = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
        return randomValues[callCount++ % randomValues.length];
    });

    // Click Random
    fireEvent.click(screen.getByRole('button', { name: /random/i }));
    
    // Check if re-sorted in the expected deterministic way
    await waitFor(() => {
      songs = screen.getAllByRole('heading', { level: 3 });
      expect(songs.map(s => s.textContent)).toEqual(['Song B', 'Song A', 'Song C']);
    });
  });
  
  it('should navigate to song details page on click', async () => {
    renderComponent();

    const songCard = await screen.findByText('Song C');
    fireEvent.click(songCard.parentElement!.parentElement!);

    expect(mockNavigate).toHaveBeenCalledWith('/song/3');
  });

  it('should navigate to dashboard on link click', async () => {
    renderComponent();

    const dashboardLink = await screen.findByRole('link', { name: /volver al dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });
}); 