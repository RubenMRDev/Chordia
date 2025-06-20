import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterPage from './RegisterPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockRegister = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockSetError = jest.fn();

describe('RegisterPage', () => {
  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      signInWithGoogle: mockSignInWithGoogle,
      error: null,
      setError: mockSetError,
    });
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

  it('renders the register form', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId('create-account-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('does not submit if terms are not agreed to', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const registerButton = screen.getByTestId('create-account-button');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('You must agree to the Terms of Service and Privacy Policy');
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('calls register function on form submission', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const termsCheckbox = screen.getByRole('checkbox');
    const registerButton = screen.getByTestId('create-account-button');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    });
  });

  it('navigates to dashboard on successful registration', async () => {
    mockRegister.mockResolvedValueOnce({} as any);
    renderComponent();
    
    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const termsCheckbox = screen.getByRole('checkbox');
    const registerButton = screen.getByTestId('create-account-button');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('calls signInWithGoogle on google sign-in button click', async () => {
    renderComponent();
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it('navigates to dashboard on successful google sign-in', async () => {
    mockSignInWithGoogle.mockResolvedValueOnce({} as any);
    renderComponent();
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error message if registration fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({
        register: mockRegister,
        signInWithGoogle: mockSignInWithGoogle,
        error: 'Registration failed',
        setError: mockSetError,
    });
    
    renderComponent();

    expect(screen.getByText('Registration failed')).toBeInTheDocument();
  });
}); 