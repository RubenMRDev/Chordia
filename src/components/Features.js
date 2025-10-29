import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { FaBook, FaEdit, FaGraduationCap } from 'react-icons/fa';
const Features = () => {
    const [visibleItems, setVisibleItems] = useState([]);
    const featureRefs = useRef([null, null, null]);
    const sectionRef = useRef(null);
    const [headingVisible, setHeadingVisible] = useState(false);
    const [subheadingVisible, setSubheadingVisible] = useState(false);
    const setFeatureRef = (index) => (el) => {
        featureRefs.current[index] = el;
    };
    useEffect(() => {
        const observers = [];
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
    return (_jsx("section", { ref: sectionRef, className: "section", children: _jsxs("div", { className: "container text-center", children: [_jsxs("h2", { className: `text-3xl md:text-5xl font-bold mb-4 transition-all duration-500 ease-out ${headingVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'}`, children: ["Why Choose ", _jsx("span", { className: "text-[#7bffbb]", children: "Chordia" })] }), _jsx("div", { className: "glass-divider" }), _jsx("p", { className: `text-[rgba(226,235,255,0.7)] mb-12 max-w-2xl mx-auto transition-all duration-500 ease-out ${subheadingVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'}`, children: "Everything you need to enhance your musical journey" }), _jsxs("div", { className: "features-grid", children: [_jsxs("div", { ref: setFeatureRef(0), className: `glass-card h-full transition-all duration-500 ease-out ${visibleItems.includes(0)
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-12'}`, children: [_jsx("div", { className: "feature-icon mx-auto", children: _jsx(FaBook, {}) }), _jsx("h3", { className: "text-xl font-semibold mb-3 text-[#7bffbb]", children: "Extensive Song Catalog" }), _jsx("p", { className: "text-[rgba(226,235,255,0.7)]", children: "Access thousands of songs with detailed chord progressions and sheet music." })] }), _jsxs("div", { ref: setFeatureRef(1), className: `glass-card h-full transition-all duration-500 ease-out ${visibleItems.includes(1)
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-12'}`, children: [_jsx("div", { className: "feature-icon mx-auto", children: _jsx(FaEdit, {}) }), _jsx("h3", { className: "text-xl font-semibold mb-3 text-[#7bffbb]", children: "Custom Compositions" }), _jsx("p", { className: "text-[rgba(226,235,255,0.7)]", children: "Create and save your own musical arrangements with our intuitive editor." })] }), _jsxs("div", { ref: setFeatureRef(2), className: `glass-card h-full transition-all duration-500 ease-out ${visibleItems.includes(2)
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-12'}`, children: [_jsx("div", { className: "feature-icon mx-auto", children: _jsx(FaGraduationCap, {}) }), _jsx("h3", { className: "text-xl font-semibold mb-3 text-[#7bffbb]", children: "Interactive Learning" }), _jsx("p", { className: "text-[rgba(226,235,255,0.7)]", children: "Learn at your own pace with our interactive tutorials and exercises." })] })] })] }) }));
};
export default Features;
