import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { getAllSongsWithUserInfo, deleteSongAsAdmin } from '../api/songApi';
import AdminSongManagementPage from './AdminSongManagementPage';

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
const mockGetAllSongs = getAllSongsWithUserInfo as jest.Mock;
const mockDeleteSong = deleteSongAsAdmin as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockSwal = Swal.fire as jest.Mock;

const mockSongs = [
  { id: '1', title: 'Admin Song 1', userDisplayName: 'Admin User', createdAt: new Date().toISOString(), tempo: 120, key: 'C', chords: [] },
  { id: '2', title: 'Test Song 2', userDisplayName: 'Test User', createdAt: new Date().toISOString(), tempo: 140, key: 'G', chords: [] },
];

describe('AdminSongManagementPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AdminSongManagementPage />
      </MemoryRouter>
    );

  it('redirects non-admin users', () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user123' }, userProfile: { role: 'user' } });
    renderComponent();
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('does not redirect admin users and shows page title', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'admin123' }, userProfile: { role: 'admin' } });
    mockGetAllSongs.mockResolvedValue([]);
    renderComponent();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(await screen.findByRole('heading', { name: /song management/i })).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'admin123' }, userProfile: { role: 'admin' } });
    mockGetAllSongs.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('fetches and displays songs', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'admin123' }, userProfile: { role: 'admin' } });
    mockGetAllSongs.mockResolvedValue(mockSongs);
    renderComponent();
    expect(await screen.findByText('Admin Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
  });

  it('displays a message when no songs are found', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'admin123' }, userProfile: { role: 'admin' } });
    mockGetAllSongs.mockResolvedValue([]);
    renderComponent();
    expect(await screen.findByText(/no songs found/i)).toBeInTheDocument();
  });

  it('handles song deletion successfully', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'admin123' }, userProfile: { role: 'admin' } });
    mockGetAllSongs.mockResolvedValue(mockSongs);
    mockSwal.mockResolvedValue({ isConfirmed: true });
    mockDeleteSong.mockResolvedValue(undefined);

    renderComponent();

    const songToDeleteTitle = 'Admin Song 1';
    await screen.findByText(songToDeleteTitle);

    const deleteButtons = screen.getAllByTitle(/delete song/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
        expect(mockSwal).toHaveBeenCalled();
    });
    
    expect(mockDeleteSong).toHaveBeenCalledWith('1');

    await waitFor(() => {
        expect(screen.queryByText(songToDeleteTitle)).not.toBeInTheDocument();
    });

    expect(mockSwal).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
  });

  it('handles API error when fetching songs', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'admin123' }, userProfile: { role: 'admin' } });
    const error = new Error('Failed to fetch');
    mockGetAllSongs.mockRejectedValue(error);
    
    renderComponent();

    await waitFor(() => {
        expect(mockSwal).toHaveBeenCalledWith(expect.objectContaining({
            icon: 'error',
            text: 'Failed to load songs. Please try again later.'
        }));
    });
  });
}); 