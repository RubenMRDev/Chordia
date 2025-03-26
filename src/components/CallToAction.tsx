import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Start Your Musical Journey Today
        </h2>
        <p style={{ 
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          maxWidth: '700px',
          margin: '0 auto 2rem'
        }}>
          Join thousands of musicians who are already creating and learning with Chordia
        </p>
        <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started Free</Link>
      </div>
    </section>
  );
};

export default CallToAction;