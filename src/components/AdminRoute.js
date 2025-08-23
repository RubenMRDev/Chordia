"use client";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const AdminRoute = ({ children }) => {
    const { currentUser, userProfile, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { style: {
                backgroundColor: "var(--background-darker)",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "var(--text-primary)",
            }, children: "Loading..." }));
    }
    if (!currentUser) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (userProfile?.role !== 'admin') {
        return _jsx(Navigate, { to: "/profile", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default AdminRoute;
