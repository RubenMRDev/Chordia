"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMusic, FaArrowLeft, FaInstagram, FaTwitter, FaSoundcloud, FaSpotify } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from '../firebase/userService';
const EditProfilePage = () => {
    const navigate = useNavigate();
    const { currentUser, userProfile, updateProfileInContext } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: userProfile?.displayName || currentUser?.displayName || "",
        bio: userProfile?.bio ||
            "",
        location: userProfile?.location || "",
        website: userProfile?.website || "",
        instagram: userProfile?.socialLinks?.instagram || "",
        twitter: userProfile?.socialLinks?.twitter || "",
        soundcloud: userProfile?.socialLinks?.soundcloud || "",
        spotify: userProfile?.socialLinks?.spotify || "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            return;
        }
        try {
            setIsLoading(true);
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
            });
            if (typeof updateProfileInContext === 'function') {
                await updateProfileInContext();
            }
            navigate("/profile");
        }
        catch (error) {
            console.error("Error updating profile:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { style: {
            backgroundColor: "var(--background-darker)",
            minHeight: "100vh",
            color: "var(--text-primary)",
        }, children: [_jsx("header", { style: {
                    padding: "1rem 2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                }, children: _jsx("div", { style: { display: "flex", alignItems: "center" }, children: _jsxs(Link, { to: "/dashboard", style: {
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "var(--accent-green)",
                            marginRight: "3rem",
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }, children: [_jsx(FaMusic, { style: { marginRight: "0.5rem" } }), "Chordia"] }) }) }), _jsxs("div", { style: {
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "2rem 1rem",
                }, children: [_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2rem",
                        }, children: [_jsx(Link, { to: "/profile", style: {
                                    display: "flex",
                                    alignItems: "center",
                                    color: "var(--text-primary)",
                                    textDecoration: "none",
                                    marginRight: "1rem",
                                }, children: _jsx(FaArrowLeft, {}) }), _jsx("h1", { children: "Edit Profile" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { marginBottom: "2rem" }, children: [_jsx("h2", { style: { marginBottom: "1.5rem" }, children: "Basic Information" }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "name", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, style: {
                                                    width: "100%",
                                                    padding: "0.75rem",
                                                    backgroundColor: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "4px",
                                                    color: "var(--text-primary)",
                                                    fontSize: "1rem",
                                                } })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "bio", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "Bio" }), _jsx("textarea", { name: "bio", id: "bio", value: formData.bio, onChange: handleChange, rows: 4, style: {
                                                    width: "100%",
                                                    padding: "0.75rem",
                                                    backgroundColor: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "4px",
                                                    color: "var(--text-primary)",
                                                    fontSize: "1rem",
                                                    resize: "vertical",
                                                } })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "location", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "Location" }), _jsx("input", { type: "text", id: "location", name: "location", value: formData.location, onChange: handleChange, style: {
                                                    width: "100%",
                                                    padding: "0.75rem",
                                                    backgroundColor: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "4px",
                                                    color: "var(--text-primary)",
                                                    fontSize: "1rem",
                                                } })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "website", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "Website" }), _jsx("input", { type: "text", id: "website", name: "website", value: formData.website, onChange: handleChange, style: {
                                                    width: "100%",
                                                    padding: "0.75rem",
                                                    backgroundColor: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "4px",
                                                    color: "var(--text-primary)",
                                                    fontSize: "1rem",
                                                } })] })] }), _jsxs("div", { style: { marginBottom: "2rem" }, children: [_jsx("h2", { style: { marginBottom: "1.5rem" }, children: "Social Links" }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "instagram", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "Instagram" }), _jsxs("div", { style: { position: "relative" }, children: [_jsx(FaInstagram, { style: {
                                                            position: "absolute",
                                                            left: "0.75rem",
                                                            top: "50%",
                                                            transform: "translateY(-50%)",
                                                            color: "var(--text-secondary)",
                                                        } }), _jsx("input", { type: "text", id: "instagram", name: "instagram", value: formData.instagram, onChange: handleChange, style: {
                                                            width: "100%",
                                                            padding: "0.75rem",
                                                            paddingLeft: "2.5rem",
                                                            backgroundColor: "rgba(255,255,255,0.05)",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                            borderRadius: "4px",
                                                            color: "var(--text-primary)",
                                                            fontSize: "1rem",
                                                        } })] })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "twitter", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "Twitter" }), _jsxs("div", { style: { position: "relative" }, children: [_jsx(FaTwitter, { style: {
                                                            position: "absolute",
                                                            left: "0.75rem",
                                                            top: "50%",
                                                            transform: "translateY(-50%)",
                                                            color: "var(--text-secondary)",
                                                        } }), _jsx("input", { type: "text", id: "twitter", name: "twitter", value: formData.twitter, onChange: handleChange, style: {
                                                            width: "100%",
                                                            padding: "0.75rem",
                                                            paddingLeft: "2.5rem",
                                                            backgroundColor: "rgba(255,255,255,0.05)",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                            borderRadius: "4px",
                                                            color: "var(--text-primary)",
                                                            fontSize: "1rem",
                                                        } })] })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "soundcloud", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "SoundCloud" }), _jsxs("div", { style: { position: "relative" }, children: [_jsx(FaSoundcloud, { style: {
                                                            position: "absolute",
                                                            left: "0.75rem",
                                                            top: "50%",
                                                            transform: "translateY(-50%)",
                                                            color: "var(--text-secondary)",
                                                        } }), _jsx("input", { type: "text", id: "soundcloud", name: "soundcloud", value: formData.soundcloud, onChange: handleChange, style: {
                                                            width: "100%",
                                                            padding: "0.75rem",
                                                            paddingLeft: "2.5rem",
                                                            backgroundColor: "rgba(255,255,255,0.05)",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                            borderRadius: "4px",
                                                            color: "var(--text-primary)",
                                                            fontSize: "1rem",
                                                        } })] })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { htmlFor: "spotify", style: {
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "var(--text-secondary)",
                                                }, children: "Spotify" }), _jsxs("div", { style: { position: "relative" }, children: [_jsx(FaSpotify, { style: {
                                                            position: "absolute",
                                                            left: "0.75rem",
                                                            top: "50%",
                                                            transform: "translateY(-50%)",
                                                            color: "var(--text-secondary)",
                                                        } }), _jsx("input", { type: "text", id: "spotify", name: "spotify", value: formData.spotify, onChange: handleChange, style: {
                                                            width: "100%",
                                                            padding: "0.75rem",
                                                            paddingLeft: "2.5rem",
                                                            backgroundColor: "rgba(255,255,255,0.05)",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                            borderRadius: "4px",
                                                            color: "var(--text-primary)",
                                                            fontSize: "1rem",
                                                        } })] })] })] }), _jsxs("div", { style: {
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "1rem",
                                    marginTop: "2rem",
                                }, children: [_jsx(Link, { to: "/profile", style: {
                                            padding: "0.75rem 1.5rem",
                                            borderRadius: "4px",
                                            textDecoration: "none",
                                            color: "var(--text-primary)",
                                            border: "1px solid rgba(255,255,255,0.2)",
                                            fontWeight: "bold",
                                        }, children: "Cancel" }), _jsx("button", { type: "submit", disabled: isLoading, style: {
                                            backgroundColor: "var(--accent-green)",
                                            color: "#000",
                                            padding: "0.75rem 1.5rem",
                                            borderRadius: "4px",
                                            border: "none",
                                            fontWeight: "bold",
                                            cursor: isLoading ? "not-allowed" : "pointer",
                                            opacity: isLoading ? 0.7 : 1,
                                        }, children: isLoading ? "Saving..." : "Save Changes" })] })] })] })] }));
};
export default EditProfilePage;
