"use client";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (!currentUser) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
