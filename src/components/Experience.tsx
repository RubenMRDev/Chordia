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
    <section ref={sectionRef} className="section">
      <div className="container">
        <div className="experience-grid">
          <div className="glass-panel" style={slideInStyle(isVisible)}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
              Experience Music <span className="text-[#7bffbb]">Like Never Before</span>
            </h2>
            <div
              className="feature-detail mb-6 rounded-2xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl"
              data-index="0"
              style={{
                ...slideInStyle(detailsVisible[0]),
                transitionDelay: '0.2s'
              }}
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                <span className="text-[#7bffbb]">Real-time</span> Chord Recognition
              </h3>
              <p className="text-[rgba(226,235,255,0.7)]">
                Instantly see chord names and progressions as you play.
              </p>
            </div>
            <div
              className="feature-detail mb-6 rounded-2xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl"
              data-index="1"
              style={{
                ...slideInStyle(detailsVisible[1]),
                transitionDelay: '0.4s'
              }}
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                <span className="text-[#7bffbb]">Smart</span> Practice Tools
              </h3>
              <p className="text-[rgba(226,235,255,0.7)]">
                Track your progress and get <span className="text-[#7bffbb]">personalized</span> recommendations.
              </p>
            </div>
            <div
              className="feature-detail rounded-2xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl"
              data-index="2"
              style={{
                ...slideInStyle(detailsVisible[2]),
                transitionDelay: '0.6s'
              }}
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                <span className="text-[#7bffbb]">Community</span> Sharing
              </h3>
              <p className="text-[rgba(226,235,255,0.7)]">
                Share your arrangements and <span className="text-[#7bffbb]">collaborate</span> with other musicians.
              </p>
            </div>
          </div>
          <div className="glass-panel overflow-hidden" style={slideInRightStyle(imageVisible)}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#7bffbb]/20 via-transparent to-[#66d9ff]/25 blur-3xl" />
              <img
                src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743115656/Screenshot_2025-03-27_234752_ufhij8.png"
                alt="Chordia App"
                className="relative z-10 w-full rounded-[26px] border border-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Experience;