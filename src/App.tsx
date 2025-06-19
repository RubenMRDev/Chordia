"use client"
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import DiscoveryPage from "./pages/DiscoverPage"
import LibraryPage from "./pages/LibraryPage"
import ProfilePage from "./pages/ProfilePage"
import EditProfilePage from "./pages/EditProfilePage"
import AdminSongManagementPage from "./pages/AdminSongManagementPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import { useAuth } from "./context/AuthContext"
import CreateSongPage from "./pages/CreateSongPage"
import SongDetailsPage from "./pages/SongDetailsPage"
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Experience from './components/Experience';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import LandingLayout from './components/LandingLayout';
import DemoPage from './pages/DemoPage';
import AIChatWidget from './components/AIChatWidget';
import "./App.css"


function App() {
  const { currentUser } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/" element={
          <LandingLayout>
            <Header />
            <Hero />
            <Features />
            <Experience />
            <CallToAction />
            <Footer />
          </LandingLayout>
        } />
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
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
              <DiscoveryPage />
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
          path="/admin/songs"
          element={
            <AdminRoute>
              <AdminSongManagementPage />
            </AdminRoute>
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
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AIChatWidget />
    </>
  )
}

export default App

