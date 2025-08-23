import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
const Experience = () => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState([false, false, false]);
    const [imageVisible, setImageVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setImageVisible(true);
                }
            });
        }, { threshold: 0.2 });
        const detailsObserver = new IntersectionObserver((entries) => {
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
        }, { threshold: 0.5 });
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
    const slideInStyle = (isActive) => ({
        transform: isActive ? 'translateX(0)' : 'translateX(-50px)',
        opacity: isActive ? 1 : 0,
        transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
    });
    const slideInRightStyle = (isActive) => ({
        transform: isActive ? 'translateX(0)' : 'translateX(50px)',
        opacity: isActive ? 1 : 0,
        transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
    });
    return (_jsx("section", { ref: sectionRef, className: "py-20 bg-[var(--background-darker)]", children: _jsxs("div", { className: "container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-4xl font-bold mb-8", style: slideInStyle(isVisible), children: ["Experience Music ", _jsx("span", { className: "text-[#04e073]", children: "Like Never Before" })] }), _jsxs("div", { className: "feature-detail mb-6", "data-index": "0", style: {
                                ...slideInStyle(detailsVisible[0]),
                                transitionDelay: '0.2s'
                            }, children: [_jsxs("h3", { className: "text-xl font-bold mb-2", children: [_jsx("span", { className: "text-[#04e073]", children: "Real-time" }), " Chord Recognition"] }), _jsx("p", { className: "text-[var(--text-secondary)]", children: "Instantly see chord names and progressions as you play." })] }), _jsxs("div", { className: "feature-detail mb-6", "data-index": "1", style: {
                                ...slideInStyle(detailsVisible[1]),
                                transitionDelay: '0.4s'
                            }, children: [_jsxs("h3", { className: "text-xl font-bold mb-2", children: [_jsx("span", { className: "text-[#04e073]", children: "Smart" }), " Practice Tools"] }), _jsxs("p", { className: "text-[var(--text-secondary)]", children: ["Track your progress and get ", _jsx("span", { className: "text-[#04e073]", children: "personalized" }), " recommendations."] })] }), _jsxs("div", { className: "feature-detail", "data-index": "2", style: {
                                ...slideInStyle(detailsVisible[2]),
                                transitionDelay: '0.6s'
                            }, children: [_jsxs("h3", { className: "text-xl font-bold mb-2", children: [_jsx("span", { className: "text-[#04e073]", children: "Community" }), " Sharing"] }), _jsxs("p", { className: "text-[var(--text-secondary)]", children: ["Share your arrangements and ", _jsx("span", { className: "text-[#04e073]", children: "collaborate" }), " with other musicians."] })] })] }), _jsxs("div", { className: "relative max-w-xl mx-auto", style: slideInRightStyle(imageVisible), children: [_jsx("div", { className: "absolute top-0 right-0 w-full h-full z-0" }), _jsx("img", { src: "https://res.cloudinary.com/doy4x4chv/image/upload/v1743115656/Screenshot_2025-03-27_234752_ufhij8.png", alt: "Chordia App", className: "w-full relative z-10" })] })] }) }));
};
export default Experience;
