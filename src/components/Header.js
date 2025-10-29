"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaMusic, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
const navigationLinks = [
    { label: "Discover", path: "/discover" },
    { label: "Library", path: "/library" },
    { label: "Dashboard", path: "/dashboard" }
];
const Header = () => {
    const { currentUser, userProfile } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);
    return (_jsx("div", { className: "w-full pt-6", children: _jsx("div", { className: "container", children: _jsxs("header", { className: "glass-panel border-white/10 px-4 sm:px-6 md:px-10 py-4 md:py-5 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between gap-6", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-3 no-underline text-white font-semibold text-xl sm:text-2xl tracking-tight", "aria-label": "Ir a inicio", children: [_jsx("span", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#7bffbb]/60 to-[#66d9ff]/60 text-[#070b15] shadow-lg shadow-[#7bffbb]/20", children: _jsx(FaMusic, {}) }), _jsx("span", { children: "Chordia" })] }), _jsx("button", { type: "button", className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition md:hidden", onClick: () => setMenuOpen(prev => !prev), "aria-label": "Abrir men\u00FA", children: menuOpen ? _jsx(FaTimes, { className: "text-lg" }) : _jsx(FaBars, { className: "text-lg" }) }), _jsx("nav", { className: "hidden md:flex items-center gap-10", children: navigationLinks.map(link => {
                                    const isActive = location.pathname === link.path;
                                    return (_jsxs(Link, { to: link.path, className: `relative font-semibold tracking-wide no-underline transition-colors duration-300 ${isActive ? "text-[#7bffbb]" : "text-[rgba(230,240,255,0.8)] hover:text-white"}`, children: [link.label, isActive && (_jsx("span", { className: "absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-[#7bffbb] to-[#66d9ff]" }))] }, link.path));
                                }) }), _jsx("div", { className: "hidden md:flex items-center gap-5", children: currentUser ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/profile", className: "no-underline text-[rgba(230,240,255,0.85)] font-medium hover:text-white transition", children: userProfile?.displayName || currentUser.displayName }), _jsxs(Link, { to: "/profile", className: "relative block h-12 w-12", children: [_jsx("img", { src: userProfile?.photoURL ||
                                                        currentUser.photoURL ||
                                                        "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp", alt: "Perfil", className: "h-12 w-12 rounded-full object-cover shadow-lg shadow-black/40", onError: (e) => {
                                                        e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
                                                    } }), _jsx("span", { className: "absolute inset-0 rounded-full border border-white/20" })] })] })) : (_jsx(Link, { to: "/login", className: "btn btn-primary", children: "Sign In" })) })] }), menuOpen && (_jsxs("div", { className: "mt-5 flex flex-col gap-5 border-t border-white/10 pt-5 md:hidden", children: [_jsx("nav", { className: "flex flex-col gap-3", children: navigationLinks.map(link => {
                                    const isActive = location.pathname === link.path;
                                    return (_jsx(Link, { to: link.path, className: `glass-card px-4 py-3 no-underline text-base font-semibold transition duration-200 ${isActive ? "text-[#7bffbb]" : "text-[rgba(230,240,255,0.85)] hover:text-white"}`, children: link.label }, link.path));
                                }) }), _jsx("div", { className: "flex items-center justify-between gap-4", children: currentUser ? (_jsxs(Link, { to: "/profile", className: "flex items-center gap-3 no-underline text-[rgba(230,240,255,0.85)]", children: [_jsx("img", { src: userProfile?.photoURL ||
                                                currentUser?.photoURL ||
                                                "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp", alt: "Perfil", className: "h-11 w-11 rounded-full object-cover", onError: (e) => {
                                                e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
                                            } }), _jsx("span", { className: "font-medium", children: userProfile?.displayName || currentUser?.displayName })] })) : (_jsx(Link, { to: "/login", className: "btn btn-primary w-full text-center", children: "Sign In" })) })] }))] }) }) }));
};
export default Header;
