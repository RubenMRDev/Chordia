import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from './Landing';

// Mock all the components used in Landing
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

jest.mock('../components/LandingLayout', () => {
  return function MockLandingLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="landing-layout">{children}</div>;
  };
});

describe('Landing', () => {
  test('renders all components', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    expect(screen.getByTestId('landing-layout')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByTestId('experience')).toBeInTheDocument();
    expect(screen.getByTestId('call-to-action')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('has correct structure with main element', () => {
    const { container } = render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  test('components are rendered in correct order', () => {
    const { container } = render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    const mainElement = container.querySelector('main');
    const children = mainElement?.children;
    
    if (children) {
      expect(children[0]).toHaveAttribute('data-testid', 'hero');
      expect(children[1]).toHaveAttribute('data-testid', 'features');
      expect(children[2]).toHaveAttribute('data-testid', 'experience');
      expect(children[3]).toHaveAttribute('data-testid', 'call-to-action');
    }
  });
}); 