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
    return (_jsxs("section", { ref: sectionRef, className: "py-12 md:py-16 lg:py-20 text-center", children: [_jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h2", { className: `text-3xl md:text-4xl lg:text-5xl font-bold mb-4 slide-up ${isVisible ? 'animate' : ''}`, style: {
                            opacity: 0,
                            transform: 'translateY(40px)',
                            transition: 'opacity 0.5s ease, transform 0.5s ease',
                            transitionDelay: '0.1s'
                        }, children: "Start Your Musical Journey Today" }), _jsx("p", { className: `text-base md:text-lg text-gray-600 max-w-md md:max-w-xl lg:max-w-2xl mx-auto mb-8 slide-up ${isVisible ? 'animate' : ''}`, style: {
                            opacity: 0,
                            transform: 'translateY(40px)',
                            transition: 'opacity 0.5s ease, transform 0.5s ease',
                            transitionDelay: '0.3s'
                        }, children: "Join thousands of musicians who are already creating and learning with Chordia" }), _jsx(Link, { to: "/register", className: `inline-block px-6 py-3 font-medium rounded-md hover:shadow-lg transition-all duration-300 slide-up ${isVisible ? 'animate' : ''}`, style: {
                            backgroundColor: '#04e073',
                            color: 'black',
                            opacity: 0,
                            transform: 'translateY(40px)',
                            transition: 'opacity 0.5s ease, transform 0.5s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                            transitionDelay: '0.5s',
                            textDecoration: 'none'
                        }, onMouseOver: (e) => {
                            e.currentTarget.style.backgroundColor = '#03b061';
                        }, onMouseOut: (e) => {
                            e.currentTarget.style.backgroundColor = '#04e073';
                        }, children: "Get Started Free" })] }), _jsx("style", { children: `
        .slide-up.animate {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      ` })] }));
};
export default CallToAction;
