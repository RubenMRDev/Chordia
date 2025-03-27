import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { FaMusic, FaSearch } from 'react-icons/fa';
const DiscoverPage: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: 'var(--background-darker)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      <Header />
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