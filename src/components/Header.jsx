import React from 'react';
import { useSelector } from 'react-redux';
import { Bell, Sparkles } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header 
      className="glass-panel" 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px',
        borderRadius: '16px',
        width: '100%',
        marginBottom: '10px'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Quick notification indicator */}
        <button 
          style={{ 
            background: 'rgba(255, 255, 255, 0.04)', 
            border: '1px solid var(--border-glass)', 
            padding: '10px', 
            borderRadius: '10px', 
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} />
          <span 
            style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              width: '8px', 
              height: '8px', 
              background: 'var(--accent-secondary)', 
              borderRadius: '50%' 
            }}
          />
        </button>

        {/* Profile Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'var(--accent-gradient)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800
            }}
          >
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name || 'Administrator'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role || 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
