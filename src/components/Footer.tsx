import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--background-darker)',
      padding: '4rem 0 2rem'
    }}>
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          &copy; {new Date().getFullYear()} Chordia. All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;