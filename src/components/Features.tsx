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
    <section ref={sectionRef} className="py-16 bg-[var(--background-dark)]">
      <div className="container mx-auto px-4 text-center">
        <h2 
          className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-500 ease-out ${
            headingVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          Why Choose <span className="text-[#04e073]">Chordia</span>
        </h2>
        <p 
          className={`text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto transition-all duration-500 ease-out ${
            subheadingVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          Everything you need to enhance your musical journey
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            ref={setFeatureRef(0)}
            className={`card p-6 rounded-lg shadow-lg transition-all duration-500 ease-out bg-[var(--card-bg)] ${
              visibleItems.includes(0) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <FaBook className="text-4xl mb-4 mx-auto text-[#04e073]" />
            <h3 className="text-xl font-semibold mb-4 text-[#04e073]">
              Extensive Song Catalog
            </h3>
            <p className="text-[var(--text-secondary)]">
              Access thousands of songs with detailed chord progressions and sheet music.
            </p>
          </div>
          <div 
            ref={setFeatureRef(1)}
            className={`card p-6 rounded-lg shadow-lg transition-all duration-500 ease-out bg-[var(--card-bg)] ${
              visibleItems.includes(1) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <FaEdit className="text-4xl mb-4 mx-auto text-[#04e073]" />
            <h3 className="text-xl font-semibold mb-4 text-[#04e073]">
              Custom Compositions
            </h3>
            <p className="text-[var(--text-secondary)]">
              Create and save your own musical arrangements with our intuitive editor.
            </p>
          </div>
          <div 
            ref={setFeatureRef(2)}
            className={`card p-6 rounded-lg shadow-lg transition-all duration-500 ease-out bg-[var(--card-bg)] ${
              visibleItems.includes(2) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <FaGraduationCap className="text-4xl mb-4 mx-auto text-[#04e073]" />
            <h3 className="text-xl font-semibold mb-4 text-[#04e073]">
              Interactive Learning
            </h3>
            <p className="text-[var(--text-secondary)]">
              Learn at your own pace with our interactive tutorials and exercises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;