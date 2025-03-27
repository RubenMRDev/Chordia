import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <h2 
          className={`slide-up ${isVisible ? 'animate' : ''}`} 
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '1rem',
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            transitionDelay: '0.1s'
          }}
        >
          Start Your Musical Journey Today
        </h2>
        <p 
          className={`slide-up ${isVisible ? 'animate' : ''}`} 
          style={{ 
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            transitionDelay: '0.3s'
          }}
        >
          Join thousands of musicians who are already creating and learning with Chordia
        </p>
        <Link 
          to="/register" 
          className={`btn btn-primary slide-up ${isVisible ? 'animate' : ''}`} 
          style={{ 
            textDecoration: 'none',
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            transitionDelay: '0.5s',
            display: 'inline-block'
          }}
        >
          Get Started Free
        </Link>
      </div>

      <style>{`
        .slide-up.animate {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default CallToAction;