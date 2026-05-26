import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdminThunk } from '../store/authSlice';
import { Lock, Mail, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@hotelcal.com');
  const [password, setPassword] = useState('password123');
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginAdminThunk({ email, password })).then((res) => {
      if (!res.error) {
        navigate('/');
      }
    });
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #121420 0%, #0a0b10 100%)',
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
            <span className="gradient-text">Hotel California</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
            Administrative Control Panel
          </p>
        </div>

        {error && (
          <div 
            style={{ 
              background: 'rgba(255, 23, 68, 0.1)', 
              border: '1px solid rgba(255, 23, 68, 0.2)', 
              color: 'var(--danger)', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px', width: '100%' }}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px', width: '100%' }}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Demo Mode enabled. Use seeded credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
