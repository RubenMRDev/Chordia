import type React from "react"
import { Link } from "react-router-dom"

interface AuthTabsProps {
  activeTab: string
  loginPath: string
  registerPath: string
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, loginPath, registerPath }) => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: "1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Link
        to={loginPath}
        style={{
          flex: 1,
          textDecoration: "none",
          padding: "0.75rem",
          color: activeTab === "login" ? "var(--accent-green)" : "var(--text-secondary)",
          borderBottom: activeTab === "login" ? "2px solid var(--accent-green)" : "none",
          display: "block",
          fontWeight: activeTab === "login" ? "bold" : "normal",
        }}
      >
        Login
      </Link>
      <Link
        to={registerPath}
        style={{
          flex: 1,
          textDecoration: "none",
          padding: "0.75rem",
          color: activeTab === "register" ? "var(--accent-green)" : "var(--text-secondary)",
          borderBottom: activeTab === "register" ? "2px solid var(--accent-green)" : "none",
          display: "block",
          fontWeight: activeTab === "register" ? "bold" : "normal",
        }}
      >
        Register
      </Link>
    </div>
  )
}
