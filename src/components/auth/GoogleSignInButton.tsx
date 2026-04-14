import type React from "react"
import { FaGoogle } from "react-icons/fa"

interface GoogleSignInButtonProps {
  onClick: () => void
  isLoading: boolean
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, isLoading }) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }}></div>
        <span style={{ padding: "0 1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Or continue with
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }}></div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={onClick}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
            color: "var(--text-primary)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <FaGoogle /> Continue with Google
        </button>
      </div>
    </div>
  )
}
