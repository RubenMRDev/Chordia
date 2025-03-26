import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header style={{ 
      backgroundColor: 'var(--background-darker)', 
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--text-primary)' }}>
            <FaMusic style={{ color: 'var(--accent-green)', marginRight: '0.5rem' }} />
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Chordia</span>
          </Link>
        </div>
        <div>
          <Link to="/login" style={{ 
            color: 'var(--text-primary)', 
            marginRight: '1rem',
            textDecoration: 'none'
          }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;