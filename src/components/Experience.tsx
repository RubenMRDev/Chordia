import React, { useEffect, useRef, useState } from 'react';

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState([false, false, false]);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setImageVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const detailsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setDetailsVisible(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      
      const details = sectionRef.current.querySelectorAll('.feature-detail');
      details.forEach(detail => {
        detailsObserver.observe(detail);
      });
    }

    return () => {
      observer.disconnect();
      detailsObserver.disconnect();
    };
  }, []);

  const slideInStyle = (isActive: boolean) => ({
    transform: isActive ? 'translateX(0)' : 'translateX(-50px)',
    opacity: isActive ? 1 : 0,
    transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
  });

  const slideInRightStyle = (isActive: boolean) => ({
    transform: isActive ? 'translateX(0)' : 'translateX(50px)',
    opacity: isActive ? 1 : 0,
    transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
  });

  return (
    <section 
      ref={sectionRef} 
      className="py-20 bg-[var(--background-darker)]"
    >
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 
            className="text-4xl font-bold mb-8"
            style={slideInStyle(isVisible)}
          >
            Experience Music <span className="text-[#04e073]">Like Never Before</span>
          </h2>

          <div 
            className="feature-detail mb-6" 
            data-index="0" 
            style={{ 
              ...slideInStyle(detailsVisible[0]),
              transitionDelay: '0.2s'
            }}
          >
            <h3 className="text-xl font-bold mb-2">
              <span className="text-[#04e073]">Real-time</span> Chord Recognition
            </h3>
            <p className="text-[var(--text-secondary)]">
              Instantly see chord names and progressions as you play.
            </p>
          </div>

          <div 
            className="feature-detail mb-6" 
            data-index="1"
            style={{ 
              ...slideInStyle(detailsVisible[1]),
              transitionDelay: '0.4s'
            }}
          >
            <h3 className="text-xl font-bold mb-2">
              <span className="text-[#04e073]">Smart</span> Practice Tools
            </h3>
            <p className="text-[var(--text-secondary)]">
              Track your progress and get <span className="text-[#04e073]">personalized</span> recommendations.
            </p>
          </div>

          <div 
            className="feature-detail" 
            data-index="2"
            style={{ 
              ...slideInStyle(detailsVisible[2]),
              transitionDelay: '0.6s'
            }}
          >
            <h3 className="text-xl font-bold mb-2">
              <span className="text-[#04e073]">Community</span> Sharing
            </h3>
            <p className="text-[var(--text-secondary)]">
              Share your arrangements and <span className="text-[#04e073]">collaborate</span> with other musicians.
            </p>
          </div>
        </div>

        <div 
          className="relative max-w-xl mx-auto"
          style={slideInRightStyle(imageVisible)}
        >
          <div className="absolute top-0 right-0 w-full h-full z-0"></div>
          <img 
            src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743115656/Screenshot_2025-03-27_234752_ufhij8.png" 
            alt="Chordia App" 
            className="w-full relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default Experience;