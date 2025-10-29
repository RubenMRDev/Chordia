import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaGoogle } from "react-icons/fa";
export const GoogleSignInButton = ({ onClick, isLoading }) => {
    return (_jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                }, children: [_jsx("div", { style: { flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.1)" } }), _jsx("span", { style: { padding: "0 1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }, children: "Or continue with" }), _jsx("div", { style: { flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.1)" } })] }), _jsx("div", { style: { display: "flex", justifyContent: "center" }, children: _jsxs("button", { onClick: onClick, disabled: isLoading, style: {
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
                    }, children: [_jsx(FaGoogle, {}), " Continue with Google"] }) })] }));
};
