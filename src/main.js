import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import "./utils/adminUtils";
// Inicializar puter antes de renderizar la app
async function startApp() {
    // @ts-ignore
    if (typeof window.puter !== 'undefined' && typeof window.puter.init === 'function') {
        try {
            await window.puter.init();
            // Opcional: console.log('Puter inicializado');
        }
        catch (e) {
            // Opcional: console.error('Error inicializando Puter', e);
        }
    }
    ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(AppWrapper, {}) }) }) }));
}
startApp();
