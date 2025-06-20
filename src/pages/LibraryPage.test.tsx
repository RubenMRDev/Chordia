import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { getUserSongs, deleteSongById } from '../api/songApi';
import LibraryPage from './LibraryPage';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../context/AuthContext');
jest.mock('../api/songApi');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));
jest.mock('../components/Header', () => () => <header>Mocked Header</header>);

const mockNavigate = jest.fn();
const mockGetUserSongs = getUserSongs as jest.Mock;
const mockDeleteSongById = deleteSongById as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockSwal = Swal.fire as jest.Mock;

const mockSongs = [
  { id: '1', title: 'My Song 1', createdAt: new Date().toISOString(), tempo: 120, key: 'C', timeSignature: '4/4' },
  { id: '2', title: 'My Song 2', createdAt: new Date().toISOString(), tempo: 90, key: 'Am', timeSignature: '3/4' },
];

describe('LibraryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <LibraryPage />
      </MemoryRouter>
    );

  it('shows empty library message if user is not logged in', async () => {
    mockUseAuth.mockReturnValue({ currentUser: null });
    renderComponent();
    expect(mockGetUserSongs).not.toHaveBeenCalled();
    expect(await screen.findByText(/your library is empty/i)).toBeInTheDocument();
  });

  it('shows loading state while fetching songs', () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' } });
    mockGetUserSongs.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/loading your songs/i)).toBeInTheDocument();
  });

  it('fetches and displays user songs', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' } });
    mockGetUserSongs.mockResolvedValue(mockSongs);
    renderComponent();
    expect(await screen.findByText('My Song 1')).toBeInTheDocument();
    expect(screen.getByText('My Song 2')).toBeInTheDocument();
    expect(screen.queryByText(/loading your songs/i)).not.toBeInTheDocument();
  });

  it('displays an error message if fetching fails', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' } });
    mockGetUserSongs.mockRejectedValue(new Error('Fetch error'));
    renderComponent();
    expect(await screen.findByText(/failed to load your songs/i)).toBeInTheDocument();
  });

  it('displays an empty library message', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' } });
    mockGetUserSongs.mockResolvedValue([]);
    renderComponent();
    expect(await screen.findByText(/your library is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create song/i })).toBeInTheDocument();
  });

  it('navigates to create page when "Create New Song" is clicked', () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' } });
    mockGetUserSongs.mockResolvedValue([]);
    renderComponent();
    fireEvent.click(screen.getByRole('link', { name: /create new song/i }));
    expect(mockNavigate).not.toHaveBeenCalled(); // It's a Link, so it should navigate via href
  });

  it('navigates to song details on song card click', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' } });
    mockGetUserSongs.mockResolvedValue(mockSongs);
    renderComponent();
    const songCard = await screen.findByText('My Song 1');
    fireEvent.click(songCard);
    expect(mockNavigate).toHaveBeenCalledWith('/song/1');
  });

  it('handles song deletion', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' } });
    mockGetUserSongs.mockResolvedValue(mockSongs);
    mockSwal.mockResolvedValue({ isConfirmed: true });
    mockDeleteSongById.mockResolvedValue(undefined);

    renderComponent();

    await screen.findByText('My Song 1');
    const deleteButton = screen.getByLabelText(/delete my song 1/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(mockSwal).toHaveBeenCalled();
    });
    
    expect(mockDeleteSongById).toHaveBeenCalledWith('1');

    await waitFor(() => {
        expect(screen.queryByText('My Song 1')).not.toBeInTheDocument();
    });

    expect(mockSwal).toHaveBeenCalledWith('Deleted!', 'Your song has been deleted.', 'success');
  });
}); 