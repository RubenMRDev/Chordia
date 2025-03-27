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
    <section ref={sectionRef} className="section" style={{ 
      backgroundColor: 'var(--background-darker)',
      padding: '5rem 0'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '2rem',
            ...slideInStyle(isVisible)
          }}>
            Experience Music Like Never Before
          </h2>

          <div className="feature-detail" data-index="0" style={{ 
            marginBottom: '1.5rem',
            ...slideInStyle(detailsVisible[0]),
            transitionDelay: '0.2s'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Real-time Chord Recognition
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Instantly see chord names and progressions as you play.
            </p>
          </div>

          <div className="feature-detail" data-index="1" style={{ 
            marginBottom: '1.5rem',
            ...slideInStyle(detailsVisible[1]),
            transitionDelay: '0.4s'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Smart Practice Tools
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Track your progress and get personalized recommendations.
            </p>
          </div>

          <div className="feature-detail" data-index="2" style={{ 
            ...slideInStyle(detailsVisible[2]),
            transitionDelay: '0.6s'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Community Sharing
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Share your arrangements and collaborate with other musicians.
            </p>
          </div>
        </div>

        <div style={{ 
          position: 'relative',
          maxWidth: '500px',
          margin: '0 auto',
          ...slideInRightStyle(imageVisible)
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}></div>
          <img 
            src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743115656/Screenshot_2025-03-27_234752_ufhij8.png" 
            alt="Chordia App" 
            style={{
              width: '100%',
              position: 'relative',
              zIndex: 1
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Experience;