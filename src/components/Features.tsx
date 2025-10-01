import React, { useState, useEffect, useRef } from 'react';
import { FaBook, FaEdit, FaGraduationCap } from 'react-icons/fa';
const Features: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [subheadingVisible, setSubheadingVisible] = useState(false);
  const setFeatureRef = (index: number) => (el: HTMLDivElement | null) => {
    featureRefs.current[index] = el;
  };
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if (typeof window !== 'undefined') {
      if (sectionRef.current) {
        const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHeadingVisible(true);
              setTimeout(() => {
                setSubheadingVisible(true);
              }, 300);
              sectionObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        sectionObserver.observe(sectionRef.current);
        observers.push(sectionObserver);
      }
      featureRefs.current.forEach((ref, index) => {
        if (ref) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleItems(prev => {
                    if (!prev.includes(index)) {
                      return [...prev, index];
                    }
                    return prev;
                  });
                }, 600 + index * 200);
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });
          observer.observe(ref);
          observers.push(observer);
        }
      });
    }
    return () => {
      observers.forEach(observer => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);
  return (
    <section ref={sectionRef} className="section">
      <div className="container text-center">
        <h2
          className={`text-3xl md:text-5xl font-bold mb-4 transition-all duration-500 ease-out ${
            headingVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          Why Choose <span className="text-[#7bffbb]">Chordia</span>
        </h2>
        <div className="glass-divider" />
        <p
          className={`text-[rgba(226,235,255,0.7)] mb-12 max-w-2xl mx-auto transition-all duration-500 ease-out ${
            subheadingVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          Everything you need to enhance your musical journey
        </p>
        <div className="features-grid">
          <div
            ref={setFeatureRef(0)}
            className={`glass-card h-full transition-all duration-500 ease-out ${
              visibleItems.includes(0)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="feature-icon mx-auto">
              <FaBook />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#7bffbb]">
              Extensive Song Catalog
            </h3>
            <p className="text-[rgba(226,235,255,0.7)]">
              Access thousands of songs with detailed chord progressions and sheet music.
            </p>
          </div>
          <div
            ref={setFeatureRef(1)}
            className={`glass-card h-full transition-all duration-500 ease-out ${
              visibleItems.includes(1)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="feature-icon mx-auto">
              <FaEdit />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#7bffbb]">
              Custom Compositions
            </h3>
            <p className="text-[rgba(226,235,255,0.7)]">
              Create and save your own musical arrangements with our intuitive editor.
            </p>
          </div>
          <div
            ref={setFeatureRef(2)}
            className={`glass-card h-full transition-all duration-500 ease-out ${
              visibleItems.includes(2)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="feature-icon mx-auto">
              <FaGraduationCap />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#7bffbb]">
              Interactive Learning
            </h3>
            <p className="text-[rgba(226,235,255,0.7)]">
              Learn at your own pace with our interactive tutorials and exercises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;