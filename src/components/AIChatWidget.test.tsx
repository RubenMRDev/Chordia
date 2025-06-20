import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '../context/AuthContext';
import AIChatWidget from './AIChatWidget';

declare const global: any;

jest.mock('../context/AuthContext');

describe('AIChatWidget', () => {
  const mockUser = { displayName: 'Test User' };
  const mockUserProfile = { displayName: 'Test Profile' };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      userProfile: mockUserProfile,
    });
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    global.puter = {
      init: jest.fn(),
      ai: { chat: jest.fn().mockResolvedValue('AI response') },
    };
    jest.clearAllMocks();
  });

  it('should render the open chat button and open the chat', () => {
    render(<AIChatWidget />);
    const openButton = screen.getByLabelText(/open ai chat/i);
    expect(openButton).toBeInTheDocument();
    fireEvent.click(openButton);
    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/how can I help you/i)).toBeInTheDocument();
  });

  it('should close the chat when close button is clicked', () => {
    render(<AIChatWidget />);
    fireEvent.click(screen.getByLabelText(/open ai chat/i));
    const closeButton = screen.getByLabelText(/close chat/i);
    fireEvent.click(closeButton);
    expect(screen.queryByText(/AI Assistant/i)).not.toBeInTheDocument();
  });

  it('should not render if no user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null, userProfile: null });
    render(<AIChatWidget />);
    expect(screen.queryByLabelText(/open ai chat/i)).not.toBeInTheDocument();
  });

  it('should show auth error if puter.init fails', async () => {
    global.puter.init = jest.fn().mockRejectedValue(new Error('fail'));
    render(<AIChatWidget />);
    fireEvent.click(screen.getByLabelText(/open ai chat/i));
    await waitFor(() => {
      expect(screen.getByText(/must log in to the Puter API/i)).toBeInTheDocument();
    });
  });

  it('should send a message and show AI response', async () => {
    render(<AIChatWidget />);
    fireEvent.click(screen.getByLabelText(/open ai chat/i));
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hola' } });
    fireEvent.click(screen.getByLabelText(/send/i));
    await waitFor(() => {
      expect(global.puter.ai.chat).toHaveBeenCalled();
      expect(screen.getByText('AI response')).toBeInTheDocument();
    });
  });

  it('should clear the chat when clear button is clicked', async () => {
    render(<AIChatWidget />);
    fireEvent.click(screen.getByLabelText(/open ai chat/i));
    const clearButton = screen.getByLabelText(/clear chat/i);
    fireEvent.click(clearButton);
    expect(screen.getByText(/how can I help you/i)).toBeInTheDocument();
  });

  it('should handle error from puter.ai.chat gracefully', async () => {
    global.puter.ai.chat = jest.fn().mockRejectedValue(new Error('AI fail'));
    render(<AIChatWidget />);
    fireEvent.click(screen.getByLabelText(/open ai chat/i));
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hola' } });
    fireEvent.click(screen.getByLabelText(/send/i));
    await waitFor(() => {
      expect(screen.getByText(/An error occurred while connecting to the AI/i)).toBeInTheDocument();
    });
  });
}); 