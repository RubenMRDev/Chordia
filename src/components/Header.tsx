"use client";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMusic } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
const Header: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const location = useLocation();
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };
  return (
    <header
      style={{
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "var(--background-darker)",
        color: "var(--text-primary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.25rem",
            marginRight: "5rem", 
          }}
        >
          <FaMusic style={{ marginRight: "0.5rem", color: "var(--accent-green)" }} />
          Chordia
        </Link>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          <Link
            to="/discover"
            onClick={() => handleLinkClick("/discover")}
            style={{
              textDecoration: "none",
              color: location.pathname === "/discover" ? "var(--accent-green)" : "var(--text-primary)",
              fontWeight: "bold",
            }}
          >
            Discover
          </Link>
          <Link
            to="/library"
            onClick={() => handleLinkClick("/library")}
            style={{
              textDecoration: "none",
              color: location.pathname === "/library" ? "var(--accent-green)" : "var(--text-primary)",
              fontWeight: "bold",
            }}
          >
            Library
          </Link>
          <Link
            to="/dashboard"
            onClick={() => handleLinkClick("/dashboard")}
            style={{
              textDecoration: "none",
              color: location.pathname === "/dashboard" ? "var(--accent-green)" : "var(--text-primary)",
              fontWeight: "bold",
            }}
          >
            Stage
          </Link>
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {currentUser ? (
          <>
            <Link
              to="/profile"
              style={{
                textDecoration: "none",
                color: "var(--text-primary)",
                fontWeight: "bold",
              }}
            >
              {userProfile?.displayName || currentUser.displayName}
            </Link>
            <img
              src={userProfile?.photoURL || currentUser.photoURL || "/default-avatar.png"}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </>
        ) : (
          <Link
            to="/login"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--accent-green)",
              color: "#000",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
export default Header;