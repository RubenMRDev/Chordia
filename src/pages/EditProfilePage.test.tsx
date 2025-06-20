import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../api/userApi';
import EditProfilePage from './EditProfilePage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../api/userApi', () => ({
  updateUserProfile: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockUpdateProfileInContext = jest.fn();

const mockUser = {
  uid: 'test-uid',
  displayName: 'Test User',
};

const mockUserProfile = {
  displayName: 'Test User',
  bio: 'Test bio',
  location: 'Test location',
  website: 'https://test.com',
  socialLinks: {
    instagram: 'test-insta',
    twitter: 'test-twitter',
    soundcloud: 'test-soundcloud',
    spotify: 'test-spotify',
  },
};

describe('EditProfilePage', () => {
  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      userProfile: mockUserProfile,
      updateProfileInContext: mockUpdateProfileInContext,
    });
    (updateUserProfile as jest.Mock).mockResolvedValue(undefined);
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    );

  it('renders the form with pre-filled user data', () => {
    renderComponent();

    expect(screen.getByLabelText(/name/i)).toHaveValue(mockUserProfile.displayName);
    expect(screen.getByLabelText(/bio/i)).toHaveValue(mockUserProfile.bio);
    expect(screen.getByLabelText(/location/i)).toHaveValue(mockUserProfile.location);
    expect(screen.getByLabelText(/website/i)).toHaveValue(mockUserProfile.website);
    expect(screen.getByLabelText(/instagram/i)).toHaveValue(mockUserProfile.socialLinks.instagram);
    expect(screen.getByLabelText(/twitter/i)).toHaveValue(mockUserProfile.socialLinks.twitter);
    expect(screen.getByLabelText(/soundcloud/i)).toHaveValue(mockUserProfile.socialLinks.soundcloud);
    expect(screen.getByLabelText(/spotify/i)).toHaveValue(mockUserProfile.socialLinks.spotify);
  });

  it('updates form fields on user input', () => {
    renderComponent();
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput).toHaveValue('New Name');

    const bioInput = screen.getByLabelText(/bio/i);
    fireEvent.change(bioInput, { target: { value: 'New Bio' } });
    expect(bioInput).toHaveValue('New Bio');
  });

  it('submits the form and calls updateUserProfile', async () => {
    renderComponent();
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(mockUser.uid, {
        displayName: 'Updated Name',
        bio: mockUserProfile.bio,
        location: mockUserProfile.location,
        website: mockUserProfile.website,
        socialLinks: {
          instagram: mockUserProfile.socialLinks.instagram,
          twitter: mockUserProfile.socialLinks.twitter,
          soundcloud: mockUserProfile.socialLinks.soundcloud,
          spotify: mockUserProfile.socialLinks.spotify,
        },
      });
    });
  });

  it('navigates to profile page and updates context on successful submission', async () => {
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfileInContext).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('does not submit if user is not logged in', async () => {
    (useAuth as jest.Mock).mockReturnValue({
        currentUser: null,
        userProfile: null,
        updateProfileInContext: mockUpdateProfileInContext,
      });

    renderComponent();
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateUserProfile).not.toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (updateUserProfile as jest.Mock).mockRejectedValue(new Error('API Error'));
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
          expect(screen.getByRole('button', { name: /save changes/i })).not.toBeDisabled();
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating profile:", new Error('API Error'));
      consoleErrorSpy.mockRestore();
  });


}); 