import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMusic, FaArrowLeft, FaCamera, FaInstagram, FaTwitter, FaSoundcloud, FaSpotify } from 'react-icons/fa';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: 'Alex Rodriguez',
    username: 'alexmusic',
    bio: 'Electronic music producer and DJ based in Miami. Creating vibes since 2018. Available for collaborations.',
    location: 'Miami, FL',
    website: 'alexmusic.com',
    instagram: 'alexmusic',
    twitter: 'alexmusic',
    soundcloud: 'alexmusic',
    spotify: 'alexmusic'
  });
  
  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica para guardar los cambios
    navigate('/profile');
  };
  
  return (
    <div style={{ 
      backgroundColor: 'var(--background-darker)',
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      {/* Header/Navigation */}
      <header style={{ 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'var(--accent-green)',
            marginRight: '3rem',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}>
            <FaMusic style={{ marginRight: '0.5rem' }} />
            Chordia
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <div style={{ 
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <Link to="/profile" style={{ 
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            marginRight: '1rem'
          }}>
            <FaArrowLeft />
          </Link>
          <h1>Edit Profile</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div style={{ 
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <img 
                src="/placeholder.svg?height=150&width=150" 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}>
                  <FaCamera style={{ marginRight: '0.5rem' }} />
                  <span>Change</span>
                  <input type="file" style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Recommended: Square JPG or PNG, at least 300x300px
            </p>
          </div>
          
          {/* Profile Banner */}
          <div style={{ 
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '100%',
              height: '150px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '1rem',
              background: 'linear-gradient(90deg, #004d40 0%, #00796b 100%)'
            }}>
              <div style={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}>
                  <FaCamera style={{ marginRight: '0.5rem' }} />
                  <span>Change Banner</span>
                  <input type="file" style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Recommended: 1500x500px JPG or PNG
            </p>
          </div>
          
          {/* Basic Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Basic Information</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Name
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }}>
                  @
                </span>
                <input 
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    paddingLeft: '2rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Bio
              </label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Location
              </label>
              <input 
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Website
              </label>
              <input 
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          
          {/* Social Links */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Social Links</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Instagram
              </label>
              <div style={{ position: 'relative' }}>
                <FaInstagram style={{ 
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} />
                <input 
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    paddingLeft: '2.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Twitter
              </label>
              <div style={{ position: 'relative' }}>
                <FaTwitter style={{ 
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} />
                <input 
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    paddingLeft: '2.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                SoundCloud
              </label>
              <div style={{ position: 'relative' }}>
                <FaSoundcloud style={{ 
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} />
                <input 
                  type="text"
                  name="soundcloud"
                  value={formData.soundcloud}
                  onChange={handleChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    paddingLeft: '2.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Spotify
              </label>
              <div style={{ position: 'relative' }}>
                <FaSpotify style={{ 
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} />
                <input 
                  type="text"
                  name="spotify"
                  value={formData.spotify}
                  onChange={handleChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    paddingLeft: '2.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <Link to="/profile" style={{ 
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: 'bold'
            }}>
              Cancel
            </Link>
            
            <button 
              type="submit"
              style={{ 
                backgroundColor: 'var(--accent-green)',
                color: '#000',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;