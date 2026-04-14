import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AuthError = ({ error, onDismiss }) => {
    if (!error)
        return null;
    return (_jsxs("div", { style: {
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            color: "#ff6b6b",
            padding: "0.75rem",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontSize: "0.875rem",
        }, children: [error, _jsx("button", { onClick: onDismiss, style: {
                    background: "none",
                    border: "none",
                    color: "#ff6b6b",
                    marginLeft: "0.5rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                }, children: "\u00D7" })] }));
};
