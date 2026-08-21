import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/firebase/env';
import RouteFallback from '@/app/RouteFallback';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Admin-only routes. The role lives on the user's profile document, so this
 * also has to wait for the profile, not just the session — deciding on
 * `userProfile` before it arrives would bounce every admin to their profile
 * page on a slow connection.
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (!isFirebaseConfigured) return <Navigate to="/login" replace />;
  if (loading) return <RouteFallback />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!userProfile) return <RouteFallback />;
  if (userProfile.role !== 'admin') return <Navigate to="/profile" replace />;

  return <>{children}</>;
};

export default AdminRoute;
