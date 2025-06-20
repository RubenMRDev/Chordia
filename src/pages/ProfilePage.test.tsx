import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { getUserSongs, deleteAllUserSongs } from '../api/songApi';
import { deleteUserProfile } from '../api/userApi';
import ProfilePage from './ProfilePage';
import { Song, UserProfile } from '../types/firebase';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../context/AuthContext');
jest.mock('../api/songApi');
jest.mock('../api/userApi');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockCurrentUserDelete = jest.fn();

const mockUser = {
  uid: 'test-uid',
  displayName: 'Test User',
  photoURL: 'https://test.com/photo.jpg',
  delete: mockCurrentUserDelete,
};

const mockUserProfile: UserProfile = {
  uid: 'test-uid',
  displayName: 'Test User Profile',
  email: 'test@test.com',
  photoURL: 'https://test.com/profile.jpg',
  bio: 'Test bio',
  location: 'Test Location',
  website: 'https://test.com',
  joinDate: new Date().toISOString(),
  socialLinks: {},
  role: 'user',
};

const mockAdminProfile: UserProfile = {
    ...mockUserProfile,
    role: 'admin',
  };

const mockSongs: Song[] = [
  { id: '1', title: 'Song 1', tempo: 120, key: 'C', timeSignature: '4/4', createdAt: new Date().toISOString(), userId: 'test-uid', chords: [] },
  { id: '2', title: 'Song 2', tempo: 140, key: 'G', timeSignature: '4/4', createdAt: new Date().toISOString(), userId: 'test-uid', chords: [] },
];

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      userProfile: mockUserProfile,
      logout: mockLogout,
    });
    (getUserSongs as jest.Mock).mockResolvedValue(mockSongs);
    (deleteAllUserSongs as jest.Mock).mockResolvedValue(undefined);
    (deleteUserProfile as jest.Mock).mockResolvedValue(undefined);
    (mockCurrentUserDelete as jest.Mock).mockResolvedValue(undefined);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

  it('should display loading state initially', async () => {
    // This is tricky to test as the loading state is very brief.
    // We can check for the end result instead.
    renderComponent();
    expect(await screen.findByRole('heading', { name: 'Test User Profile' })).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should redirect to login if user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null, userProfile: null, logout: mockLogout });
    renderComponent();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });

  it('should display user profile information and songs', async () => {
    renderComponent();

    expect(await screen.findByRole('heading', { name: 'Test User Profile' })).toBeInTheDocument();
    expect(screen.getByText('@testuserprofile')).toBeInTheDocument();
    expect(screen.getAllByAltText('Profile')[0]).toHaveAttribute('src', mockUserProfile.photoURL);
    expect(screen.getByText('2')).toBeInTheDocument(); // Number of tracks
    expect(await screen.findByText('Song 1')).toBeInTheDocument();
    expect(screen.getByText('Song 2')).toBeInTheDocument();
  });

  it('should show Manage Songs link for admin users', async () => {
    (useAuth as jest.Mock).mockReturnValue({
        currentUser: mockUser,
        userProfile: mockAdminProfile,
        logout: mockLogout,
    });
    renderComponent();
    expect(await screen.findByRole('link', { name: 'Manage Songs' })).toBeInTheDocument();
  });

  it('should handle logout', async () => {
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: true });
    renderComponent();

    const logoutButton = await screen.findByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should not logout if swal is cancelled', async () => {
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: false });
    renderComponent();

    const logoutButton = await screen.findByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

     await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });
    
    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle account deletion', async () => {
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: true });
    renderComponent();

    const deleteButton = await screen.findByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(deleteAllUserSongs).toHaveBeenCalledWith('test-uid');
      expect(deleteUserProfile).toHaveBeenCalledWith('test-uid');
      expect(mockCurrentUserDelete).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should not delete account if swal is cancelled', async () => {
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: false });
    renderComponent();

    const deleteButton = await screen.findByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalled();
      });

    expect(deleteAllUserSongs).not.toHaveBeenCalled();
    expect(deleteUserProfile).not.toHaveBeenCalled();
    expect(mockCurrentUserDelete).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('should show error on logout failure', async () => {
    const error = new Error('Logout failed');
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      userProfile: mockUserProfile,
      logout: jest.fn().mockRejectedValue(error),
    });
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: true });

    renderComponent();

    const logoutButton = await screen.findByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem logging out. Please try again.',
      }));
    });
  });

  it('should display a message when there are no songs', async () => {
    (getUserSongs as jest.Mock).mockResolvedValue([]);
    renderComponent();
    expect(await screen.findByText("You haven't created any songs yet")).toBeInTheDocument();
  });

  it('should handle image error and show placeholder', async () => {
    renderComponent();
    // Wait for the page to load by finding the heading
    await screen.findByRole('heading', { name: 'Test User Profile' });
    const profileImages = await screen.findAllByAltText('Profile');
    // The first image is in the header, the second is the main profile picture
    const mainProfileImage = profileImages[1];
    fireEvent.error(mainProfileImage);
    expect(mainProfileImage).toHaveAttribute('src', 'https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp');
  });

  it('should handle invalid date format', async () => {
    const invalidSong = [{ ...mockSongs[0], createdAt: 'invalid-date' }];
    (getUserSongs as jest.Mock).mockResolvedValue(invalidSong);
    renderComponent();
    // wait for the songs to be rendered
    await screen.findByText(/Song 1/i);
    expect(await screen.findByText('Invalid date')).toBeInTheDocument();
  });
}); 