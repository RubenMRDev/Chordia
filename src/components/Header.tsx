"use client";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaMusic, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const navigationLinks = [
  { label: "Discover", path: "/discover" },
  { label: "Library", path: "/library" },
  { label: "Dashboard", path: "/dashboard" }
];

const Header: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="w-full pt-6">
      <div className="container">
        <header className="glass-panel border-white/10 px-4 sm:px-6 md:px-10 py-4 md:py-5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-6">
          <Link
            to="/"
            className="flex items-center gap-3 no-underline text-white font-semibold text-xl sm:text-2xl tracking-tight"
            aria-label="Ir a inicio"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#7bffbb]/60 to-[#66d9ff]/60 text-[#070b15] shadow-lg shadow-[#7bffbb]/20">
              <FaMusic />
            </span>
            <span>Chordia</span>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition md:hidden"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {navigationLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-semibold tracking-wide no-underline transition-colors duration-300 ${
                    isActive ? "text-[#7bffbb]" : "text-[rgba(230,240,255,0.8)] hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-[#7bffbb] to-[#66d9ff]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="no-underline text-[rgba(230,240,255,0.85)] font-medium hover:text-white transition"
                >
                  {userProfile?.displayName || currentUser.displayName}
                </Link>
                <Link to="/profile" className="relative block h-12 w-12">
                  <img
                    src={
                      userProfile?.photoURL ||
                      currentUser.photoURL ||
                      "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp"
                    }
                    alt="Perfil"
                    className="h-12 w-12 rounded-full object-cover shadow-lg shadow-black/40"
                    onError={(e) => {
                      e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
                    }}
                  />
                  <span className="absolute inset-0 rounded-full border border-white/20" />
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="mt-5 flex flex-col gap-5 border-t border-white/10 pt-5 md:hidden">
            <nav className="flex flex-col gap-3">
              {navigationLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`glass-card px-4 py-3 no-underline text-base font-semibold transition duration-200 ${
                      isActive ? "text-[#7bffbb]" : "text-[rgba(230,240,255,0.85)] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center justify-between gap-4">
              {currentUser ? (
                <Link to="/profile" className="flex items-center gap-3 no-underline text-[rgba(230,240,255,0.85)]">
                  <img
                    src={
                      userProfile?.photoURL ||
                      currentUser?.photoURL ||
                      "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp"
                    }
                    alt="Perfil"
                    className="h-11 w-11 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
                    }}
                  />
                  <span className="font-medium">{userProfile?.displayName || currentUser?.displayName}</span>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary w-full text-center">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
        </header>
      </div>
    </div>
  );
};

export default Header;
