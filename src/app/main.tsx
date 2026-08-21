import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Self-hosted variable fonts. These used to arrive through an `@import` of
// Google Fonts inside the stylesheet, which blocks the first render on a
// third-party round trip.
import '@fontsource-variable/inter';
import '@fontsource-variable/bricolage-grotesque';

import '@/index.css';
import { AuthProvider } from '@/context/AuthContext';
import { LocaleProvider } from '@/i18n';
import ErrorBoundary from './ErrorBoundary';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('#root is missing from index.html');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LocaleProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </LocaleProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
