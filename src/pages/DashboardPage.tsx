import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaSearch, FaStar, FaRegStar, FaPlay, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Header from "../components/Header";

const DashboardPage: React.FC = () => {
  // Función para renderizar estrellas de dificultad
  const renderDifficultyStars = (level: number) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      if (i < level) {
        stars.push(<FaStar key={i} style={{ color: 'var(--accent-green)' }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: 'var(--text-secondary)' }} />);
      }
    }
    return stars;
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--background-darker)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{ 
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(to right, var(--background-darker), rgba(21, 33, 45, 0.9))',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '600px', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'var(--accent-green)',
            marginBottom: '1rem'
          }}>
            Create Music Magic with Chordia
          </h1>
          
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Your ultimate platform for chord progression and song creation.
            Transform your musical ideas into reality.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/create" style={{ 
              backgroundColor: 'var(--accent-green)',
              color: '#000',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Create Custom Song
            </Link>
            
            <Link to="/library" style={{ 
              border: '1px solid var(--accent-green)',
              color: 'var(--accent-green)',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Browse Library
            </Link>
          </div>
        </div>
        
        {/* Background music notes would be here */}
        <div style={{ 
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

        }}>
          {/* This would be a background image or SVG with music notes */}
        </div>
      </section>
      
      {/* Popular Songs Section */}
      <section style={{ padding: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.75rem',
          color: 'var(--accent-green)',
          marginBottom: '2rem'
        }}>
          Popular Songs
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Song Card 1 */}
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: 'var(--accent-green)'
            }}>
              <FaMusic />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Wonderwall</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Oasis</p>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Difficulty:</span>
                <span style={{ display: 'inline-flex', gap: '0.25rem' }}>
                  {renderDifficultyStars(2)}
                </span>
              </div>
              
              <button style={{ 
                backgroundColor: 'var(--accent-green)',
                color: '#000',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}>
                <FaPlay />
              </button>
            </div>
          </div>
          
          {/* Song Card 2 */}
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: 'var(--accent-green)'
            }}>
              <FaMusic />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Hallelujah</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Jeff Buckley</p>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Difficulty:</span>
                <span style={{ display: 'inline-flex', gap: '0.25rem' }}>
                  {renderDifficultyStars(3)}
                </span>
              </div>
              
              <button style={{ 
                backgroundColor: 'var(--accent-green)',
                color: '#000',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}>
                <FaPlay />
              </button>
            </div>
          </div>
          
          {/* Song Card 3 */}
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: 'var(--accent-green)'
            }}>
              <FaMusic />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Perfect</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Ed Sheeran</p>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Difficulty:</span>
                <span style={{ display: 'inline-flex', gap: '0.25rem' }}>
                  {renderDifficultyStars(2)}
                </span>
              </div>
              
              <button style={{ 
                backgroundColor: 'var(--accent-green)',
                color: '#000',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}>
                <FaPlay />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Create Your Own Song Section */}
      <section style={{ 
        padding: '4rem 2rem',
        backgroundColor: 'var(--background-dark)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '2.5rem',
            color: 'var(--accent-green)',
            marginBottom: '1.5rem'
          }}>
            Create Your Own Song
          </h2>
          
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: 1.6,
            maxWidth: '500px'
          }}>
            Start from scratch and compose your masterpiece. Our intuitive
            chord editor makes it easy to bring your musical vision to life.
          </p>
          
          <Link to="/create" style={{ 
            backgroundColor: 'var(--accent-green)',
            color: '#000',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Start Creating Now
          </Link>
        </div>
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ 
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Esta sería la imagen circular con notas musicales verdes */}
            <div style={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, #000 60%, var(--accent-green) 100%)',
              opacity: 0.5
            }}></div>
            
            {/* Aquí podrías agregar SVGs o imágenes de notas musicales */}
            <FaMusic style={{ 
              color: 'var(--accent-green)', 
              fontSize: '4rem',
              position: 'relative',
              zIndex: 1
            }} />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--background-darker)',
        padding: '3rem 2rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Logo and Tagline */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'var(--accent-green)',
              marginBottom: '1rem',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              <FaMusic style={{ marginRight: '0.5rem' }} />
              Chordia
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your musical journey starts here.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/library" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Browse Songs
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/create" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Create Song
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Resources</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/help" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Help Center
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Terms of Service
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Connect</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                <FaTwitter />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                <FaInstagram />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div style={{ 
          textAlign: 'center',
          color: 'var(--text-secondary)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          fontSize: '0.875rem'
        }}>
          &copy; 2023 Chordia. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;