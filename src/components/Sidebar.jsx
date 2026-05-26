import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarDays, 
  Boxes, 
  Users, 
  Car, 
  Sparkles, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/rooms', label: 'Rooms & Pricing', icon: BedDouble },
    { path: '/bookings', label: 'Guest Stays', icon: CalendarDays },
    { path: '/inventory', label: 'Inventory & Supplies', icon: Boxes },
    { path: '/staff', label: 'Staff & Deploy', icon: Users },
    { path: '/transport', label: 'Transport Fleet', icon: Car },
    { path: '/amenities', label: 'Amenities', icon: Sparkles }
  ];

  return (
    <aside 
      className="glass-panel" 
      style={{
        position: 'fixed',
        left: '20px',
        top: '20px',
        bottom: '20px',
        width: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        zIndex: 100,
        borderRadius: '24px'
      }}
    >
      {/* Brand Logo */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          <span className="gradient-text">HotelCal</span>
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>
          Admin Panel
        </p>
      </div>

      {/* Nav Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={({ isActive }) => ({
                justifyContent: 'flex-start',
                width: '100%',
                padding: '12px 16px',
                fontSize: '0.9rem',
                border: 'none',
                background: isActive ? undefined : 'transparent'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Administrator'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 }}>{user?.role || 'Admin'}</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
