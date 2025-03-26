import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--background-darker)',
      padding: '4rem 0 2rem'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Product</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Pricing</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Tutorials</a></li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Company</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Careers</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Resources</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Blog</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Community</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Follow Us</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><FaTwitter /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><FaFacebook /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><FaInstagram /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><FaYoutube /></a>
            </div>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          &copy; 2023 Chordia. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;