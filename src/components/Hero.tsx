import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  title?: string;
  subtitle?: string;
  callToAction?: string;
  backgroundImage?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = 'Master Piano with Chordia',
  subtitle = 'Learn, create, and explore music like never before.',
  callToAction = 'Try it Free',
  backgroundImage = 'https://res.cloudinary.com/doy4x4chv/image/upload/v1742986249/hero-music_kpdnh2.webp',
  className = ''
}) => {
  return (
    <section className={`relative py-20 overflow-hidden bg-[var(--background-darker)] ${className}`} data-testid="hero-component">
      <div
        className="absolute top-0 right-0 w-full h-full bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        data-testid="hero-background"
      ></div>
      <div className="container">
        <div className="max-w-[600px] relative z-10">
          <h1 className="text-[3.5rem] font-bold leading-tight mb-4">{title}</h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">{subtitle}</p>
          <div className="flex gap-4">
            <Link to="/register" className="btn btn-primary no-underline">{callToAction}</Link>
            <Link to="/demo" className="btn btn-secondary">Watch Demo</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;