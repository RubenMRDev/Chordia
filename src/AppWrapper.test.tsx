import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import { useAuth } from './context/AuthContext';

// Mock the useAuth hook
jest.mock('./context/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock App component
jest.mock('./App', () => {
  return function MockApp() {
    return <div data-testid="app-component">App Component</div>;
  };
});

describe('AppWrapper', () => {
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

  test('renders the App component', () => {
    render(
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    );

    expect(screen.getByTestId('app-component')).toBeInTheDocument();
  });

  test('calls useAuth hook', () => {
    render(
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    );

    expect(mockUseAuth).toHaveBeenCalled();
  });

  test('renders with authenticated user', () => {
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
        <AppWrapper />
      </BrowserRouter>
    );

    expect(screen.getByTestId('app-component')).toBeInTheDocument();
  });
}); 