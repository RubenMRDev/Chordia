import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AuthInputField = ({ icon: Icon, type, placeholder, value, onChange, required = false, }) => {
    return (_jsxs("div", { style: {
            position: "relative",
            marginBottom: "1rem",
        }, children: [_jsx(Icon, { style: {
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                } }), _jsx("input", { type: type, placeholder: placeholder, value: value, onChange: (e) => onChange(e.target.value), style: {
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                }, required: required })] }));
};
