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
    return (_jsx("section", { ref: sectionRef, className: "section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "experience-grid", children: [_jsxs("div", { className: "glass-panel", style: slideInStyle(isVisible), children: [_jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6 md:mb-8", children: ["Experience Music ", _jsx("span", { className: "text-[#7bffbb]", children: "Like Never Before" })] }), _jsxs("div", { className: "feature-detail mb-6 rounded-2xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl", "data-index": "0", style: {
                                    ...slideInStyle(detailsVisible[0]),
                                    transitionDelay: '0.2s'
                                }, children: [_jsxs("h3", { className: "text-xl font-semibold mb-2 text-white", children: [_jsx("span", { className: "text-[#7bffbb]", children: "Real-time" }), " Chord Recognition"] }), _jsx("p", { className: "text-[rgba(226,235,255,0.7)]", children: "Instantly see chord names and progressions as you play." })] }), _jsxs("div", { className: "feature-detail mb-6 rounded-2xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl", "data-index": "1", style: {
                                    ...slideInStyle(detailsVisible[1]),
                                    transitionDelay: '0.4s'
                                }, children: [_jsxs("h3", { className: "text-xl font-semibold mb-2 text-white", children: [_jsx("span", { className: "text-[#7bffbb]", children: "Smart" }), " Practice Tools"] }), _jsxs("p", { className: "text-[rgba(226,235,255,0.7)]", children: ["Track your progress and get ", _jsx("span", { className: "text-[#7bffbb]", children: "personalized" }), " recommendations."] })] }), _jsxs("div", { className: "feature-detail rounded-2xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl", "data-index": "2", style: {
                                    ...slideInStyle(detailsVisible[2]),
                                    transitionDelay: '0.6s'
                                }, children: [_jsxs("h3", { className: "text-xl font-semibold mb-2 text-white", children: [_jsx("span", { className: "text-[#7bffbb]", children: "Community" }), " Sharing"] }), _jsxs("p", { className: "text-[rgba(226,235,255,0.7)]", children: ["Share your arrangements and ", _jsx("span", { className: "text-[#7bffbb]", children: "collaborate" }), " with other musicians."] })] })] }), _jsx("div", { className: "glass-panel overflow-hidden", style: slideInRightStyle(imageVisible), children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#7bffbb]/20 via-transparent to-[#66d9ff]/25 blur-3xl" }), _jsx("img", { src: "https://res.cloudinary.com/doy4x4chv/image/upload/v1743115656/Screenshot_2025-03-27_234752_ufhij8.png", alt: "Chordia App", className: "relative z-10 w-full rounded-[26px] border border-white/10" })] }) })] }) }) }));
};
export default Experience;
