import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMusic, FaPlay, FaEdit, FaTrash, FaClock, FaPlus } from 'react-icons/fa';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getUserSongs, deleteSongById, type Song } from '../firebase/songService';
import Swal from 'sweetalert2';
const MiniPiano = ({ chord }: { chord: { keys: string[], selected: boolean } }) => {
  const chordNotes = chord.keys.map(k => k.split('-')[0]);
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const hasBlackKeyAfter = [true, true, false, true, true, true, false];
  return (
    <div className="relative h-[30px] w-full">
      <div className="flex h-full w-full">
        {whiteKeys.map((note, idx) => (
          <div
            key={`mini-white-${idx}`}
            className={`flex-1 h-full relative z-[1] border border-[#4b5563] rounded-b-[2px] ${
              chordNotes.includes(note) ? "bg-[var(--accent-green)]" : "bg-white"
            }`}
          />
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-[60%]">
        {whiteKeys.map((note, idx) => {
          if (!hasBlackKeyAfter[idx]) return null;
          const blackKeyNames = ["C#", "D#", "F#", "G#", "A#"];
          const blackKeyIdx = [0, 1, 3, 4, 5].indexOf(idx);
          if (blackKeyIdx === -1) return null;
          const blackNote = blackKeyNames[blackKeyIdx];
          const isSelected = chordNotes.includes(blackNote);
          const position = (idx + 1) / whiteKeys.length;
          return (
            <div
              key={`mini-black-${idx}`}
              className={`absolute h-full w-[16%] z-[2] rounded-b-[2px] border-l border-r border-[#4b5563] box-border`}
              style={{
                left: `calc(${position * 100}% - 9%)`,
                backgroundColor: isSelected ? "var(--accent-green)" : "black",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
const LibraryPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleSongs, setVisibleSongs] = useState<number>(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSongs = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const userSongs = await getUserSongs(currentUser.uid);
        setSongs(userSongs);
        setVisibleSongs(0);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load your songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [currentUser]);
  useEffect(() => {
    if (!loading && songs.length > 0 && visibleSongs < songs.length) {
      const timer = setTimeout(() => {
        setVisibleSongs(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, songs.length, visibleSongs]);
  const handleDeleteSong = (songId: string, title: string) => {
    Swal.fire({
      title: 'Delete Song',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent-green)',
      cancelButtonColor: '#ef4444',
      confirmButtonText: '<span style="color: black;">Yes, delete it!</span>',
      background: 'var(--background-darker)',
      color: 'var(--text-secondary)',
      titleColor: 'var(--accent-green)',
    }).then(async (result) => {
      if (result.isConfirmed) {
      try {
      await deleteSongById(songId);
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
      Swal.fire(
      'Deleted!',
      'Your song has been deleted.',
      'success'
      );
      } catch (error) {
      console.error('Error deleting song:', error);
      Swal.fire(
      'Error',
      'There was a problem deleting your song. Please try again.',
      'error'
      );
      }
      }
    });
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <div className="bg-[var(--background-darker)] min-h-screen text-[var(--text-primary)]">
      <Header />
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl md:text-4xl text-[var(--accent-green)] font-bold mb-4 sm:mb-0">
            Your Music Library
          </h1>
          <Link 
            to="/create" 
            className="flex items-center gap-2 bg-[var(--accent-green)] text-black px-4 py-2 rounded-md font-bold text-sm no-underline"
          >
            <FaPlus /> Create New Song
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            Loading your songs...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-[#ef4444]">
            {error}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-12 bg-[rgba(255,255,255,0.08)] rounded-lg">
            <FaMusic className="text-5xl text-[var(--text-secondary)] mx-auto mb-4" />
            <h2 className="mb-4 text-[var(--text-secondary)] text-xl">
              Your library is empty
            </h2>
            <p className="mb-8 text-[var(--text-secondary)]">
              Create your first song to see it here
            </p>
            <Link 
              to="/create" 
              className="bg-[var(--accent-green)] text-black px-6 py-3 rounded-md no-underline font-bold"
            >
              Create Song
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {songs.slice(0, visibleSongs).map((song, index) => (
              <div 
                key={song.id}
                className="bg-[#1a223a] rounded-lg overflow-hidden  cursor-pointer shadow-md hover:-translate-y-[1px] transition-transform duration-200 opacity-0 animate-slideUp"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
                onClick={() => navigate(`/song/${song.id}`)}
              >
                <div className="relative h-40 bg-[#162032] flex items-center justify-center p-4">
                  <div className="w-24 h-24 border-2 border-[var(--accent-green)] rounded-full flex items-center justify-center">
                    <FaMusic className="text-4xl text-[var(--accent-green)]" />
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/song/${song.id}`);
                    }}
                    className="absolute bottom-4 right-4 bg-[var(--accent-green)] text-black w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer"
                  >
                    <FaPlay />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-xl mb-2 truncate font-medium">
                    {song.title}
                  </h3>
                  <div className="text-[var(--text-secondary)] text-sm mb-4 flex flex-wrap gap-4">
                    <div className="px-2 py-1 rounded bg-[#162032] inline-block">Key: {song.key}</div>
                    <div className="px-2 py-1 rounded bg-[#162032] inline-block">{song.timeSignature}</div>
                    <div className="px-2 py-1 rounded bg-[#162032] inline-block">{song.tempo} BPM</div>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-[var(--text-secondary)] text-sm">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-xs" />
                      <span>{formatDate(song.createdAt)}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteSong(song.id as string, song.title);
                        }}
                        className="bg-transparent border-none text-[#ef4444] cursor-pointer flex items-center text-base"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const AnimationStyle = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes slideUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-slideUp {
        animation: slideUp 0.5s ease forwards;
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  return null;
};
const EnhancedLibraryPage: React.FC = () => {
  return (
    <>
      <AnimationStyle />
      <LibraryPage />
    </>
  );
};
export default EnhancedLibraryPage;