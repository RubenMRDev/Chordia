import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import RouteFallback from './RouteFallback';

/*
  Every route is a chunk. The build used to ship one 1.1 MB file, so someone
  landing on the home page downloaded the admin screens, the song editor and
  the whole Firestore client before hearing a note.
*/
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'));
const LibraryPage = lazy(() => import('@/pages/LibraryPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const EditProfilePage = lazy(() => import('@/pages/EditProfilePage'));
const CreateSongPage = lazy(() => import('@/pages/CreateSongPage'));
const SongDetailsPage = lazy(() => import('@/pages/SongDetailsPage'));
const AdminSongManagementPage = lazy(
  () => import('@/pages/AdminSongManagementPage'),
);
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const MidiLibraryPage = lazy(() => import('@/pages/MidiLibraryPage'));
const PlayMidiPage = lazy(() => import('@/pages/PlayMidiPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/*
  The floating assistant is lazy too. It statically pulled in `marked`, so the
  markdown renderer for a chat panel nobody had opened yet was shipping in the
  entry chunk of every page.
*/
const AIChatWidget = lazy(() => import('@/components/AIChatWidget'));

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Playing needs no account, same as the demo. */}
          <Route path="/midi" element={<MidiLibraryPage />} />
          <Route path="/play/:midiId" element={<PlayMidiPage />} />
          <Route path="/demo" element={<DemoPage />} />

          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <DiscoverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateSongPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/song/:songId"
            element={
              <ProtectedRoute>
                <SongDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/songs"
            element={
              <AdminRoute>
                <AdminSongManagementPage />
              </AdminRoute>
            }
          />

          {/*
            A real 404 instead of a redirect to the home page: silently sending
            a mistyped URL to `/` hides broken links from everyone.
          */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </>
  );
};

export default App;
