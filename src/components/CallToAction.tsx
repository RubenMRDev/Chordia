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
    <section ref={sectionRef} className="section">
      <div className="container">
        <div className={`glass-panel cta-wrapper mx-auto max-w-4xl transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Start Your Musical Journey Today
          </h2>
          <p>
            Join thousands of musicians who are already creating and learning with Chordia.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn btn-primary w-full sm:w-auto text-base sm:text-lg">
              Get Started Free
            </Link>
            <Link to="/demo" className="btn btn-secondary w-full sm:w-auto text-base sm:text-lg">
              Watch the Experience
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
