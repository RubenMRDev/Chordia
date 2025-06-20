import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock all the components used in HomePage
jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../components/Hero', () => {
  return function MockHero() {
    return <div data-testid="hero">Hero</div>;
  };
});

jest.mock('../components/Features', () => {
  return function MockFeatures() {
    return <div data-testid="features">Features</div>;
  };
});

jest.mock('../components/Experience', () => {
  return function MockExperience() {
    return <div data-testid="experience">Experience</div>;
  };
});

jest.mock('../components/CallToAction', () => {
  return function MockCallToAction() {
    return <div data-testid="call-to-action">CallToAction</div>;
  };
});

jest.mock('../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('../components/PianoTest', () => {
  return function MockPianoTest() {
    return <div data-testid="piano-test">PianoTest</div>;
  };
});

describe('HomePage', () => {
  test('renders all components', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByTestId('experience')).toBeInTheDocument();
    expect(screen.getByTestId('call-to-action')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('piano-test')).toBeInTheDocument();
  });

  test('has correct structure with main element', () => {
    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  test('has container with correct classes', () => {
    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toHaveClass('mx-auto', 'px-4', 'py-8');
  });
}); 