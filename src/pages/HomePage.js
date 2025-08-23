import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Experience from '../components/Experience';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import PianoTest from '../components/PianoTest';
const HomePage = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("main", { children: [_jsx(Hero, {}), _jsx(Features, {}), _jsx(Experience, {}), _jsx(CallToAction, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsx(PianoTest, {}) })] }), _jsx(Footer, {})] }));
};
export default HomePage;
