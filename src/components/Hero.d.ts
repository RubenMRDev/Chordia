import React from 'react';
interface HeroProps {
    title?: string;
    subtitle?: string;
    callToAction?: string;
    backgroundImage?: string;
    className?: string;
}
declare const Hero: React.FC<HeroProps>;
export default Hero;
