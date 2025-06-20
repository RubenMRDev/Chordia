import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { getAllSongs } from '../api/songApi';
import { getDoc, doc } from 'firebase/firestore';
import DashboardPage from './DashboardPage';
import { AuthContext } from '../context/AuthContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../api/songApi');
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDoc: jest.fn(),
  doc: jest.fn((_db, _collection, id) => ({ id })),
}));
jest.mock('../components/Header', () => () => <header>Mocked Header</header>);

const mockNavigate = jest.fn();

const mockSongsFromApi = [
  { id: '1', title: 'Song A', userId: 'user1', createdAt: '2023-01-01T12:00:00Z' },
  { id: '2', title: 'Song B', userId: 'user2', createdAt: '2023-01-02T12:00:00Z' },
  { id: '3', title: 'Song C', userId: 'user1', createdAt: '2023-01-03T12:00:00Z' },
  { id: '4', title: 'Song D', userId: 'user3', createdAt: '2023-01-04T12:00:00Z' },
];

const mockUserDocs = {
  user1: { exists: () => true, data: () => ({ username: 'userone' }) },
  user2: { exists: () => true, data: () => ({ displayName: 'User Two' }) },
  user3: { exists: () => false, data: () => ({}) },
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

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (getAllSongs as jest.Mock).mockResolvedValue(mockSongsFromApi);
    (getDoc as jest.Mock).mockImplementation((docRef: any) =>
      Promise.resolve(mockUserDocs[docRef.id as keyof typeof mockUserDocs])
    );
    // Mock Math.random to control which songs are selected and their difficulty
    jest.spyOn(Math, 'random').mockReturnValue(0.5); 
  });

  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <DashboardPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  it('renders the main heading and introductory text', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /create music magic with chordia/i })).toBeInTheDocument();
    expect(screen.getByText(/your ultimate platform for chord progression/i)).toBeInTheDocument();
  });

  it('renders navigation buttons to create and browse', () => {
    renderComponent();
    expect(screen.getByRole('link', { name: /create custom song/i })).toHaveAttribute('href', '/create');
    expect(screen.getByRole('link', { name: /browse library/i })).toHaveAttribute('href', '/library');
  });

  it('displays loading state initially', async () => {
    (getAllSongs as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading songs...')).toBeInTheDocument();
  });

  it('displays a message if no songs are available', async () => {
    (getAllSongs as jest.Mock).mockResolvedValue([]);
    renderComponent();
    expect(await screen.findByText(/no songs available at the moment/i)).toBeInTheDocument();
  });

  it('fetches and displays 3 random songs with user data', async () => {
    renderComponent();
    
    // Since Math.random is mocked to 0.5, sort is stable, it will just take the first 3
    expect(await screen.findByText('Song A')).toBeInTheDocument();
    expect(screen.getByText('Song B')).toBeInTheDocument();
    expect(screen.getByText('Song C')).toBeInTheDocument();
    expect(screen.queryByText('Song D')).not.toBeInTheDocument();

    // Check for usernames
    const useroneElements = await screen.findAllByText('@userone');
    expect(useroneElements.length).toBe(2);
    expect(screen.getByText('@User Two')).toBeInTheDocument();
  });

  it('navigates to song details page on song click', async () => {
    renderComponent();
    const songCard = await screen.findByText('Song A');
    fireEvent.click(songCard);
    expect(mockNavigate).toHaveBeenCalledWith('/song/1');
  });

  it('renders difficulty stars for each song', async () => {
    // Math.random returns 0.5, so difficulty = Math.floor(0.5 * 3) + 1 = 2
    renderComponent();
    await screen.findByText('Song A');

    const communitySongsSection = screen.getByRole('heading', { name: /random community songs/i }).parentElement!;
    const songCards = within(communitySongsSection).getAllByRole('heading', { level: 3 });

    expect(songCards).toHaveLength(3);

    songCards.forEach(card => {
        const parent = card.parentElement!;
        // With difficulty 2, we expect 2 FaStar and 1 FaRegStar
        const filledStars = within(parent).getAllByTestId('filled-star');
        const emptyStars = within(parent).getAllByTestId('empty-star');
        expect(filledStars).toHaveLength(2);
        expect(emptyStars).toHaveLength(1);
    });
  });

  it('renders the footer with social media links', () => {
    renderComponent();
    expect(screen.getByTitle('Chordia on Twitter')).toBeInTheDocument();
    expect(screen.getByTitle('Chordia on Instagram')).toBeInTheDocument();
    expect(screen.getByTitle('Chordia on YouTube')).toBeInTheDocument();
  });
}); 