import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CallToAction from './CallToAction';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('CallToAction', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  test('renders the call to action section', () => {
    render(
      <BrowserRouter>
        <CallToAction />
      </BrowserRouter>
    );

    expect(screen.getByText('Start Your Musical Journey Today')).toBeInTheDocument();
    expect(screen.getByText('Join thousands of musicians who are already creating and learning with Chordia')).toBeInTheDocument();
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });

  test('renders the link with correct href', () => {
    render(
      <BrowserRouter>
        <CallToAction />
      </BrowserRouter>
    );

    const link = screen.getByText('Get Started Free');
    expect(link).toHaveAttribute('href', '/register');
  });

  test('applies hover effects to the button', () => {
    render(
      <BrowserRouter>
        <CallToAction />
      </BrowserRouter>
    );

    const button = screen.getByText('Get Started Free');
    
    // Test mouse over
    fireEvent.mouseOver(button);
    expect(button).toHaveStyle({ backgroundColor: '#03b061' });
    
    // Test mouse out
    fireEvent.mouseOut(button);
    expect(button).toHaveStyle({ backgroundColor: '#04e073' });
  });

  test('sets up intersection observer on mount', () => {
    render(
      <BrowserRouter>
        <CallToAction />
      </BrowserRouter>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.2 }
    );
  });

  test('has correct initial styles', () => {
    render(
      <BrowserRouter>
        <CallToAction />
      </BrowserRouter>
    );

    const heading = screen.getByText('Start Your Musical Journey Today');
    const paragraph = screen.getByText('Join thousands of musicians who are already creating and learning with Chordia');
    const button = screen.getByText('Get Started Free');

    expect(heading).toHaveStyle({
      opacity: '0',
      transform: 'translateY(40px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      transitionDelay: '0.1s'
    });

    expect(paragraph).toHaveStyle({
      opacity: '0',
      transform: 'translateY(40px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      transitionDelay: '0.3s'
    });

    expect(button).toHaveStyle({
      backgroundColor: '#04e073',
      color: 'black',
      opacity: '0',
      transform: 'translateY(40px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease, background-color 0.3s ease, box-shadow 0.3s ease',
      transitionDelay: '0.5s',
      textDecoration: 'none'
    });
  });
}); 