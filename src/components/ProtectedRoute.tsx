import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/firebase/env';
import RouteFallback from '@/app/RouteFallback';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Waits for the session before deciding.
 *
 * This is where the wait belongs. The provider used to render nothing at all
 * while loading, which blanked pages that never needed an account; now only the
 * routes that genuinely require one hold here, and they hold on the same
 * keyboard placeholder the rest of the app uses rather than the word "Loading".
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Nothing to sign in to in an unconfigured checkout; the account-free part of
  // the product stays reachable.
  if (!isFirebaseConfigured) return <Navigate to="/login" replace />;
  if (loading) return <RouteFallback />;
  if (!currentUser) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
