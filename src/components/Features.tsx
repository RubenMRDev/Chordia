import React, { useState, useEffect, useRef } from 'react';
import { FaBook, FaEdit, FaGraduationCap } from 'react-icons/fa';
const Features: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [subheadingVisible, setSubheadingVisible] = useState(false);
  const setFeatureRef = (index: number) => (el: HTMLDivElement | null) => {
    featureRefs.current[index] = el;
  };
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if (typeof window !== 'undefined') {
      if (sectionRef.current) {
        const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHeadingVisible(true);
              setTimeout(() => {
                setSubheadingVisible(true);
              }, 300);
              sectionObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        sectionObserver.observe(sectionRef.current);
        observers.push(sectionObserver);
      }
      featureRefs.current.forEach((ref, index) => {
        if (ref) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleItems(prev => {
                    if (!prev.includes(index)) {
                      return [...prev, index];
                    }
                    return prev;
                  });
                }, 600 + index * 200);
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });
          observer.observe(ref);
          observers.push(observer);
        }
      });
    }
    return () => {
      observers.forEach(observer => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);
  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold' as const,
    marginBottom: '1rem',
    opacity: headingVisible ? 1 : 0,
    transform: headingVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
  };
  const subheadingStyle = {
    color: 'var(--text-secondary)',
    marginBottom: '3rem',
    maxWidth: '700px',
    margin: '0 auto 3rem',
    opacity: subheadingVisible ? 1 : 0,
    transform: subheadingVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
  };
  const cardStyle = (index: number) => ({
    opacity: visibleItems.includes(index) ? 1 : 0,
    transform: visibleItems.includes(index) ? 'translateY(0)' : 'translateY(50px)',
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
  });
  return (
    <section className="section" style={{ backgroundColor: 'var(--background-dark)' }} ref={sectionRef}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={headingStyle}>
          Why Choose Chordia
        </h2>
        <p style={subheadingStyle}>
          Everything you need to enhance your musical journey
        </p>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div 
            className="card" 
            ref={setFeatureRef(0)}
            style={{...cardStyle(0)}}
          >
            <FaBook className="feature-icon" />
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
              Extensive Song Catalog
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Access thousands of songs with detailed chord progressions and sheet music.
            </p>
          </div>
          <div 
            className="card"
            ref={setFeatureRef(1)}
            style={{...cardStyle(1)}}
          >
            <FaEdit className="feature-icon" />
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
              Custom Compositions
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Create and save your own musical arrangements with our intuitive editor.
            </p>
          </div>
          <div 
            className="card"
            ref={setFeatureRef(2)}
            style={{...cardStyle(2)}}
          >
            <FaGraduationCap className="feature-icon" />
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
              Interactive Learning
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Learn at your own pace with our interactive tutorials and exercises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;