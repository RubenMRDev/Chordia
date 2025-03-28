import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaMusic, FaPlay, FaStar, FaRegStar, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Header from '../components/Header';
import { getAllSongs } from '../firebase/songService';
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
  difficulty?: number;
}

const DashboardPage: React.FC = () => {
  const [songs, setSongs] = useState<DisplaySong[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomSongs = async () => {
      try {
        setLoading(true);
        const allSongs = await getAllSongs();
        const songsWithUserData = await Promise.all(
          allSongs.map(async (song) => {
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
            } catch (err) {
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
          })
        );
        const randomSongs = [...songsWithUserData]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setSongs(randomSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRandomSongs();
  }, []);

  const renderDifficultyStars = (level: number) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      if (i < level) {
        stars.push(<FaStar key={i} style={{ color: 'var(--accent-green)' }} />);
      } else {
        stars.push(
          <FaRegStar key={i} style={{ color: 'var(--text-secondary)' }} />
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--background-darker)',
        minHeight: '100vh',
        color: 'var(--text-primary)',
      }}
    >
      <Header />
      <section
        style={{
          padding: '4rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(to right, var(--background-darker), rgba(21, 33, 45, 0.9))',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '600px', zIndex: 1 }}>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'var(--accent-green)',
              marginBottom: '1rem',
            }}
          >
            Create Music Magic with Chordia
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            Your ultimate platform for chord progression and song creation.
            Transform your musical ideas into reality.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/create"
              style={{
                backgroundColor: 'var(--accent-green)',
                color: '#000',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Create Custom Song
            </Link>
            <Link
              to="/library"
              style={{
                border: '1px solid var(--accent-green)',
                color: 'var(--accent-green)',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Browse Library
            </Link>
          </div>
        </div>
        <div
          style={{
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
          }}
        ></div>
      </section>
      <section style={{ padding: '2rem' }}>
        <h2
          style={{
            fontSize: '1.75rem',
            color: 'var(--accent-green)',
            marginBottom: '2rem',
          }}
        >
          Random Community Songs
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p>Loading songs...</p>
          </div>
        ) : songs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              No songs available at the moment.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {songs.map((song) => (
              <div
                key={song.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/song/${song.id}`)}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color: 'var(--accent-green)',
                  }}
                >
                  <FaMusic />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  <span>{song.username}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  {song.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {song.key} • {song.timeSignature} • {song.tempo} BPM
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                  }}
                >
                  Created: {formatDate(song.createdAt)}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        marginRight: '0.5rem',
                      }}
                    >
                      Difficulty:
                    </span>
                    <span style={{ display: 'inline-flex', gap: '0.25rem' }}>
                      {renderDifficultyStars(song.difficulty || 2)}
                    </span>
                  </div>
                  <button
                    style={{
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
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/song/${song.id}`);
                    }}
                  >
                    <FaPlay />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section
        style={{
          padding: '4rem 2rem',
          backgroundColor: 'var(--background-dark)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '2.5rem',
              color: 'var(--accent-green)',
              marginBottom: '1.5rem',
            }}
          >
            Create Your Own Song
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              marginBottom: '2rem',
              lineHeight: 1.6,
              maxWidth: '500px',
            }}
          >
            Start from scratch and compose your masterpiece. Our intuitive chord
            editor makes it easy to bring your musical vision to life.
          </p>
          <Link
            to="/create"
            style={{
              backgroundColor: 'var(--accent-green)',
              color: '#000',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            Start Creating Now
          </Link>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              backgroundColor: '#000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background:
                  'radial-gradient(circle, #000 60%, var(--accent-green) 100%)',
                opacity: 0.5,
              }}
            ></div>
            <FaMusic
              style={{
                color: 'var(--accent-green)',
                fontSize: '4rem',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </div>
      </section>
      <footer
        style={{
          backgroundColor: 'var(--background-darker)',
          padding: '3rem 2rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--accent-green)',
                marginBottom: '1rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
              }}
            >
              <FaMusic style={{ marginRight: '0.5rem' }} />
              Chordia
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your musical journey starts here.
            </p>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link
                  to="/dashboard"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link
                  to="/library"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Browse Songs
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link
                  to="/create"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Create Song
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Resources</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link
                  to="/help"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Help Center
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link
                  to="/terms"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Terms of Service
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link
                  to="/privacy"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Connect</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="#"
                style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          &copy; 2023 Chordia. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;