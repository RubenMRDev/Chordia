"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMusic, FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getAllSongsWithUserInfo, deleteSongAsAdmin } from '../firebase/songService';
import Swal from 'sweetalert2';
const AdminSongManagementPage = () => {
    const { currentUser, userProfile } = useAuth();
    const [songs, setSongs] = useState([]);
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
            }
            catch (error) {
                console.error("Error fetching songs:", error);
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
        };
        fetchSongs();
    }, [currentUser, userProfile, navigate]);
    const handleDeleteSong = async (songId, songTitle, userName) => {
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
        }
        catch (error) {
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
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        catch (error) {
            return "Invalid date";
        }
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
    if (!currentUser || userProfile?.role !== 'admin') {
        return null;
    }
    return (_jsxs("div", { style: { backgroundColor: "var(--background-darker)", minHeight: "100vh", color: "var(--text-primary)" }, children: [_jsx(Header, {}), _jsxs("div", { style: { padding: "2rem", maxWidth: "1200px", margin: "0 auto" }, children: [_jsxs("div", { style: { marginBottom: "2rem" }, children: [_jsx("h1", { style: {
                                    fontSize: "2.5rem",
                                    fontWeight: "bold",
                                    marginBottom: "0.5rem",
                                    background: "linear-gradient(135deg, #00E676, #00C853)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }, children: "Song Management" }), _jsx("p", { style: { color: "var(--text-secondary)", fontSize: "1.1rem" }, children: "Manage all songs in the platform. You can view and delete songs from any user." })] }), songs.length === 0 ? (_jsxs("div", { style: {
                            textAlign: "center",
                            padding: "3rem",
                            color: "var(--text-secondary)"
                        }, children: [_jsx(FaMusic, { size: 64, style: { marginBottom: "1rem", opacity: 0.5 } }), _jsx("h3", { children: "No songs found" }), _jsx("p", { children: "There are no songs in the platform yet." })] })) : (_jsx("div", { style: {
                            display: "grid",
                            gap: "1rem",
                            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))"
                        }, children: songs.map((song) => (_jsxs("div", { style: {
                                backgroundColor: "var(--background)",
                                borderRadius: "12px",
                                padding: "1.5rem",
                                border: "1px solid var(--border)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                cursor: "pointer",
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { style: {
                                                        fontSize: "1.3rem",
                                                        fontWeight: "600",
                                                        marginBottom: "0.5rem",
                                                        color: "var(--text-primary)"
                                                    }, children: song.title }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }, children: [_jsx(FaUser, { size: 14, style: { color: "var(--text-secondary)" } }), _jsx("span", { style: { color: "var(--text-secondary)", fontSize: "0.9rem" }, children: song.userDisplayName })] })] }), _jsx("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                handleDeleteSong(song.id, song.title, song.userDisplayName);
                                            }, style: {
                                                backgroundColor: "transparent",
                                                border: "none",
                                                color: "#dc3545",
                                                cursor: "pointer",
                                                padding: "0.5rem",
                                                borderRadius: "6px",
                                                transition: "background-color 0.2s",
                                            }, onMouseEnter: (e) => {
                                                e.currentTarget.style.backgroundColor = "rgba(220, 53, 69, 0.1)";
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }, title: "Delete song", children: _jsx(FaTrash, { size: 16 }) })] }), _jsxs("div", { style: {
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "1rem",
                                        marginBottom: "1rem"
                                    }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [_jsx(FaClock, { size: 14, style: { color: "var(--text-secondary)" } }), _jsxs("span", { style: { color: "var(--text-secondary)", fontSize: "0.9rem" }, children: [song.tempo, " BPM"] })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [_jsx(FaMusic, { size: 14, style: { color: "var(--text-secondary)" } }), _jsxs("span", { style: { color: "var(--text-secondary)", fontSize: "0.9rem" }, children: ["Key: ", song.key] })] })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [_jsx(FaCalendarAlt, { size: 14, style: { color: "var(--text-secondary)" } }), _jsxs("span", { style: { color: "var(--text-secondary)", fontSize: "0.9rem" }, children: ["Created: ", formatDate(song.createdAt)] })] }), _jsxs("div", { style: {
                                        marginTop: "1rem",
                                        padding: "0.5rem",
                                        backgroundColor: "var(--background-darker)",
                                        borderRadius: "6px",
                                        fontSize: "0.9rem",
                                        color: "var(--text-secondary)"
                                    }, children: [_jsx("strong", { children: "Chords:" }), " ", song.chords.length, " progression", song.chords.length !== 1 ? 's' : ''] })] }, song.id))) }))] })] }));
};
export default AdminSongManagementPage;
