import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMusic, FaEnvelope, FaLock, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    // Aquí iría la lógica de autenticación
    
    // Redirigir al dashboard después de iniciar sesión
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--background-darker)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{ 
        backgroundColor: '#1a2332',
        borderRadius: '8px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <FaMusic style={{ fontSize: '2rem', color: 'var(--accent-green)' }} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome to Chordia</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Your creative journey begins here
        </p>
        
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <button 
            onClick={() => setActiveTab('login')}
            style={{ 
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '0.75rem',
              color: activeTab === 'login' ? 'var(--accent-green)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'login' ? '2px solid var(--accent-green)' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Login
          </button>
          <Link 
            to="/register"
            style={{ 
              flex: 1,
              textDecoration: 'none',
              padding: '0.75rem',
              color: 'var(--text-secondary)',
              display: 'block'
            }}
          >
            Register
          </Link>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ 
            position: 'relative', 
            marginBottom: '1rem'
          }}>
            <FaEnvelope style={{ 
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ 
            position: 'relative', 
            marginBottom: '1rem'
          }}>
            <FaLock style={{ 
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                style={{ marginRight: '0.5rem' }}
              />
              Remember me
            </label>
            
            <a 
              href="#" 
              style={{ 
                color: 'var(--accent-green)',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              Forgot password?
            </a>
          </div>
          
          <button 
            type="submit"
            style={{ 
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--accent-green)',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            Sign in
          </button>
        </form>
        
        {/* Social Login */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Or continue with
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ 
              flex: 1,
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <FaGoogle />
            </button>
            
            <button style={{ 
              flex: 1,
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <FaFacebook />
            </button>
            
            <button style={{ 
              flex: 1,
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <FaApple />
            </button>
          </div>
        </div>
        
        {/* Create Account */}
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-green)', textDecoration: 'none' }}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;