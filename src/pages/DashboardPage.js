import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaMusic, FaPlay, FaStar, FaRegStar, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Header from '../components/Header';
import { getAllSongs } from '../firebase/songService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
const DashboardPage = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRandomSongs = async () => {
            try {
                setLoading(true);
                const allSongs = await getAllSongs();
                const songsWithUserData = await Promise.all(allSongs.map(async (song) => {
                    let username = '@user';
                    try {
                        const userDoc = await getDoc(doc(db, 'users', song.userId));
                        if (userDoc.exists()) {
                            username =
                                '@' +
                                    (userDoc.data().username ||
                                        userDoc.data().displayName ||
                                        userDoc.data().email?.split('@')[0] ||
                                        'user');
                        }
                    }
                    catch (err) {
                        console.error('Error fetching user data:', err);
                    }
                    const difficulty = Math.floor(Math.random() * 3) + 1;
                    return {
                        id: song.id || '',
                        title: song.title,
                        key: song.key,
                        timeSignature: song.timeSignature,
                        tempo: song.tempo,
                        username: username,
                        userId: song.userId,
                        createdAt: song.createdAt,
                        difficulty: difficulty,
                    };
                }));
                const randomSongs = [...songsWithUserData]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                setSongs(randomSongs);
            }
            catch (error) {
                console.error('Error fetching songs:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRandomSongs();
    }, []);
    const renderDifficultyStars = (level) => {
        const stars = [];
        for (let i = 0; i < 3; i++) {
            if (i < level) {
                stars.push(_jsx(FaStar, { style: { color: 'var(--accent-green)' }, "data-testid": "filled-star" }, i));
            }
            else {
                stars.push(_jsx(FaRegStar, { style: { color: 'var(--text-secondary)' }, "data-testid": "empty-star" }, i));
            }
        }
        return stars;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    return (_jsxs("div", { style: {
            backgroundColor: 'var(--background-darker)',
            minHeight: '100vh',
            color: 'var(--text-primary)',
        }, children: [_jsx(Header, {}), _jsxs("section", { style: {
                    padding: '4rem 2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: 'linear-gradient(to right, var(--background-darker), rgba(21, 33, 45, 0.9))',
                    display: 'flex',
                    alignItems: 'center',
                }, children: [_jsxs("div", { style: { maxWidth: '600px', zIndex: 1 }, children: [_jsx("h1", { style: {
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    color: 'var(--accent-green)',
                                    marginBottom: '1rem',
                                }, children: "Create Music Magic with Chordia" }), _jsx("p", { style: {
                                    color: 'var(--text-secondary)',
                                    fontSize: '1.1rem',
                                    marginBottom: '2rem',
                                    lineHeight: 1.6,
                                }, children: "Your ultimate platform for chord progression and song creation. Transform your musical ideas into reality." }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(Link, { to: "/create", style: {
                                            backgroundColor: 'var(--accent-green)',
                                            color: '#000',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                        }, children: "Create Custom Song" }), _jsx(Link, { to: "/library", style: {
                                            border: '1px solid var(--accent-green)',
                                            color: 'var(--accent-green)',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                        }, children: "Browse Library" })] })] }), _jsx("div", { style: {
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0.5,
                            zIndex: 0,
                            backgroundImage: `url("https://res.cloudinary.com/doy4x4chv/image/upload/v1742987174/dashboard_eohinb.webp")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        } })] }), _jsxs("section", { style: { padding: '2rem' }, children: [_jsx("h2", { style: {
                            fontSize: '1.75rem',
                            color: 'var(--accent-green)',
                            marginBottom: '2rem',
                        }, children: "Random Community Songs" }), loading ? (_jsx("div", { style: { textAlign: 'center', padding: '1rem' }, children: _jsx("p", { children: "Loading songs..." }) })) : songs.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '1rem' }, children: _jsx("p", { style: { color: 'var(--text-secondary)' }, children: "No songs available at the moment." }) })) : (_jsx("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                        }, children: songs.map((song) => (_jsxs("div", { style: {
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                position: 'relative',
                                cursor: 'pointer',
                            }, onClick: () => navigate(`/song/${song.id}`), children: [_jsx("div", { style: {
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        color: 'var(--accent-green)',
                                    }, children: _jsx(FaMusic, {}) }), _jsxs("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '0.75rem',
                                        color: 'var(--text-secondary)',
                                    }, children: [_jsx(FaUser, { style: { marginRight: '0.5rem' } }), _jsx("span", { children: song.username })] }), _jsx("h3", { style: { fontSize: '1.25rem', marginBottom: '0.5rem' }, children: song.title }), _jsxs("p", { style: {
                                        color: 'var(--text-secondary)',
                                        marginBottom: '0.5rem',
                                    }, children: [song.key, " \u2022 ", song.timeSignature, " \u2022 ", song.tempo, " BPM"] }), _jsxs("p", { style: {
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.875rem',
                                        marginBottom: '1rem',
                                    }, children: ["Created: ", formatDate(song.createdAt)] }), _jsxs("div", { style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }, children: [_jsxs("div", { children: [_jsx("span", { style: {
                                                        color: 'var(--text-secondary)',
                                                        marginRight: '0.5rem',
                                                    }, children: "Difficulty:" }), _jsx("span", { style: { display: 'inline-flex', gap: '0.25rem' }, children: renderDifficultyStars(song.difficulty || 2) })] }), _jsx("button", { style: {
                                                backgroundColor: 'var(--accent-green)',
                                                color: '#000',
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }, onClick: (e) => {
                                                e.stopPropagation();
                                                navigate(`/song/${song.id}`);
                                            }, children: _jsx(FaPlay, {}) })] })] }, song.id))) }))] }), _jsxs("section", { style: {
                    padding: '4rem 2rem',
                    backgroundColor: 'var(--background-dark)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    alignItems: 'center',
                }, children: [_jsxs("div", { children: [_jsx("h2", { style: {
                                    fontSize: '2.5rem',
                                    color: 'var(--accent-green)',
                                    marginBottom: '1.5rem',
                                }, children: "Create Your Own Song" }), _jsx("p", { style: {
                                    color: 'var(--text-secondary)',
                                    fontSize: '1.1rem',
                                    marginBottom: '2rem',
                                    lineHeight: 1.6,
                                    maxWidth: '500px',
                                }, children: "Start from scratch and compose your masterpiece. Our intuitive chord editor makes it easy to bring your musical vision to life." }), _jsx(Link, { to: "/create", style: {
                                    backgroundColor: 'var(--accent-green)',
                                    color: '#000',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    display: 'inline-block',
                                }, children: "Start Creating Now" })] }), _jsx("div", { style: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }, children: _jsxs("div", { style: {
                                width: '300px',
                                height: '300px',
                                borderRadius: '50%',
                                backgroundColor: '#000',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }, children: [_jsx("div", { style: {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: 'radial-gradient(circle, #000 60%, var(--accent-green) 100%)',
                                        opacity: 0.5,
                                    } }), _jsx(FaMusic, { style: {
                                        color: 'var(--accent-green)',
                                        fontSize: '4rem',
                                        position: 'relative',
                                        zIndex: 1,
                                    } })] }) })] }), _jsxs("footer", { style: {
                    backgroundColor: 'var(--background-darker)',
                    padding: '3rem 2rem 1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }, children: [_jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '2rem',
                            marginBottom: '3rem',
                        }, children: [_jsxs("div", { children: [_jsxs("div", { style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'var(--accent-green)',
                                            marginBottom: '1rem',
                                            fontWeight: 'bold',
                                            fontSize: '1.25rem',
                                        }, children: [_jsx(FaMusic, { style: { marginRight: '0.5rem' } }), "Chordia"] }), _jsx("p", { style: { color: 'var(--text-secondary)' }, children: "Your musical journey starts here." })] }), _jsxs("div", { children: [_jsx("h3", { style: { marginBottom: '1rem' }, children: "Quick Links" }), _jsxs("ul", { style: { listStyle: 'none', padding: 0 }, children: [_jsx("li", { style: { marginBottom: '0.5rem' }, children: _jsx(Link, { to: "/dashboard", style: {
                                                        color: 'var(--text-secondary)',
                                                        textDecoration: 'none',
                                                    }, children: "Home" }) }), _jsx("li", { style: { marginBottom: '0.5rem' }, children: _jsx(Link, { to: "/library", style: {
                                                        color: 'var(--text-secondary)',
                                                        textDecoration: 'none',
                                                    }, children: "Browse Songs" }) }), _jsx("li", { style: { marginBottom: '0.5rem' }, children: _jsx(Link, { to: "/create", style: {
                                                        color: 'var(--text-secondary)',
                                                        textDecoration: 'none',
                                                    }, children: "Create Song" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { style: { marginBottom: '1rem' }, children: "Resources" }), _jsxs("ul", { style: { listStyle: 'none', padding: 0 }, children: [_jsx("li", { style: { marginBottom: '0.5rem' }, children: _jsx(Link, { to: "/help", style: {
                                                        color: 'var(--text-secondary)',
                                                        textDecoration: 'none',
                                                    }, children: "Help Center" }) }), _jsx("li", { style: { marginBottom: '0.5rem' }, children: _jsx(Link, { to: "/terms", style: {
                                                        color: 'var(--text-secondary)',
                                                        textDecoration: 'none',
                                                    }, children: "Terms of Service" }) }), _jsx("li", { style: { marginBottom: '0.5rem' }, children: _jsx(Link, { to: "/privacy", style: {
                                                        color: 'var(--text-secondary)',
                                                        textDecoration: 'none',
                                                    }, children: "Privacy Policy" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { style: { marginBottom: '1rem' }, children: "Connect" }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx("a", { href: "#", title: "Chordia on Twitter", style: { color: 'var(--text-secondary)', fontSize: '1.25rem' }, children: _jsx(FaTwitter, {}) }), _jsx("a", { href: "#", title: "Chordia on Instagram", style: { color: 'var(--text-secondary)', fontSize: '1.25rem' }, children: _jsx(FaInstagram, {}) }), _jsx("a", { href: "#", title: "Chordia on YouTube", style: { color: 'var(--text-secondary)', fontSize: '1.25rem' }, children: _jsx(FaYoutube, {}) })] })] })] }), _jsxs("div", { style: {
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '1.5rem',
                            fontSize: '0.875rem',
                        }, children: ["\u00A9 ", new Date().getFullYear(), " Chordia. All rights reserved."] })] })] }));
};
export default DashboardPage;
