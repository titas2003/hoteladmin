import React from 'react';

const GlassContainer = ({ children, title, action, style }) => {
  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '30px', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        ...style 
      }}
    >
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '15px' }}>
          {title && <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default GlassContainer;
