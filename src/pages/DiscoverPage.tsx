import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaSearch } from 'react-icons/fa';

const DiscoverPage: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: 'var(--background-darker)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      {/* Header/Navigation */}
      <header style={{ 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'var(--accent-green)',
            marginRight: '3rem',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}>
            <FaMusic style={{ marginRight: '0.5rem' }} />
            Chordia
          </Link>
          
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/discover" style={{ 
              color: 'var(--accent-green', 
              textDecoration: 'none',
              fontWeight: 'medium'
            }}>
              Discover
            </Link>
            <Link to="/library" style={{ 
              color: 'var(--text-primary)', 
              textDecoration: 'none',
              fontWeight: 'medium'
            }}>
              Library
            </Link>
          </nav>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button style={{ 
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}>
            <FaSearch />
          </button>
          
          <Link to="/profile" style={{ 
            backgroundColor: 'var(--accent-green)',
            color: '#000',
            padding: '0.5rem 1.25rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Sign In
          </Link>
        </div>
      </header>
      
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          color: 'var(--accent-green)',
          marginBottom: '2rem'
        }}>
          Discover New Music
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Esta página está en construcción. Pronto podrás ver canciones recomendadas aquí.
        </p>
        <Link to="/dashboard" style={{ 
          display: 'inline-block',
          marginTop: '2rem',
          backgroundColor: 'var(--accent-green)',
          color: '#000',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default DiscoverPage;