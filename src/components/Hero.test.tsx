import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hero from './Hero';

const renderHero = (props = {}) => {
  return render(
    <BrowserRouter>
      <Hero {...props} />
    </BrowserRouter>
  );
};

test('renders Hero component with default props', () => {
  renderHero();
  expect(screen.getByTestId('hero-component')).toBeInTheDocument();
  expect(screen.getByText('Master Piano with Chordia')).toBeInTheDocument();
  expect(screen.getByText('Learn, create, and explore music like never before.')).toBeInTheDocument();
  expect(screen.getByText('Try it Free')).toBeInTheDocument();
});

test('renders custom title and subtitle', () => {
  renderHero({ title: 'Custom Title', subtitle: 'Custom Subtitle' });
  expect(screen.getByText('Custom Title')).toBeInTheDocument();
  expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
});

test('renders custom callToAction text', () => {
  renderHero({ callToAction: 'Get Started' });
  expect(screen.getByText('Get Started')).toBeInTheDocument();
});

test('applies custom background image', () => {
  const image = 'https://example.com/custom-bg.jpg';
  renderHero({ backgroundImage: image });
  const bgDiv = screen.getByTestId('hero-background');
  expect(bgDiv).toHaveStyle(`background-image: url(${image})`);
});

test('adds custom className to section', () => {
  renderHero({ className: 'custom-class' });
  expect(screen.getByTestId('hero-component')).toHaveClass('custom-class');
});
