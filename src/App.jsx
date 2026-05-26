import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoomsManager from './pages/RoomsManager';
import BookingsManager from './pages/BookingsManager';
import InventoryManager from './pages/InventoryManager';
import StaffManager from './pages/StaffManager';
import TransportManager from './pages/TransportManager';
import AmenitiesManager from './pages/AmenitiesManager';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboards Dashboard Shell */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app-shell">
              {/* Left sidebar nav panel */}
              <Sidebar />

              {/* Main panel */}
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/rooms" element={<RoomsManager />} />
                  <Route path="/bookings" element={<BookingsManager />} />
                  <Route path="/inventory" element={<InventoryManager />} />
                  <Route path="/staff" element={<StaffManager />} />
                  <Route path="/transport" element={<TransportManager />} />
                  <Route path="/amenities" element={<AmenitiesManager />} />
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
