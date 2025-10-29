"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "./context/AuthContext";
import App from "./App";
const AppWrapper = () => {
    // Remove unused auth variable or use it with a void expression
    useAuth(); // Keep the hook call without storing the result
    return _jsx(App, {});
};
export default AppWrapper;
