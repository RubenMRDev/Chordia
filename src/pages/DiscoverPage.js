import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { FaMusic, FaPlay, FaUser, FaRandom, FaClock } from 'react-icons/fa';
import { getAllSongs } from '../firebase/songService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
const DiscoverPage = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortMethod, setSortMethod] = useState('recent');
    const [animationsReady, setAnimationsReady] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAllSongs = async () => {
            try {
                setLoading(true);
                const allSongs = await getAllSongs();
                const songsWithUserData = await Promise.all(allSongs.map(async (song) => {
                    let username = '@user';
                    try {
                        const userDoc = await getDoc(doc(db, "users", song.userId));
                        if (userDoc.exists()) {
                            username = '@' + (userDoc.data().username ||
                                userDoc.data().displayName ||
                                userDoc.data().email?.split('@')[0] ||
                                'user');
                        }
                    }
                    catch (err) {
                        console.error('Error fetching user data:', err);
                    }
                    return {
                        id: song.id || '',
                        title: song.title,
                        key: song.key,
                        timeSignature: song.timeSignature,
                        tempo: song.tempo,
                        username: username,
                        userId: song.userId,
                        createdAt: song.createdAt
                    };
                }));
                setSongs(sortSongs(songsWithUserData, sortMethod));
            }
            catch (error) {
                console.error('Error fetching songs:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAllSongs();
    }, [sortMethod]);
    useEffect(() => {
        setAnimationsReady(false);
        const timer = setTimeout(() => {
            setAnimationsReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [songs]);
    const sortSongs = (songsToSort, method) => {
        switch (method) {
            case 'recent':
                return [...songsToSort].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'random':
                return [...songsToSort].sort(() => Math.random() - 0.5);
            default:
                return songsToSort;
        }
    };
    const handleSortChange = (method) => {
        setSortMethod(method);
        setSongs(sortSongs([...songs], method));
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getAnimationDelay = (index) => {
        return `${index * 100}ms`;
    };
    return (_jsxs("div", { className: "bg-[#0c141c] min-h-screen text-white", children: [_jsx(Header, {}), _jsxs("div", { className: "p-4 md:p-8", children: [_jsx("h1", { className: "text-2xl md:text-4xl text-[#04e073] mb-8 text-center font-bold", children: "Discover Music From All Users" }), _jsxs("div", { className: "flex justify-center mb-8 gap-4 flex-wrap", children: [_jsxs("button", { onClick: () => handleSortChange('recent'), className: `flex items-center gap-2 px-4 py-2 rounded-md border-none cursor-pointer ${sortMethod === 'recent'
                                    ? 'bg-[#04e073] text-black'
                                    : 'bg-[#1e2638] text-white hover:bg-[#2a324d]'} transition-colors`, children: [_jsx(FaClock, {}), " Most Recent"] }), _jsxs("button", { onClick: () => handleSortChange('random'), className: `flex items-center gap-2 px-4 py-2 rounded-md border-none cursor-pointer ${sortMethod === 'random'
                                    ? 'bg-[#04e073] text-black'
                                    : 'bg-[#1e2638] text-white hover:bg-[#2a324d]'} transition-colors`, children: [_jsx(FaRandom, {}), " Random"] })] }), loading ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { children: "Loading songs..." }) })) : songs.length === 0 ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-gray-300 text-lg", children: "No hay canciones disponibles en este momento." }) })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4", children: songs.map((song, index) => (_jsxs("div", { className: `bg-[#162032] rounded-lg overflow-hidden cursor-pointer shadow-md hover:-translate-y-[1px] transition-transform duration-200 border border-[#1e293b] opacity-0 translate-y-8 ${animationsReady ? 'animate-slide-in' : ''}`, onClick: () => navigate(`/song/${song.id}`), style: { animationDelay: getAnimationDelay(index) }, children: [_jsxs("div", { className: "text-[#04e073] p-3 border-b border-[#1e293b] flex items-center", children: [_jsx(FaUser, { className: "mr-2" }), _jsx("span", { children: song.username })] }), _jsxs("div", { className: "relative h-40 bg-[#11192a] flex items-center justify-center p-4", children: [_jsx("div", { className: "w-24 h-24 border-2 border-[#04e073] rounded-full flex items-center justify-center bg-[#0c141c] shadow-inner", children: _jsx(FaMusic, { className: "text-4xl text-[#04e073]" }) }), _jsx("button", { onClick: (event) => {
                                                event.stopPropagation();
                                                navigate(`/song/${song.id}`);
                                            }, className: "absolute bottom-4 right-4 bg-[#04e073] text-black w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-[#03d069] transition-colors shadow-md", children: _jsx(FaPlay, {}) })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-xl mb-2 truncate font-medium text-gray-100", children: song.title }), _jsxs("div", { className: "text-gray-300 text-sm mb-4 flex flex-wrap gap-4", children: [_jsxs("div", { className: "px-2 py-1 rounded bg-[#1e2638] inline-block", children: ["Key: ", song.key] }), _jsx("div", { className: "px-2 py-1 rounded bg-[#1e2638] inline-block", children: song.timeSignature }), _jsxs("div", { className: "px-2 py-1 rounded bg-[#1e2638] inline-block", children: [song.tempo, " BPM"] })] }), _jsx("div", { className: "text-gray-400 text-sm flex items-center gap-2", children: _jsxs("span", { children: ["Created: ", formatDate(song.createdAt)] }) })] })] }, song.id))) })), _jsx("div", { className: "text-center mt-8", children: _jsx(Link, { to: "/dashboard", className: "inline-block bg-[#04e073] text-black py-3 px-6 rounded-md no-underline font-bold hover:bg-[#03c664] transition-colors shadow-md", children: "Volver al Dashboard" }) })] }), _jsx("style", { children: `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease forwards;
        }
      ` })] }));
};
export default DiscoverPage;
