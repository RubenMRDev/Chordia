import React from 'react';

const Experience: React.FC = () => {
  return (
    <section className="section" style={{ 
      backgroundColor: 'var(--background-darker)',
      padding: '5rem 0'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '2rem'
          }}>
            Experience Music Like Never Before
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Real-time Chord Recognition
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Instantly see chord names and progressions as you play.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Smart Practice Tools
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Track your progress and get personalized recommendations.
            </p>
          </div>

          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Community Sharing
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Share your arrangements and collaborate with other musicians.
            </p>
          </div>
        </div>

        <div style={{ 
          position: 'relative',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green) 50%, transparent 50%)',
            zIndex: 0,
            borderRadius: '12px'
          }}></div>
          <img 
            src="/src/assets/phone-mockup.png" 
            alt="Chordia App" 
            style={{
              width: '100%',
              position: 'relative',
              zIndex: 1
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Experience;