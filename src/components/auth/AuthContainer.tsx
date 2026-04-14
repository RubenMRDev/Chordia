import type React from "react"
import { Link } from "react-router-dom"
import { FaMusic, FaArrowLeft } from "react-icons/fa"

interface AuthContainerProps {
  children: React.ReactNode
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--background-darker)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        position: "relative",
      }}
    >
      <Link
        to="/"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "var(--text-primary)",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          padding: "0.5rem 0.75rem",
          borderRadius: "4px",
          transition: "background-color 0.3s ease",
        }}
      >
        <FaArrowLeft /> Go Back
      </Link>
      <div
        style={{
          backgroundColor: "#1a2332",
          borderRadius: "8px",
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <div style={{ 
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <FaMusic style={{ fontSize: "2rem", color: "var(--accent-green)" }} />
        </div>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Welcome to Chordia</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Your creative journey begins here</p>
        {children}
      </div>
    </div>
  )
}
