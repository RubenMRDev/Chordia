"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMusic, FaEnvelope, FaLock, FaUser, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [activeTab, setActiveTab] = useState("register");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, signInWithGoogle, error, setError } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreeTerms) {
            setError("You must agree to the Terms of Service and Privacy Policy");
            return;
        }
        try {
            setIsLoading(true);
            await register(email, password, name);
            navigate("/dashboard");
        }
        catch (error) {
            console.error("Registration error:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            await signInWithGoogle();
            navigate("/dashboard");
        }
        catch (error) {
            console.error("Google sign in error:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { style: {
            backgroundColor: "var(--background-darker)",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            position: "relative",
        }, children: [_jsxs(Link, { to: "/", style: {
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
                }, children: [_jsx(FaArrowLeft, {}), " Go Back"] }), _jsxs("div", { style: {
                    backgroundColor: "#1a2332",
                    borderRadius: "8px",
                    padding: "2rem",
                    width: "100%",
                    maxWidth: "400px",
                    textAlign: "center",
                }, children: [_jsx("div", { style: {
                            marginBottom: "1.5rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }, children: _jsx(FaMusic, { style: { fontSize: "2rem", color: "var(--accent-green)" } }) }), _jsx("h1", { style: { fontSize: "1.75rem", marginBottom: "0.5rem" }, children: "Welcome to Chordia" }), _jsx("p", { style: { color: "var(--text-secondary)", marginBottom: "1.5rem" }, children: "Your creative journey begins here" }), _jsxs("div", { style: {
                            display: "flex",
                            marginBottom: "1.5rem",
                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                        }, children: [_jsx(Link, { to: "/login", style: {
                                    flex: 1,
                                    textDecoration: "none",
                                    padding: "0.75rem",
                                    color: "var(--text-secondary)",
                                    display: "block",
                                }, children: "Login" }), _jsx("button", { onClick: () => setActiveTab("register"), style: {
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    padding: "0.75rem",
                                    color: activeTab === "register" ? "var(--accent-green)" : "var(--text-secondary)",
                                    borderBottom: activeTab === "register" ? "2px solid var(--accent-green)" : "none",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }, children: "Register" })] }), error && (_jsxs("div", { style: {
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                            color: "#ff6b6b",
                            padding: "0.75rem",
                            borderRadius: "4px",
                            marginBottom: "1rem",
                            fontSize: "0.875rem",
                        }, children: [error, _jsx("button", { onClick: () => setError(null), style: {
                                    background: "none",
                                    border: "none",
                                    color: "#ff6b6b",
                                    marginLeft: "0.5rem",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }, children: "\u00D7" })] })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: {
                                    position: "relative",
                                    marginBottom: "1rem",
                                }, children: [_jsx(FaUser, { style: {
                                            position: "absolute",
                                            left: "1rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "var(--text-secondary)",
                                        } }), _jsx("input", { type: "text", placeholder: "Full name", value: name, onChange: (e) => setName(e.target.value), style: {
                                            width: "100%",
                                            padding: "0.75rem 1rem 0.75rem 2.5rem",
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "4px",
                                            color: "var(--text-primary)",
                                            fontSize: "1rem",
                                        }, required: true })] }), _jsxs("div", { style: {
                                    position: "relative",
                                    marginBottom: "1rem",
                                }, children: [_jsx(FaEnvelope, { style: {
                                            position: "absolute",
                                            left: "1rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "var(--text-secondary)",
                                        } }), _jsx("input", { type: "email", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value), style: {
                                            width: "100%",
                                            padding: "0.75rem 1rem 0.75rem 2.5rem",
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "4px",
                                            color: "var(--text-primary)",
                                            fontSize: "1rem",
                                        }, required: true })] }), _jsxs("div", { style: {
                                    position: "relative",
                                    marginBottom: "1rem",
                                }, children: [_jsx(FaLock, { style: {
                                            position: "absolute",
                                            left: "1rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "var(--text-secondary)",
                                        } }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), style: {
                                            width: "100%",
                                            padding: "0.75rem 1rem 0.75rem 2.5rem",
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "4px",
                                            color: "var(--text-primary)",
                                            fontSize: "1rem",
                                        }, required: true })] }), _jsxs("div", { style: {
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginBottom: "1.5rem",
                                }, children: [_jsx("input", { type: "checkbox", id: "terms", checked: agreeTerms, onChange: (e) => setAgreeTerms(e.target.checked), style: { marginRight: "0.5rem", marginTop: "0.25rem" } }), _jsxs("label", { htmlFor: "terms", style: {
                                            color: "var(--text-secondary)",
                                            fontSize: "0.875rem",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }, children: ["I agree to the", " ", _jsx("a", { href: "#", style: { color: "var(--accent-green)" }, children: "Terms of Service" }), " ", "and", " ", _jsx("a", { href: "#", style: { color: "var(--accent-green)" }, children: "Privacy Policy" })] })] }), _jsx("button", { type: "submit", "data-testid": "create-account-button", disabled: isLoading, style: {
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
                                }, children: isLoading ? "Creating account..." : "Create account" })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsxs("div", { style: {
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "1rem",
                                }, children: [_jsx("div", { style: { flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.1)" } }), _jsx("span", { style: { padding: "0 1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }, children: "Or continue with" }), _jsx("div", { style: { flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.1)" } })] }), _jsx("div", { style: { display: "flex", justifyContent: "center" }, children: _jsxs("button", { onClick: handleGoogleSignIn, disabled: isLoading, style: {
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
                                    }, children: [_jsx(FaGoogle, {}), " Continue with Google"] }) })] }), _jsxs("div", { style: { fontSize: "0.875rem", color: "var(--text-secondary)" }, children: ["Already have an account?", " ", _jsx(Link, { to: "/login", style: { color: "var(--accent-green)", textDecoration: "none" }, children: "Sign in" })] })] })] }));
};
export default RegisterPage;
