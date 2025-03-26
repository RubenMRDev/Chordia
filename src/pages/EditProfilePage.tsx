"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaMusic, FaArrowLeft, FaInstagram, FaTwitter, FaSoundcloud, FaSpotify } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { updateUserProfile } from "../firebase/userService"
import { uploadProfilePicture } from "../firebase/storageService"; // Importa el servicio de subida

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: userProfile?.displayName || currentUser?.displayName || "",
    bio:
      userProfile?.bio ||
      "",
    location: userProfile?.location || "",
    website: userProfile?.website || "",
    instagram: userProfile?.socialLinks?.instagram || "",
    twitter: userProfile?.socialLinks?.twitter || "",
    soundcloud: userProfile?.socialLinks?.soundcloud || "",
    spotify: userProfile?.socialLinks?.spotify || "",
  })

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      return
    }

    try {
      setIsLoading(true)

      // Actualizar el perfil en Firestore
      await updateUserProfile(currentUser.uid, {
        displayName: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        socialLinks: {
          instagram: formData.instagram,
          twitter: formData.twitter,
          soundcloud: formData.soundcloud,
          spotify: formData.spotify,
        },
      })

      navigate("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: "var(--background-darker)",
        minHeight: "100vh",
        color: "var(--text-primary)",
      }}
    >
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
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Link
            to="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-primary)",
              textDecoration: "none",
              marginRight: "1rem",
            }}
          >
            <FaArrowLeft />
          </Link>
          <h1>Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Banner */}
          {/* Removed banner editing section */}

          {/* Basic Info */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Basic Information</h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          {/* Social Links */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Social Links</h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Instagram
              </label>
              <div style={{ position: "relative" }}>
                <FaInstagram
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                  }}
                />
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    paddingLeft: "2.5rem",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Twitter
              </label>
              <div style={{ position: "relative" }}>
                <FaTwitter
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                  }}
                />
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    paddingLeft: "2.5rem",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                SoundCloud
              </label>
              <div style={{ position: "relative" }}>
                <FaSoundcloud
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                  }}
                />
                <input
                  type="text"
                  name="soundcloud"
                  value={formData.soundcloud}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    paddingLeft: "2.5rem",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Spotify
              </label>
              <div style={{ position: "relative" }}>
                <FaSpotify
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                  }}
                />
                <input
                  type="text"
                  name="spotify"
                  value={formData.spotify}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    paddingLeft: "2.5rem",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <Link
              to="/profile"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                color: "var(--text-primary)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontWeight: "bold",
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "var(--accent-green)",
                color: "#000",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                border: "none",
                fontWeight: "bold",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfilePage

