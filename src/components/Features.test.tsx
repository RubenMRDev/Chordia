import { render, screen } from '@testing-library/react';
import Features from './Features';


beforeAll(() => {
  global.IntersectionObserver = class MockIntersectionObserver {
    constructor(callback) {
      
      setTimeout(() => {
        callback([{ isIntersecting: true }], this);
      }, 0);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Features Component', () => {
  
  test('renders without crashing', () => {
    render(<Features />);
    
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  
  test('contains key feature text content', () => {
    render(<Features />);
    
    
    expect(screen.getByText(/Why Choose/i)).toBeInTheDocument();
    expect(screen.getByText(/Chordia/i)).toBeInTheDocument();
    
    
    expect(screen.getByText('Extensive Song Catalog')).toBeInTheDocument();
    expect(screen.getByText('Custom Compositions')).toBeInTheDocument();
    expect(screen.getByText('Interactive Learning')).toBeInTheDocument();
  });

  
  test('has the correct structure', () => {
    const { container } = render(<Features />);
    
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-[var(--background-dark)]');
    
    
    const cards = container.querySelectorAll('.card');
    expect(cards.length).toBe(3);
  });
});
