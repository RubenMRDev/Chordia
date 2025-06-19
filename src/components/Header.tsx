"use client";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMusic } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
const Header: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [_activeLink, setActiveLink] = useState<string | null>(null);
  const location = useLocation();
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };
  return (
    <div className="w-full mt-0">
      <header className="w-full px-6 sm:px-8 md:px-16 py-4 md:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-white/10 bg-[var(--background-darker)] text-[var(--text-primary)]">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <Link
        to="/"
        className="flex items-center no-underline text-white font-bold text-xl sm:text-2xl"
          >
        <FaMusic className="mr-3 text-[var(--accent-green)]" />
        Chordia
          </Link>
          <div className="flex sm:hidden items-center">
        {currentUser ? (
          <Link to="/profile">
            <img
              src={userProfile?.photoURL || currentUser?.photoURL || "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
              }}
            />
          </Link>
        ) : (
          <Link
            to="/login"
            className="py-2 px-4 text-sm bg-[var(--accent-green)] text-black rounded font-bold no-underline"
          >
            Sign In
          </Link>
        )}
          </div>
        </div>
        <nav className="flex justify-center text-base sm:text-lg py-4 sm:py-0 w-full sm:w-auto">
          <div className="flex space-x-6 sm:space-x-8 md:space-x-12">
        <Link
          to="/discover"
          onClick={() => handleLinkClick("/discover")}
          className={`no-underline font-bold ${
            location.pathname === "/discover" ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]"
          }`}
        >
          Discover
        </Link>
        <Link
          to="/library"
          onClick={() => handleLinkClick("/library")}
          className={`no-underline font-bold ${
            location.pathname === "/library" ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]"
          }`}
        >
          Library
        </Link>
        <Link
          to="/dashboard"
          onClick={() => handleLinkClick("/dashboard")}
          className={`no-underline font-bold ${
            location.pathname === "/dashboard" ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]"
          }`}
        >
          Dashboard
        </Link>
          </div>
        </nav>
        <div className="hidden sm:flex items-center gap-6 pr-4">
          {currentUser ? (
        <>
          <Link
            to="/profile"
            className="hidden md:block no-underline text-[var(--text-primary)] font-bold"
          >
            {userProfile?.displayName || currentUser.displayName}
          </Link>
          <Link to="/profile">
            <img
              src={userProfile?.photoURL || currentUser.photoURL || "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp"}
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
              }}
            />
          </Link>
        </>
          ) : (
        <Link
          to="/login"
          className="py-3 px-6 bg-[var(--accent-green)] text-black rounded font-bold no-underline"
        >
          Sign In
        </Link>
          )}
        </div>
      </header>
    </div>
  );
};
export default Header;