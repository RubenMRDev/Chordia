import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import { useAuth } from '../context/AuthContext';
import type { UserProfile } from '../types/firebase';

// Mock the useAuth hook
jest.mock('../context/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('AdminRoute', () => {
  const TestComponent = () => <div>Admin Content</div>;

  const mockUser = {
    uid: '123',
    email: 'test@test.com',
    displayName: 'Test User',
    emailVerified: true,
    isAnonymous: false,
    metadata: {} as any,
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    phoneNumber: null,
    photoURL: null,
    providerId: 'password'
  };

  const mockAdminProfile: UserProfile = {
    uid: '123',
    displayName: 'Admin User',
    email: 'admin@test.com',
    role: 'admin',
    joinDate: '2024-01-01',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      soundcloud: '',
      spotify: ''
    }
  };

  const mockUserProfile: UserProfile = {
    uid: '123',
    displayName: 'Regular User',
    email: 'user@test.com',
    role: 'user',
    joinDate: '2024-01-01',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      soundcloud: '',
      spotify: ''
    }
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithFacebook: jest.fn(),
      error: null,
      setError: jest.fn(),
      updateProfileInContext: jest.fn(),
      refreshUserProfile: jest.fn(),
    });
  });

  test('renders admin content when user is admin', () => {
    mockUseAuth.mockReturnValue({
      currentUser: mockUser,
      userProfile: mockAdminProfile,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithFacebook: jest.fn(),
      error: null,
      setError: jest.fn(),
      updateProfileInContext: jest.fn(),
      refreshUserProfile: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('redirects to home when user is not admin', () => {
    mockUseAuth.mockReturnValue({
      currentUser: mockUser,
      userProfile: mockUserProfile,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithFacebook: jest.fn(),
      error: null,
      setError: jest.fn(),
      updateProfileInContext: jest.fn(),
      refreshUserProfile: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('redirects to home when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithFacebook: jest.fn(),
      error: null,
      setError: jest.fn(),
      updateProfileInContext: jest.fn(),
      refreshUserProfile: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('redirects to home when userProfile is null', () => {
    mockUseAuth.mockReturnValue({
      currentUser: mockUser,
      userProfile: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithFacebook: jest.fn(),
      error: null,
      setError: jest.fn(),
      updateProfileInContext: jest.fn(),
      refreshUserProfile: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
}); 