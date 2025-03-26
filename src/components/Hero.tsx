import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';

const Hero: React.FC = () => {
  return (
    <section style={{ 
      position: 'relative',
      padding: '5rem 0',
      overflow: 'hidden',
      backgroundColor: 'var(--background-darker)'
    }}>
      {/* Fondo con notas musicales */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url("https://res.cloudinary.com/doy4x4chv/image/upload/v1742986249/hero-music_kpdnh2.webp")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5,
        zIndex: 0
      }}></div>
      
      <div className="container">
        <div style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold',
            lineHeight: 1.2,
            marginBottom: '1rem'
          }}>
            Master Piano <br />with <span style={{ color: 'var(--accent-green)' }}>Chordia</span>
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Learn, create, and explore music like never before. Access chord 
            progressions, create custom sheets, and develop your musical journey with 
            our innovative platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Try it Free</Link>
            <a href="#" className="btn btn-secondary">Watch Demo</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;