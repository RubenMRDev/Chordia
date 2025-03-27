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
    <div style={{ position: "relative", height: "30px", width: "100%" }}>
      
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        {whiteKeys.map((note, idx) => (
          <div
            key={`mini-white-${idx}`}
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: chordNotes.includes(note) ? "var(--accent-green)" : "white",
              border: "1px solid #4b5563",
              borderRadius: "0 0 2px 2px",
              position: "relative",
              zIndex: 1,
            }}
          />
        ))}
      </div>
      
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%" }}>
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
              style={{
                position: "absolute",
                height: "100%",
                left: `calc(${position * 100}% - 9%)`,
                backgroundColor: isSelected ? "var(--accent-green)" : "black",
                zIndex: 2,
                width: "16%",
                borderRadius: "0 0 2px 2px",
                borderLeft: "1px solid #4b5563",
                borderRight: "1px solid #4b5563",
                boxSizing: "border-box",
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSongs = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const userSongs = await getUserSongs(currentUser.uid);
        setSongs(userSongs);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load your songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [currentUser]);
  const handleDeleteSong = (songId: string, title: string) => {
    Swal.fire({
      title: 'Delete Song',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent-green)',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
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
    <div style={{ 
      backgroundColor: 'var(--background-darker)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      <Header />
      <div style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            color: 'var(--accent-green)',
          }}>
            Your Music Library
          </h1>
          <Link to="/create" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--accent-green)',
            color: '#000',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            <FaPlus /> Create New Song
          </Link>
        </div>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            color: 'var(--text-secondary)' 
          }}>
            Loading your songs...
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            color: '#ef4444' 
          }}>
            {error}
          </div>
        ) : songs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px'
          }}>
            <FaMusic style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Your library is empty
            </h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Create your first song to see it here
            </p>
            <Link to="/create" style={{ 
              backgroundColor: 'var(--accent-green)',
              color: '#000',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Create Song
            </Link>
          </div>
        ) : (
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
                onClick={() => navigate(`/song/${song.id}`)}
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
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/song/${song.id}`);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      backgroundColor: 'var(--accent-green)',
                      color: '#000',
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <FaPlay />
                  </button>
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaClock style={{ fontSize: '0.875rem' }} />
                      <span>{formatDate(song.createdAt)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteSong(song.id as string, song.title);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '1rem'
                        }}
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
export default LibraryPage;