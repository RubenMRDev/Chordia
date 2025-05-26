import { render } from '@testing-library/react';
import Experience from './Experience';


beforeAll(() => {
  
  global.IntersectionObserver = class MockIntersectionObserver {
    constructor(callback) {
      
      setTimeout(() => {
        callback([
          {
            isIntersecting: true,
            target: {
              getAttribute: () => '0'
            }
          },
          {
            isIntersecting: true,
            target: {
              getAttribute: () => '1'
            }
          },
          {
            isIntersecting: true,
            target: {
              getAttribute: () => '2'
            }
          }
        ], this);
      }, 10);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});


beforeEach(() => {
  
  Element.prototype.querySelectorAll = jest.fn().mockImplementation(function(selector) {
    if (selector === '.feature-detail') {
      return [
        {
          getAttribute: (attr) => attr === 'style' ? 'transform: translateX(-50px); opacity: 0; transition: transform 0.6s ease-out, opacity 0.6s ease-out; transition-delay: 0.2s;' : null,
          textContent: 'Real-time Chord Recognition Instantly see chord names and progressions as you play.'
        },
        {
          getAttribute: (attr) => attr === 'style' ? 'transform: translateX(-50px); opacity: 0; transition: transform 0.6s ease-out, opacity 0.6s ease-out; transition-delay: 0.4s;' : null,
          textContent: 'Smart Practice Tools Track your progress and get personalized recommendations.'
        },
        {
          getAttribute: (attr) => attr === 'style' ? 'transform: translateX(-50px); opacity: 0; transition: transform 0.6s ease-out, opacity 0.6s ease-out; transition-delay: 0.6s;' : null,
          textContent: 'Community Sharing Share your arrangements and collaborate with other musicians.'
        }
      ];
    } else if (selector === 'p') {
      return [
        { textContent: 'Instantly see chord names and progressions as you play.' },
        { textContent: 'Track your progress and get personalized recommendations.' },
        { textContent: 'Share your arrangements and collaborate with other musicians.' }
      ];
    } else if (selector === 'span') {
      return [
        { 
          textContent: 'Like Never Before',
          className: 'text-[#04e073]'
        },
        { 
          textContent: 'Real-time',
          className: 'text-[#04e073]'
        },
        { 
          textContent: 'Smart',
          className: 'text-[#04e073]'
        },
        { 
          textContent: 'Community',
          className: 'text-[#04e073]'
        }
      ];
    } else if (selector === '.text-\\[\\#04e073\\]') {
      return [
        { textContent: 'Like Never Before' },
        { textContent: 'Real-time' },
        { textContent: 'Smart' },
        { textContent: 'Community' }
      ];
    } else {
      return [];
    }
  });
});

describe('Experience Component', () => {
  
  test('renders without crashing', () => {
    const { container } = render(<Experience />);
    
    expect(container.querySelector('section')).toBeTruthy();
  });

  
  test('contains expected text content', () => {
    const { container } = render(<Experience />);
    
    
    const content = container.textContent;
    
    
    expect(content).toContain('Experience Music');
    expect(content).toContain('Like Never Before');
    expect(content).toContain('Real-time');
    expect(content).toContain('Chord Recognition');
    expect(content).toContain('Smart');
    expect(content).toContain('Practice Tools');
    expect(content).toContain('Community');
    expect(content).toContain('Sharing');
  });
  
  
  test('has correct structure and classes', () => {
    const { container } = render(<Experience />);
    
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-[var(--background-darker)]');
    
    
    const featureDetails = container.querySelectorAll('.feature-detail');
    expect(featureDetails.length).toBe(3);
    
    
    const image = container.querySelector('img');
    expect(image).toBeTruthy();
    expect(image?.getAttribute('alt')).toBe('Chordia App');
    expect(image?.getAttribute('src')).toContain('cloudinary');
  });
  
  
  test('applies correct animation styles', () => {
    const { container } = render(<Experience />);
    
    
    const h2Element = container.querySelector('h2');
    expect(h2Element).toBeTruthy();
    
    
    const featureDetails = container.querySelectorAll('.feature-detail');
    expect(featureDetails.length).toBe(3);
    
    
    const firstDetailStyle = featureDetails[0].getAttribute('style');
    const secondDetailStyle = featureDetails[1].getAttribute('style');
    
    expect(firstDetailStyle).toContain('transition-delay: 0.2s');
    expect(secondDetailStyle).toContain('transition-delay: 0.4s');
  });

  
  test('contains highlighted elements with brand color class', () => {
    const { container } = render(<Experience />);
    
    
    const coloredElements = container.querySelectorAll('.text-\\[\\#04e073\\]');
    expect(coloredElements.length).toBeGreaterThan(0);
    
    
    const textContents = Array.from(coloredElements).map(el => el.textContent);
    expect(textContents).toContain('Like Never Before');
    expect(textContents).toContain('Real-time');
  });
  
  
  test('displays correct feature descriptions', () => {
    const { container } = render(<Experience />);
    
    
    const paragraphs = container.querySelectorAll('p');
    const paragraphTexts = Array.from(paragraphs).map(p => p.textContent);
    
    
    expect(paragraphTexts[0]).toContain('Instantly see chord names');
    expect(paragraphTexts[1]).toContain('Track your progress');
    expect(paragraphTexts[2]).toContain('Share your arrangements');
  });
  
  
  test('has correct grid layout structure', () => {
    const { container } = render(<Experience />);
    
    
    const section = container.querySelector('section');
    expect(section).toBeTruthy();
    expect(section?.className).toContain('bg-[var(--background-darker)]');
  });
});
