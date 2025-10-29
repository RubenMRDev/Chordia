import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
const CallToAction = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.2 });
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    return (_jsx("section", { ref: sectionRef, className: "section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: `glass-panel cta-wrapper mx-auto max-w-4xl transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`, children: [_jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-4", children: "Start Your Musical Journey Today" }), _jsx("p", { children: "Join thousands of musicians who are already creating and learning with Chordia." }), _jsxs("div", { className: "flex flex-col items-center justify-center gap-3 sm:flex-row", children: [_jsx(Link, { to: "/register", className: "btn btn-primary w-full sm:w-auto text-base sm:text-lg", children: "Get Started Free" }), _jsx(Link, { to: "/demo", className: "btn btn-secondary w-full sm:w-auto text-base sm:text-lg", children: "Watch the Experience" })] })] }) }) }));
};
export default CallToAction;
