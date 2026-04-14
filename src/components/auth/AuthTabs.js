import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export const AuthTabs = ({ activeTab, loginPath, registerPath }) => {
    return (_jsxs("div", { style: {
            display: "flex",
            marginBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
        }, children: [_jsx(Link, { to: loginPath, style: {
                    flex: 1,
                    textDecoration: "none",
                    padding: "0.75rem",
                    color: activeTab === "login" ? "var(--accent-green)" : "var(--text-secondary)",
                    borderBottom: activeTab === "login" ? "2px solid var(--accent-green)" : "none",
                    display: "block",
                    fontWeight: activeTab === "login" ? "bold" : "normal",
                }, children: "Login" }), _jsx(Link, { to: registerPath, style: {
                    flex: 1,
                    textDecoration: "none",
                    padding: "0.75rem",
                    color: activeTab === "register" ? "var(--accent-green)" : "var(--text-secondary)",
                    borderBottom: activeTab === "register" ? "2px solid var(--accent-green)" : "none",
                    display: "block",
                    fontWeight: activeTab === "register" ? "bold" : "normal",
                }, children: "Register" })] }));
};
