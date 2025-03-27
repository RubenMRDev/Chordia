import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FaMusic, FaPlay, FaUser, FaSort, FaRandom, FaClock } from 'react-icons/fa';
import { getAllSongs, type Song as FirebaseSong } from '../firebase/songService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface DisplaySong {
  id: string;
  title: string;
  key: string;
  timeSignature: string;
  tempo: number;
  username: string;
  userId: string;
  createdAt: string;
}

type SortMethod = 'recent' | 'random';

const DiscoverPage: React.FC = () => {
  const [songs, setSongs] = useState<DisplaySong[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState<SortMethod>('recent');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        setLoading(true);
        const allSongs = await getAllSongs();
        
        // Process songs to include username
        const songsWithUserData = await Promise.all(
          allSongs.map(async (song) => {
            let username = '@user';
            
            // Try to fetch the username from the users collection
            try {
              const userDoc = await getDoc(doc(db, "users", song.userId));
              if (userDoc.exists()) {
                // Adjust this based on your user data structure
                username = '@' + (userDoc.data().username || 
                                  userDoc.data().displayName || 
                                  userDoc.data().email?.split('@')[0] || 
                                  'user');
              }
            } catch (err) {
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
          })
        );
        
        setSongs(sortSongs(songsWithUserData, sortMethod));
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllSongs();
  }, [sortMethod]);

  const sortSongs = (songsToSort: DisplaySong[], method: SortMethod): DisplaySong[] => {
    switch (method) {
      case 'recent':
        return [...songsToSort].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'random':
        return [...songsToSort].sort(() => Math.random() - 0.5);
      default:
        return songsToSort;
    }
  };

  const handleSortChange = (method: SortMethod) => {
    setSortMethod(method);
    setSongs(sortSongs([...songs], method));
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
        <h1 style={{ 
          fontSize: '2.5rem',
          color: 'var(--accent-green)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Discover Music From All Users
        </h1>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <button
            onClick={() => handleSortChange('recent')}
            style={{
              backgroundColor: sortMethod === 'recent' ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)',
              color: sortMethod === 'recent' ? '#000' : 'var(--text-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaClock /> Most Recent
          </button>
          <button
            onClick={() => handleSortChange('random')}
            style={{
              backgroundColor: sortMethod === 'random' ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)',
              color: sortMethod === 'random' ? '#000' : 'var(--text-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaRandom /> Random
          </button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading songs...</p>
          </div>
        ) : songs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              No hay canciones disponibles en este momento.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem',
            padding: '1rem'
          }}>
            {songs.map((song) => (
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
                  color: 'var(--accent-green)', 
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  <span>{song.username}</span>
                </div>
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
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>Created: {formatDate(song.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/dashboard" style={{ 
            display: 'inline-block',
            backgroundColor: 'var(--accent-green)',
            color: '#000',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;