import React from 'react';
import { FaBook, FaEdit, FaGraduationCap } from 'react-icons/fa';

const Features: React.FC = () => {
  return (
    <section className="section" style={{ backgroundColor: 'var(--background-dark)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Why Choose Chordia
        </h2>
        <p style={{ 
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          maxWidth: '700px',
          margin: '0 auto 3rem'
        }}>
          Everything you need to enhance your musical journey
        </p>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="card">
            <FaBook className="feature-icon" />
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
              Extensive Song Catalog
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Access thousands of songs with detailed chord progressions and sheet music.
            </p>
          </div>

          <div className="card">
            <FaEdit className="feature-icon" />
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
              Custom Compositions
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Create and save your own musical arrangements with our intuitive editor.
            </p>
          </div>

          <div className="card">
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