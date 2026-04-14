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
    <section className={`relative section ${className}`} data-testid="hero-component">
      <div className="container">
        <div className="relative glass-panel hero__content overflow-hidden">
          <div className="hero__background" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen', opacity: 0.25 }} />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[rgba(226,235,255,0.8)]">
              <span className="h-2 w-2 rounded-full bg-[#7bffbb]" />
              AI-Powered Music Companion
            </div>
            <h1 className="font-bold">{title}</h1>
            <p className="max-w-2xl leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/register" className="btn btn-primary no-underline text-base sm:text-lg">
                {callToAction}
              </Link>
              <Link to="/demo" className="btn btn-secondary text-base sm:text-lg">
                Watch Demo
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 pt-4 text-sm text-[rgba(226,235,255,0.7)]">
              <div className="glass-card inline-flex items-center px-4 py-2 sm:px-5 sm:py-3">
                Guided practice journeys
              </div>
              <div className="glass-card inline-flex items-center px-4 py-2 sm:px-5 sm:py-3">
                Real-time chord analysis
              </div>
              <div className="glass-card inline-flex items-center px-4 py-2 sm:px-5 sm:py-3">
                Personalized feedback
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
