import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, trend, trendColor }) => {
  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>
          {value}
        </span>
        {trend && (
          <span style={{ fontSize: '0.75rem', color: trendColor || 'var(--text-muted)', fontWeight: 500 }}>
            {trend}
          </span>
        )}
      </div>

      <div 
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: color ? `${color}15` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${color ? `${color}30` : 'var(--border-glass)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color || 'var(--text-main)'
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatCard;
