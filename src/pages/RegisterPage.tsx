"use client"
import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { AuthContainer } from "../components/auth/AuthContainer"
import { AuthTabs } from "../components/auth/AuthTabs"
import { AuthError } from "../components/auth/AuthError"
import { AuthInputField } from "../components/auth/AuthInputField"
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton"
const RegisterPage: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register, signInWithGoogle, error, setError } = useAuth()
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
  return (
    <AuthContainer>
      <AuthTabs activeTab="register" loginPath="/login" registerPath="/register" />
      <AuthError error={error} onDismiss={() => setError(null)} />
      <form onSubmit={handleSubmit}>
        <AuthInputField
          icon={FaUser}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={setName}
          required
        />
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
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ marginRight: "0.5rem", marginTop: "0.25rem" }}
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
          data-testid="create-account-button"
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
      <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={isLoading} />
      <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--accent-green)", textDecoration: "none" }}>
          Sign in
        </Link>
      </div>
    </AuthContainer>
  )
}
export default RegisterPage
