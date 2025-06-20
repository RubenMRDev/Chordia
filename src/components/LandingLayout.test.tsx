import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingLayout from './LandingLayout';

describe('LandingLayout', () => {
  test('renders children correctly', () => {
    render(
      <LandingLayout>
        <div>Test Content</div>
        <p>Another element</p>
      </LandingLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Another element')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = render(
      <LandingLayout>
        <div>Test Content</div>
      </LandingLayout>
    );

    const layoutDiv = container.firstChild as HTMLElement;
    expect(layoutDiv).toHaveClass('overflow-x-hidden', 'w-full');
  });

  test('renders with complex children', () => {
    const ComplexChild = () => (
      <div>
        <h1>Title</h1>
        <p>Description</p>
        <button>Click me</button>
      </div>
    );

    render(
      <LandingLayout>
        <ComplexChild />
      </LandingLayout>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
}); 