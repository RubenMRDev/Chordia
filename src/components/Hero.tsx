import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';

const Hero: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-[var(--background-darker)]">
      <div className="absolute top-0 right-0 w-full h-full bg-cover bg-center opacity-50 z-0"
           style={{
             backgroundImage: `url("https://res.cloudinary.com/doy4x4chv/image/upload/v1742986249/hero-music_kpdnh2.webp")`
           }}>
      </div>
      <div className="container">
        <div className="max-w-[600px] relative z-10">
          <h1 className="text-[3.5rem] font-bold leading-tight mb-4">
            Master Piano <br />with <span className="text-[var(--accent-green)]">Chordia</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
            Learn, create, and explore music like never before. Access chord 
            progressions, create custom sheets, and develop your musical journey with 
            our innovative platform.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="btn btn-primary no-underline">Try it Free</Link>
            <a href="#" className="btn btn-secondary">Watch Demo</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;