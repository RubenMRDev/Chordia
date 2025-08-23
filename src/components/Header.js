"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMusic } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
const Header = () => {
    const { currentUser, userProfile } = useAuth();
    const [_activeLink, setActiveLink] = useState(null);
    const location = useLocation();
    const handleLinkClick = (path) => {
        setActiveLink(path);
    };
    return (_jsx("div", { className: "w-full mt-0", children: _jsxs("header", { className: "w-full px-6 sm:px-8 md:px-16 py-4 md:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-white/10 bg-[var(--background-darker)] text-[var(--text-primary)]", children: [_jsxs("div", { className: "flex justify-between items-center w-full sm:w-auto", children: [_jsxs(Link, { to: "/", className: "flex items-center no-underline text-white font-bold text-xl sm:text-2xl", children: [_jsx(FaMusic, { className: "mr-3 text-[var(--accent-green)]" }), "Chordia"] }), _jsx("div", { className: "flex sm:hidden items-center", children: currentUser ? (_jsx(Link, { to: "/profile", children: _jsx("img", { src: userProfile?.photoURL || currentUser?.photoURL || "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp", alt: "Profile", className: "w-10 h-10 rounded-full object-cover", onError: (e) => {
                                        e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
                                    } }) })) : (_jsx(Link, { to: "/login", className: "py-2 px-4 text-sm bg-[var(--accent-green)] text-black rounded font-bold no-underline", children: "Sign In" })) })] }), _jsx("nav", { className: "flex justify-center text-base sm:text-lg py-4 sm:py-0 w-full sm:w-auto", children: _jsxs("div", { className: "flex space-x-6 sm:space-x-8 md:space-x-12", children: [_jsx(Link, { to: "/discover", onClick: () => handleLinkClick("/discover"), className: `no-underline font-bold ${location.pathname === "/discover" ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]"}`, children: "Discover" }), _jsx(Link, { to: "/library", onClick: () => handleLinkClick("/library"), className: `no-underline font-bold ${location.pathname === "/library" ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]"}`, children: "Library" }), _jsx(Link, { to: "/dashboard", onClick: () => handleLinkClick("/dashboard"), className: `no-underline font-bold ${location.pathname === "/dashboard" ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]"}`, children: "Dashboard" })] }) }), _jsx("div", { className: "hidden sm:flex items-center gap-6 pr-4", children: currentUser ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/profile", className: "hidden md:block no-underline text-[var(--text-primary)] font-bold", children: userProfile?.displayName || currentUser.displayName }), _jsx(Link, { to: "/profile", children: _jsx("img", { src: userProfile?.photoURL || currentUser.photoURL || "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp", alt: "Profile", className: "w-10 h-10 md:w-12 md:h-12 rounded-full object-cover", onError: (e) => {
                                        e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
                                    } }) })] })) : (_jsx(Link, { to: "/login", className: "py-3 px-6 bg-[var(--accent-green)] text-black rounded font-bold no-underline", children: "Sign In" })) })] }) }));
};
export default Header;
