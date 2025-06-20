import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { createUserProfile, getUserProfile } from '../api/userApi';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('../firebase/config', () => ({
  auth: {},
}));

// Mock API functions
jest.mock('../api/userApi', () => ({
  createUserProfile: jest.fn(),
  getUserProfile: jest.fn(),
}));

const mockCreateUserProfile = createUserProfile as jest.MockedFunction<typeof createUserProfile>;
const mockGetUserProfile = getUserProfile as jest.MockedFunction<typeof getUserProfile>;

// Mock Firebase auth functions
const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>;

// Test component to access context
const TestComponent = () => {
  const { currentUser, userProfile, loading, error } = useAuth();
  return (
    <div>
      <div data-testid="current-user">{currentUser ? currentUser.email : 'no-user'}</div>
      <div data-testid="user-profile">{userProfile ? userProfile.displayName : 'no-profile'}</div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      (callback as (user: User | null) => void)(null);
      return jest.fn();
    });
    mockCreateUserProfile.mockResolvedValue();
    mockGetUserProfile.mockResolvedValue(null);
  });

  test('provides initial state', async () => {
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      (callback as (user: User | null) => void)(null);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });
  });

  test('sets up auth state listener on mount', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
  });

  test('updates state when user is authenticated', async () => {
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
    } as User;

    const mockProfile = {
      uid: '123',
      displayName: 'Test User',
      email: 'test@test.com',
      role: 'user' as const,
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

    mockGetUserProfile.mockResolvedValue(mockProfile);

    // Simulate auth state change
    let authStateCallback: (user: User | null) => void;
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      authStateCallback = callback as (user: User | null) => void;
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Trigger auth state change
    authStateCallback!(mockUser);

    await waitFor(() => {
      expect(screen.getByTestId('current-user')).toHaveTextContent('test@test.com');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-profile')).toHaveTextContent('Test User');
    });
  });

  test('creates user profile when user exists but profile does not', async () => {
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
    } as User;

    mockGetUserProfile.mockResolvedValue(null);

    let authStateCallback: (user: User | null) => void;
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      authStateCallback = callback as (user: User | null) => void;
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    authStateCallback!(mockUser);

    await waitFor(() => {
      expect(mockCreateUserProfile).toHaveBeenCalledWith({
        uid: '123',
        displayName: 'Test User',
        email: 'test@test.com',
        photoURL: '',
        bio: '',
        location: '',
        website: '',
        role: 'user',
        joinDate: expect.any(String),
        socialLinks: {
          instagram: '',
          twitter: '',
          soundcloud: '',
          spotify: ''
        }
      });
    });
  });

  test('cleans up auth state listener on unmount', () => {
    const unsubscribe = jest.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
}); 