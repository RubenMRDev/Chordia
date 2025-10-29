"use client"
import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaMusic, FaArrowLeft, FaInstagram, FaTwitter, FaSoundcloud, FaSpotify } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { updateUserProfile } from '../firebase/userService'
import { FormInputField } from '../components/form/FormInputField'
import { FormTextAreaField } from '../components/form/FormTextAreaField'

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile, updateProfileInContext } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      return
    }
    try {
      setIsLoading(true)
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
      if (typeof updateProfileInContext === 'function') {
        await updateProfileInContext();
      }
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
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Basic Information</h2>
            <FormInputField
              id="name"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <FormTextAreaField
              id="bio"
              name="bio"
              label="Bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
            <FormInputField
              id="location"
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
            />
            <FormInputField
              id="website"
              name="website"
              label="Website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Social Links</h2>
            <FormInputField
              id="instagram"
              name="instagram"
              label="Instagram"
              value={formData.instagram}
              onChange={handleChange}
              icon={FaInstagram}
            />
            <FormInputField
              id="twitter"
              name="twitter"
              label="Twitter"
              value={formData.twitter}
              onChange={handleChange}
              icon={FaTwitter}
            />
            <FormInputField
              id="soundcloud"
              name="soundcloud"
              label="SoundCloud"
              value={formData.soundcloud}
              onChange={handleChange}
              icon={FaSoundcloud}
            />
            <FormInputField
              id="spotify"
              name="spotify"
              label="Spotify"
              value={formData.spotify}
              onChange={handleChange}
              icon={FaSpotify}
            />
          </div>
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
