import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { useAuth } from './context/AuthContext';

// Mock the useAuth hook
jest.mock('./context/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock AIChatWidget to avoid complex dependencies
jest.mock('./components/AIChatWidget', () => {
  return function MockAIChatWidget() {
    return <div data-testid="ai-chat-widget">AI Chat Widget</div>;
  };
});

jest.mock('./components/Header', () => () => <div data-testid="header" />);
jest.mock('./components/Hero', () => () => <div data-testid="hero" />);
jest.mock('./components/Features', () => () => <div data-testid="features" />);
jest.mock('./components/Experience', () => () => <div data-testid="experience" />);
jest.mock('./components/CallToAction', () => () => <div data-testid="call-to-action" />);
jest.mock('./components/Footer', () => () => <div data-testid="footer" />);
jest.mock('./components/LandingLayout', () => ({ children }: { children: React.ReactNode }) => <div data-testid="landing-layout">{children}</div>);

jest.mock('./pages/LoginPage', () => () => <div data-testid="login-page" />);
jest.mock('./pages/RegisterPage', () => () => <div data-testid="register-page" />);
jest.mock('./pages/DashboardPage', () => () => <div data-testid="dashboard-page" />);
jest.mock('./pages/DiscoverPage', () => () => <div data-testid="discover-page" />);
jest.mock('./pages/LibraryPage', () => () => <div data-testid="library-page" />);
jest.mock('./pages/ProfilePage', () => () => <div data-testid="profile-page" />);
jest.mock('./pages/EditProfilePage', () => () => <div data-testid="edit-profile-page" />);
jest.mock('./pages/AdminSongManagementPage', () => () => <div data-testid="admin-song-management-page" />);
jest.mock('./pages/CreateSongPage', () => () => <div data-testid="create-song-page" />);
jest.mock('./pages/SongDetailsPage', () => () => <div data-testid="song-details-page" />);
jest.mock('./pages/DemoPage', () => () => <div data-testid="demo-page" />);

describe('App', () => {
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

  test('renders the app with routing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Check that the app renders without crashing
    expect(screen.getByTestId('ai-chat-widget')).toBeInTheDocument();
  });

  test('renders with authenticated user', () => {
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
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId('ai-chat-widget')).toBeInTheDocument();
  });

  test('renders with loading state', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
      loading: true,
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
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId('ai-chat-widget')).toBeInTheDocument();
  });
}); 