"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaMusic, FaEnvelope, FaLock, FaUser, FaGoogle, FaFacebook, FaApple } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [activeTab, setActiveTab] = useState("register")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { register, signInWithGoogle, signInWithFacebook, error, setError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy")
      return
    }

    try {
      setIsLoading(true)
      await register(email, password, name)
      navigate("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
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

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithFacebook()
      navigate("/dashboard")
    } catch (error) {
      console.error("Facebook sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: "var(--background-darker)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
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
        <div style={{ marginBottom: "1.5rem" }}>
          <FaMusic style={{ fontSize: "2rem", color: "var(--accent-green)" }} />
        </div>

        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Welcome to Chordia</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Your creative journey begins here</p>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            marginBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Link
            to="/login"
            style={{
              flex: 1,
              textDecoration: "none",
              padding: "0.75rem",
              color: "var(--text-secondary)",
              display: "block",
            }}
          >
            Login
          </Link>
          <button
            onClick={() => setActiveTab("register")}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "0.75rem",
              color: activeTab === "register" ? "var(--accent-green)" : "var(--text-secondary)",
              borderBottom: activeTab === "register" ? "2px solid var(--accent-green)" : "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {error && (
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
              onClick={() => setError(null)}
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
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              position: "relative",
              marginBottom: "1rem",
            }}
          >
            <FaUser
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
              }}
            />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          <div
            style={{
              position: "relative",
              marginBottom: "1rem",
            }}
          >
            <FaEnvelope
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
              }}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          <div
            style={{
              position: "relative",
              marginBottom: "1rem",
            }}
          >
            <FaLock
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
            }}
          >
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              style={{ marginRight: "0.5rem", marginTop: "0.25rem" }}
              required
            />
            <label
              htmlFor="terms"
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              I agree to the{" "}
              <a href="#" style={{ color: "var(--accent-green)" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" style={{ color: "var(--accent-green)" }}>
                Privacy Policy
              </a>
            </label>
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Social Login */}
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

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.5rem",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <FaGoogle />
            </button>

            <button
              onClick={handleFacebookSignIn}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.5rem",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <FaFacebook />
            </button>

            <button
              style={{
                flex: 1,
                padding: "0.5rem",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <FaApple />
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-green)", textDecoration: "none" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

