import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { FaMusic, FaArrowLeft } from "react-icons/fa";
export const AuthContainer = ({ children }) => {
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
                        }, children: _jsx(FaMusic, { style: { fontSize: "2rem", color: "var(--accent-green)" } }) }), _jsx("h1", { style: { fontSize: "1.75rem", marginBottom: "0.5rem" }, children: "Welcome to Chordia" }), _jsx("p", { style: { color: "var(--text-secondary)", marginBottom: "1.5rem" }, children: "Your creative journey begins here" }), children] })] }));
};
