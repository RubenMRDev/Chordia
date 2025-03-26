"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUserProfile, type UserProfile } from "../firebase/userService"
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
} from "react-icons/fa"

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tracks")
  const { currentUser } = useAuth()
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid)
          setProfileData(profile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserProfile()
  }, [currentUser])

  // Datos de ejemplo para las canciones
  const tracks = [
    {
      id: 1,
      title: "Neon Dreams",
      genre: "Electronic",
      duration: "3:45",
      plays: "24.5K",
      likes: "1.2K",
      comments: 86,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      title: "Midnight Echo",
      genre: "House",
      duration: "4:12",
      plays: "19.9K",
      likes: "945",
      comments: 52,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      title: "Digital Horizon",
      genre: "Techno",
      duration: "5:30",
      plays: "15.2K",
      likes: "832",
      comments: 47,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      title: "Urban Pulse",
      genre: "Deep House",
      duration: "4:55",
      plays: "12.8K",
      likes: "723",
      comments: 39,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

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
    )
  }

  return (
    <div style={{ backgroundColor: "var(--background-darker)", minHeight: "100vh", color: "var(--text-primary)" }}>
      {/* Header/Navigation */}
      <header
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "var(--accent-green)",
              marginRight: "3rem",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            <FaMusic style={{ marginRight: "0.5rem" }} />
            Chordia
          </Link>

          <nav style={{ display: "flex", gap: "2rem" }}>
            <Link
              to="/dashboard"
              style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: "medium" }}
            >
              Home
            </Link>
            <Link
              to="/profile"
              style={{ color: "var(--accent-green)", textDecoration: "none", fontWeight: "medium" }}
            >
              Profile
            </Link>
            <Link
              to="/discover"
              style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: "medium" }}
            >
              Discover
            </Link>
            <Link
              to="/studio"
              style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: "medium" }}
            >
              Studio
            </Link>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "1.25rem",
            }}
          >
            <FaBell />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "1.25rem",
            }}
          >
            <FaCog />
          </button>
        </div>
      </header>

      {/* Profile Banner */}
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

      {/* Profile Info */}
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
        {/* Profile Picture */}
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
            src={profileData?.photoURL || "/placeholder.svg?height=120&width=120"}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        

        {/* Profile Actions */}
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
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              padding: "0.5rem 1.25rem",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.2)",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Share Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", padding: "2rem" }}>
        {/* Sidebar */}
        <div>
          {/* About Section */}
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

          {/* Social Links */}
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

        {/* Content Area */}
        <div>
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "2rem",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <button
              onClick={() => setActiveTab("tracks")}
              style={{
                padding: "1rem 1.5rem",
                background: "none",
                border: "none",
                color: activeTab === "tracks" ? "var(--accent-green)" : "var(--text-primary)",
                borderBottom: activeTab === "tracks" ? "2px solid var(--accent-green)" : "none",
                cursor: "pointer",
                fontWeight: activeTab === "tracks" ? "bold" : "normal",
              }}
            >
              Tracks
            </button>
            <button
              onClick={() => setActiveTab("albums")}
              style={{
                padding: "1rem 1.5rem",
                background: "none",
                border: "none",
                color: activeTab === "albums" ? "var(--accent-green)" : "var(--text-primary)",
                borderBottom: activeTab === "albums" ? "2px solid var(--accent-green)" : "none",
                cursor: "pointer",
                fontWeight: activeTab === "albums" ? "bold" : "normal",
              }}
            >
              Albums
            </button>
            <button
              onClick={() => setActiveTab("playlists")}
              style={{
                padding: "1rem 1.5rem",
                background: "none",
                border: "none",
                color: activeTab === "playlists" ? "var(--accent-green)" : "var(--text-primary)",
                borderBottom: activeTab === "playlists" ? "2px solid var(--accent-green)" : "none",
                cursor: "pointer",
                fontWeight: activeTab === "playlists" ? "bold" : "normal",
              }}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab("reposts")}
              style={{
                padding: "1rem 1.5rem",
                background: "none",
                border: "none",
                color: activeTab === "reposts" ? "var(--accent-green)" : "var(--text-primary)",
                borderBottom: activeTab === "reposts" ? "2px solid var(--accent-green)" : "none",
                cursor: "pointer",
                fontWeight: activeTab === "reposts" ? "bold" : "normal",
              }}
            >
              Reposts
            </button>
          </div>

          {/* Tracks Grid */}
          {activeTab === "tracks" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {tracks.map((track) => (
                <div
                  key={track.id}
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", overflow: "hidden" }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={track.image}
                      alt={track.title}
                      style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
                    />
                    <button
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        right: "1rem",
                        backgroundColor: "var(--accent-green)",
                        color: "#000",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.25rem",
                      }}
                    >
                      <FaPlay />
                    </button>
                  </div>

                  <div style={{ padding: "1rem" }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{track.title}</h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "1rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{track.genre}</span>
                      <span>{track.duration}</span>
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <FaPlay style={{ fontSize: "0.75rem" }} />
                        <span>{track.plays}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <FaHeart style={{ fontSize: "0.75rem" }} />
                        <span>{track.likes}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <FaComment style={{ fontSize: "0.75rem" }} />
                        <span>{track.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Placeholder para otras pestañas */}
          {activeTab === "albums" && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h3 style={{ color: "var(--text-secondary)" }}>No albums yet</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
                Start creating albums to showcase your music collections.
              </p>
              <button
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "#000",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "1.5rem",
                }}
              >
                Create Album
              </button>
            </div>
          )}

          {activeTab === "playlists" && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h3 style={{ color: "var(--text-secondary)" }}>No playlists yet</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
                Create playlists to organize your favorite tracks.
              </p>
              <button
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "#000",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "1.5rem",
                }}
              >
                Create Playlist
              </button>
            </div>
          )}

          {activeTab === "reposts" && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h3 style={{ color: "var(--text-secondary)" }}>No reposts yet</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
                Share music you love with your followers by reposting tracks.
              </p>
              <button
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "#000",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "1.5rem",
                }}
              >
                Discover Music
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage