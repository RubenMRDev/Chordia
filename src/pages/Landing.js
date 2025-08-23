import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Experience from '../components/Experience';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import LandingLayout from '../components/LandingLayout';
const Landing = () => {
    return (_jsxs(LandingLayout, { children: [_jsx(Header, {}), _jsxs("main", { children: [_jsx(Hero, {}), _jsx(Features, {}), _jsx(Experience, {}), _jsx(CallToAction, {})] }), _jsx(Footer, {})] }));
};
export default Landing;
