import type React from "react"

interface AuthErrorProps {
  error: string | null
  onDismiss: () => void
}

export const AuthError: React.FC<AuthErrorProps> = ({ error, onDismiss }) => {
  if (!error) return null

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        color: "#ff6b6b",
        padding: "0.75rem",
        borderRadius: "4px",
        marginBottom: "1rem",
        fontSize: "0.875rem",
      }}
    >
      {error}
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          color: "#ff6b6b",
          marginLeft: "0.5rem",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ×
      </button>
    </div>
  )
}
