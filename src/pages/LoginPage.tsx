"use client"
import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEnvelope, FaLock } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { AuthContainer } from "../components/auth/AuthContainer"
import { AuthTabs } from "../components/auth/AuthTabs"
import { AuthError } from "../components/auth/AuthError"
import { AuthInputField } from "../components/auth/AuthInputField"
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton"
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login, signInWithGoogle, error, setError } = useAuth()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await login(email, password)
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      navigate("/dashboard")
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <AuthContainer>
      <AuthTabs activeTab="login" loginPath="/login" registerPath="/register" />
      <AuthError error={error} onDismiss={() => setError(null)} />
      <form onSubmit={handleSubmit}>
        <AuthInputField
          icon={FaEnvelope}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          required
        />
        <AuthInputField
          icon={FaLock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          required
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              style={{ marginRight: "0.5rem" }}
            />
            Remember me
          </label>
          <a
            href="#"
            style={{
              color: "var(--accent-green)",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "var(--accent-green)",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            marginBottom: "1.5rem",
          }}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={isLoading} />
      <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "var(--accent-green)", textDecoration: "none" }}>
          Create account
        </Link>
      </div>
    </AuthContainer>
  )
}
export default LoginPage
