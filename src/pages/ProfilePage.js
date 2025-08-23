"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMusic, FaClock, FaPlus, FaMapMarkerAlt, FaGlobe, FaCalendarAlt, FaInstagram, FaTwitter, FaSoundcloud, FaSpotify } from 'react-icons/fa';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getUserSongs, deleteAllUserSongs } from '../firebase/songService';
import { deleteUserProfile } from '../firebase/userService';
import Swal from 'sweetalert2';
const ProfilePage = () => {
    const [_activeTab, _setActiveTab] = useState("songs");
    const { currentUser, logout, userProfile } = useAuth();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserSongs = async () => {
            if (currentUser) {
                try {
                    const userSongs = await getUserSongs(currentUser.uid);
                    const filteredSongs = (userSongs || []).filter((song) => song.userId === currentUser.uid);
                    setSongs(filteredSongs);
                }
                catch (error) {
                    console.error("Error fetching user songs:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to load songs. Please try again later.",
                        icon: "error",
                        background: "var(--background-darker)",
                        color: "var(--text-secondary)",
                    });
                }
                finally {
                    setLoading(false);
                }
            }
            else {
                setLoading(false);
            }
        };
        fetchUserSongs();
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
        }
        catch (error) {
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
        }
        catch (error) {
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
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateString);
            return "Invalid date";
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    if (loading) {
        return (_jsx("div", { style: {
                backgroundColor: "var(--background-darker)",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "var(--text-primary)",
            }, children: "Loading..." }));
    }
    if (!currentUser) {
        navigate("/login");
        return null;
    }
    return (_jsxs("div", { style: { backgroundColor: "var(--background-darker)", minHeight: "100vh", color: "var(--text-primary)" }, children: [_jsx(Header, {}), _jsx("div", { style: {
                    height: "200px",
                    background: "linear-gradient(90deg, #004d40 0%, #00796b 100%)",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "0 0 8px 8px",
                    margin: "0 1rem",
                }, children: _jsx("div", { style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2300E676' fillOpacity='0.3' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
                        backgroundSize: "cover",
                        opacity: 0.7,
                    } }) }), _jsxs("div", { style: {
                    padding: "0 2rem",
                    marginTop: "-60px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }, children: [_jsx("div", { style: {
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            border: "4px solid var(--background-darker)",
                            overflow: "hidden",
                            marginBottom: "1rem",
                        }, children: _jsx("img", { src: userProfile?.photoURL || currentUser?.photoURL || "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp", alt: "Profile", style: { width: "100%", height: "100%", objectFit: "cover" }, onError: (e) => {
                                e.currentTarget.src = "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp";
                            } }) }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h1", { style: { fontSize: "2rem", marginBottom: "0.25rem" }, children: userProfile?.displayName || currentUser?.displayName || "User" }), _jsxs("p", { style: { color: "var(--accent-green)", marginBottom: "1rem" }, children: ["@", (userProfile?.displayName || currentUser?.displayName || "user")?.toLowerCase().replace(/\s+/g, "")] }), _jsx("div", { style: { display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem" }, children: _jsxs("div", { children: [_jsx("span", { style: { fontWeight: "bold" }, children: songs.length }), _jsx("span", { style: { color: "var(--text-secondary)", marginLeft: "0.5rem" }, children: "Tracks" })] }) })] }), _jsxs("div", { style: { display: "flex", gap: "1rem", marginTop: "1rem" }, children: [_jsx(Link, { to: "/profile/edit", style: {
                                    backgroundColor: "var(--accent-green)",
                                    color: "#000",
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: "4px",
                                    border: "none",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    textDecoration: "none",
                                }, children: "Edit Profile" }), userProfile?.role === 'admin' && (_jsx(Link, { to: "/admin/songs", style: {
                                    backgroundColor: "#ff6b35",
                                    color: "white",
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: "4px",
                                    border: "none",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    textDecoration: "none",
                                }, children: "Manage Songs" })), _jsx("button", { style: {
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: "4px",
                                    border: "none",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }, onClick: handleLogout, children: "Logout" }), _jsx("button", { style: {
                                    backgroundColor: "#a9a9a9",
                                    color: "white",
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: "4px",
                                    border: "none",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }, onClick: handleDeleteAccount, children: "Delete Account" })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "2rem", padding: "2rem" }, children: [_jsxs("div", { children: [_jsxs("div", { style: {
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    borderRadius: "8px",
                                    padding: "1.5rem",
                                    marginBottom: "2rem",
                                }, children: [_jsx("h2", { style: { marginBottom: "1rem" }, children: "About" }), _jsx("p", { style: { color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }, children: userProfile?.bio || "No bio yet" }), _jsxs("div", { style: {
                                            display: "flex",
                                            alignItems: "center",
                                            color: "var(--text-secondary)",
                                            marginBottom: "0.75rem",
                                        }, children: [_jsx(FaMapMarkerAlt, { style: { marginRight: "0.75rem" } }), userProfile?.location || "No location set"] }), _jsxs("div", { style: {
                                            display: "flex",
                                            alignItems: "center",
                                            color: "var(--text-secondary)",
                                            marginBottom: "0.75rem",
                                        }, children: [_jsx(FaGlobe, { style: { marginRight: "0.75rem" } }), _jsx("a", { href: `https://${userProfile?.website || ""}`, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--accent-green)", textDecoration: "none" }, children: userProfile?.website || "No website set" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", color: "var(--text-secondary)" }, children: [_jsx(FaCalendarAlt, { style: { marginRight: "0.75rem" } }), "Joined", " ", new Date(userProfile?.joinDate || Date.now()).toLocaleDateString("en-US", {
                                                month: "long",
                                                year: "numeric",
                                            })] })] }), _jsxs("div", { style: {
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    borderRadius: "8px",
                                    padding: "1.5rem",
                                }, children: [_jsx("h2", { style: { marginBottom: "1rem" }, children: "Social Links" }), _jsxs("div", { style: { display: "flex", gap: "1rem" }, children: [userProfile?.socialLinks?.instagram && (_jsx("a", { href: `https://instagram.com/${userProfile.socialLinks.instagram}`, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }, children: _jsx(FaInstagram, {}) })), userProfile?.socialLinks?.twitter && (_jsx("a", { href: `https://twitter.com/${userProfile.socialLinks.twitter}`, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }, children: _jsx(FaTwitter, {}) })), userProfile?.socialLinks?.soundcloud && (_jsx("a", { href: `https://soundcloud.com/${userProfile.socialLinks.soundcloud}`, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }, children: _jsx(FaSoundcloud, {}) })), userProfile?.socialLinks?.spotify && (_jsx("a", { href: `https://open.spotify.com/artist/${userProfile.socialLinks.spotify}`, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--text-secondary)", fontSize: "1.5rem", transition: "color 0.2s ease" }, children: _jsx(FaSpotify, {}) }))] })] })] }), _jsxs("div", { children: [_jsx("div", { style: {
                                    display: "flex",
                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                    marginBottom: "2rem",
                                    overflowX: "auto",
                                    whiteSpace: "nowrap",
                                }, children: _jsx("div", { style: {
                                        padding: "1rem 1.5rem",
                                        color: "var(--accent-green)",
                                        borderBottom: "2px solid var(--accent-green)",
                                        fontWeight: "bold",
                                    }, children: "Songs" }) }), songs.length > 0 ? (_jsx("div", { style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '1.5rem'
                                }, children: songs.map(song => (_jsxs("div", { style: {
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                    }, onClick: () => navigate('/library'), onMouseOver: (e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }, onMouseOut: (e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }, children: [_jsx("div", { style: {
                                                position: 'relative',
                                                height: '160px',
                                                backgroundColor: '#1f2937',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '1rem'
                                            }, children: _jsx("div", { style: {
                                                    width: '100px',
                                                    height: '100px',
                                                    border: '2px solid var(--accent-green)',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }, children: _jsx(FaMusic, { style: { fontSize: '2.5rem', color: 'var(--accent-green)' } }) }) }), _jsxs("div", { style: { padding: '1rem' }, children: [_jsx("h3", { style: {
                                                        fontSize: '1.25rem',
                                                        marginBottom: '0.5rem'
                                                    }, children: song.title }), _jsxs("div", { style: {
                                                        color: 'var(--text-secondary)',
                                                        fontSize: '0.875rem',
                                                        marginBottom: '1rem',
                                                        display: 'flex',
                                                        gap: '1rem'
                                                    }, children: [_jsxs("div", { children: ["Key: ", song.key] }), _jsx("div", { children: song.timeSignature }), _jsxs("div", { children: [song.tempo, " BPM"] })] }), _jsx("div", { style: {
                                                        display: 'flex',
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'center',
                                                        marginTop: '1rem',
                                                        color: 'var(--text-secondary)',
                                                        fontSize: '0.875rem'
                                                    }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(FaClock, { style: { fontSize: '0.875rem' } }), _jsx("span", { children: formatDate(song.createdAt) })] }) })] })] }, song.id))) })) : (_jsxs("div", { style: {
                                    textAlign: "center",
                                    padding: "3rem 1rem",
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    borderRadius: "8px"
                                }, children: [_jsx(FaMusic, { style: { fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' } }), _jsx("h2", { style: { marginBottom: '1rem', color: 'var(--text-secondary)' }, children: "You haven't created any songs yet" }), _jsx("p", { style: { marginBottom: "1.5rem", color: "var(--text-secondary)" }, children: "Create your first song to see it here" }), _jsxs(Link, { to: "/create", style: {
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
                                        }, children: [_jsx(FaPlus, {}), " Create Song"] })] }))] })] })] }));
};
export default ProfilePage;
