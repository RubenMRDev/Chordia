"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, type UserProfile, deleteUserProfile } from "../firebase/userService";
import { getUserSongs, deleteSongById, deleteAllUserSongs, type Song } from '../firebase/songService';
import {
  FaMusic,
  FaBell,
  FaCog,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaInstagram,
  FaTwitter,
  FaSoundcloud,
  FaSpotify,
  FaPlay,
  FaHeart,
  FaComment,
  FaPlus,
  FaClock,
  FaTrash,
} from "react-icons/fa";
import Header from "../components/Header";
import Swal from "sweetalert2";
const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("songs");
  const { currentUser, logout } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const [profile, userSongs] = await Promise.all([
            getUserProfile(currentUser.uid),
            getUserSongs(currentUser.uid)
          ]);
          setProfileData(profile);
          setSongs(userSongs || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to load profile data. Please try again later.",
            icon: "error",
            background: "var(--background-darker)",
            color: "var(--text-secondary)",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);
  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to log out?",
        text: "You will be redirected to the login page.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--accent-green)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
        background: "var(--background-darker)",
        color: "var(--text-secondary)"
      });
      if (result.isConfirmed) {
        await logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Swal.fire({
        title: "Error",
        text: "There was a problem logging out. Please try again.",
        icon: "error",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
    }
  };
  const handleDeleteSong = async (songId: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete Song?",
        text: "This will permanently delete this song. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "var(--background-darker)",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        background: "var(--background-darker)",
        color: "var(--text-secondary)"
      });
      if (result.isConfirmed && currentUser) {
        await deleteSongById(songId);
        setSongs(songs.filter(song => song.id !== songId));
        Swal.fire({
          title: "Song Deleted",
          icon: "success",
          background: "var(--background-darker)",
          color: "var(--text-secondary)",
          timer: 1500,
          showConfirmButton: false
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
  const handleDeleteAccount = async () => {
    try {
      const result = await Swal.fire({
        title: "Delete Account?",
        text: "This will permanently delete your account and all your songs. This action cannot be undone.",
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
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        setLoading(true);
        await deleteAllUserSongs(currentUser.uid);
        await deleteUserProfile(currentUser.uid);
        await currentUser.delete();
        await logout();
        navigate("/login");
        Swal.fire({
          title: "Account Deleted",
          text: "Your account has been permanently deleted.",
          icon: "success",
          background: "var(--background-darker)",
          color: "var(--text-secondary)",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "There was a problem deleting your account. You may need to re-login before deleting your account.",
        icon: "error",
        background: "var(--background-darker)",
        color: "var(--text-secondary)",
      });
    }
  };
  const formatDate = (dateString: string | number | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Invalid date:", dateString);
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
  if (!currentUser) {
    navigate("/login");
    return null;
  }
  return (
    <div style={{ backgroundColor: "var(--background-darker)", minHeight: "100vh", color: "var(--text-primary)" }}>
      <Header/>
      <div
        style={{
          height: "200px",
          background: "linear-gradient(90deg, #004d40 0%, #00796b 100%)",
          position: "relative",
          overflow: "hidden",
          borderRadius: "0 0 8px 8px",
          margin: "0 1rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2300E676' fillOpacity='0.3' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundSize: "cover",
            opacity: 0.7,
          }}
        ></div>
      </div>
      <div
        style={{
          padding: "0 2rem",
          marginTop: "-60px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "4px solid var(--background-darker)",
            overflow: "hidden",
            marginBottom: "1rem",
          }}
        >
          <img
            src={profileData?.photoURL ? profileData.photoURL : "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp"}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{profileData?.displayName}</h1>
          <p style={{ color: "var(--accent-green)", marginBottom: "1rem" }}>
            @{profileData?.displayName?.toLowerCase().replace(/\s+/g, "")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <span style={{ fontWeight: "bold" }}>{songs.length}</span>
              <span style={{ color: "var(--text-secondary)", marginLeft: "0.5rem" }}>Tracks</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Link
            to="/profile/edit"
            style={{
              backgroundColor: "var(--accent-green)",
              color: "#000",
              padding: "0.5rem 1.25rem",
              borderRadius: "4px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Edit Profile
          </Link>
          <button
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "0.5rem 1.25rem",
              borderRadius: "4px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", padding: "2rem" }}>
        <div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>About</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              {profileData?.bio || "No bio yet"}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "var(--text-secondary)",
                marginBottom: "0.75rem",
              }}
            >
              <FaMapMarkerAlt style={{ marginRight: "0.75rem" }} />
              {profileData?.location || "No location set"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "var(--text-secondary)",
                marginBottom: "0.75rem",
              }}
            >
              <FaGlobe style={{ marginRight: "0.75rem" }} />
              <a
                href={`https://${profileData?.website || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-green)", textDecoration: "none" }}
              >
                {profileData?.website || "No website set"}
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "var(--text-secondary)" }}>
              <FaCalendarAlt style={{ marginRight: "0.75rem" }} />
              Joined{" "}
              {new Date(profileData?.joinDate || Date.now()).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              padding: "1.5rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Social Links</h2>
            <div style={{ display: "flex", gap: "1rem" }}>
              {profileData?.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${profileData.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }}
                >
                  <FaInstagram />
                </a>
              )}
              {profileData?.socialLinks?.twitter && (
                <a
                  href={`https://twitter.com/${profileData.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }}
                >
                  <FaTwitter />
                </a>
              )}
              {profileData?.socialLinks?.soundcloud && (
                <a
                  href={`https://soundcloud.com/${profileData.socialLinks.soundcloud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }}
                >
                  <FaSoundcloud />
                </a>
              )}
              {profileData?.socialLinks?.spotify && (
                <a
                  href={`https://open.spotify.com/artist/${profileData.socialLinks.spotify}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }}
                >
                  <FaSpotify />
                </a>
              )}
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "2rem",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                padding: "1rem 1.5rem",
                color: "var(--accent-green)",
                borderBottom: "2px solid var(--accent-green)",
                fontWeight: "bold",
              }}
            >
              Songs
            </div>
          </div>
          {songs.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {songs.map(song => (
                <div 
                  key={song.id}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={() => navigate('/library')}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    position: 'relative',
                    height: '160px',
                    backgroundColor: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                  }}>
                    <div style={{ 
                      width: '100px',
                      height: '100px',
                      border: '2px solid var(--accent-green)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FaMusic style={{ fontSize: '2.5rem', color: 'var(--accent-green)' }} />
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      marginBottom: '0.5rem'
                    }}>
                      {song.title}
                    </h3>
                    <div style={{ 
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      gap: '1rem'
                    }}>
                      <div>Key: {song.key}</div>
                      <div>{song.timeSignature}</div>
                      <div>{song.tempo} BPM</div>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginTop: '1rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaClock style={{ fontSize: '0.875rem' }} />
                        <span>{formatDate(song.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: "3rem 1rem", 
              backgroundColor: "rgba(255,255,255,0.05)", 
              borderRadius: "8px" 
            }}>
              <FaMusic style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }} />
              <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                You haven't created any songs yet
              </h2>
              <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
                Create your first song to see it here
              </p>
              <Link
                to="/create"
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "#000",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaPlus /> Create Song
              </Link>
            </div>
          )}
        </div>
      </div>
      {}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        padding: "2rem", 
        borderTop: "1px solid rgba(255,255,255,0.1)",
        marginTop: "2rem" 
      }}>
        <button
          style={{
            backgroundColor: "transparent",
            color: "#dc3545",
            padding: "0.75rem 1.5rem",
            borderRadius: "4px",
            border: "1px solid #dc3545",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onClick={handleDeleteAccount}
        >
          <FaTrash /> Delete Account Permanently
        </button>
      </div>
    </div>
  );
};
export default ProfilePage;