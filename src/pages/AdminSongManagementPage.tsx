"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMusic, FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getAllSongsWithUserInfo, deleteSongAsAdmin } from '../firebase/songService';
import Swal from 'sweetalert2';
import type { Song } from '../types/firebase';

interface SongWithUserInfo extends Song {
  userDisplayName: string;
}

const AdminSongManagementPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [songs, setSongs] = useState<SongWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario es admin
    if (!currentUser || userProfile?.role !== 'admin') {
      navigate('/profile');
      return;
    }

    const fetchSongs = async () => {
      try {
        const allSongs = await getAllSongsWithUserInfo();
        setSongs(allSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load songs. Please try again later.",
          icon: "error",
          background: "var(--background-darker)",
          color: "var(--text-secondary)",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [currentUser, userProfile, navigate]);

  const handleDeleteSong = async (songId: string, songTitle: string, userName: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete Song?",
        html: `Are you sure you want to delete <strong>${songTitle}</strong> by <strong>${userName}</strong>?<br><br>This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "var(--background-darker)",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        background: "var(--background-darker)",
        color: "var(--text-secondary)"
      });

      if (result.isConfirmed) {
        await deleteSongAsAdmin(songId);
        setSongs(songs.filter(song => song.id !== songId));
        
        Swal.fire({
          title: "Song Deleted",
          text: "The song has been successfully deleted.",
          icon: "success",
          background: "var(--background-darker)",
          color: "var(--text-secondary)",
        });
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      Swal.fire({
        title: "Error",
        text: "There was a problem deleting the song. Please try again.",
        icon: "error",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "var(--background-darker)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--text-primary)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!currentUser || userProfile?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ backgroundColor: "var(--background-darker)", minHeight: "100vh", color: "var(--text-primary)" }}>
      <Header />
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "bold", 
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #00E676, #00C853)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Song Management
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Manage all songs in the platform. You can view and delete songs from any user.
          </p>
        </div>

        {songs.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            color: "var(--text-secondary)"
          }}>
            <FaMusic size={64} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <h3>No songs found</h3>
            <p>There are no songs in the platform yet.</p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))"
          }}>
            {songs.map((song) => (
              <div
                key={song.id}
                style={{
                  backgroundColor: "var(--background)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid var(--border)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: "1.3rem", 
                      fontWeight: "600", 
                      marginBottom: "0.5rem",
                      color: "var(--text-primary)"
                    }}>
                      {song.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <FaUser size={14} style={{ color: "var(--text-secondary)" }} />
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        {song.userDisplayName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSong(song.id!, song.title, song.userDisplayName);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(220, 53, 69, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    title="Delete song"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "1rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaClock size={14} style={{ color: "var(--text-secondary)" }} />
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                      {song.tempo} BPM
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaMusic size={14} style={{ color: "var(--text-secondary)" }} />
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                      Key: {song.key}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaCalendarAlt size={14} style={{ color: "var(--text-secondary)" }} />
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Created: {formatDate(song.createdAt)}
                  </span>
                </div>

                <div style={{ 
                  marginTop: "1rem", 
                  padding: "0.5rem", 
                  backgroundColor: "var(--background-darker)", 
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)"
                }}>
                  <strong>Chords:</strong> {song.chords.length} progression{song.chords.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSongManagementPage; 