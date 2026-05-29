import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminRoomsThunk } from '../store/roomSlice';
import { fetchAdminBookingsThunk } from '../store/bookingSlice';
import { fetchInventoryThunk } from '../store/inventorySlice';
import { fetchStaffThunk } from '../store/staffSlice';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import GlassContainer from '../components/GlassContainer';
import { 
  IndianRupee, 
  Bed, 
  Boxes, 
  Users, 
  AlertCircle, 
  TrendingUp 
} from 'lucide-react';

const Dashboard = () => {
  const rooms = useSelector((state) => state.rooms.list);
  const bookings = useSelector((state) => state.bookings.list);
  const inventory = useSelector((state) => state.inventory.list);
  const staff = useSelector((state) => state.staff.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminRoomsThunk());
    dispatch(fetchAdminBookingsThunk());
    dispatch(fetchInventoryThunk());
    dispatch(fetchStaffThunk());
  }, [dispatch]);

  // Calculate statistics
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid' || b.bookingStatus === 'Confirmed' || b.bookingStatus === 'CheckedIn')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const activeStays = bookings.filter(b => b.bookingStatus === 'CheckedIn').length;
  
  // Occupancy rate
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Inventory warnings
  const lowStockCount = inventory.filter(item => item.quantity <= item.safetyStockLevel).length;

  return (
    <>
      <Header 
        title="Dashboard" 
        subtitle="Real-time revenue, occupancy statistics, and material inventory monitors." 
      />

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue}`} 
          icon={IndianRupee} 
          color="#00e676" 
          trend="+12.4% from last week" 
          trendColor="var(--success)" 
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${occupancyRate}%`} 
          icon={Bed} 
          color="#00e5ff" 
          trend={`${occupiedRooms} of ${totalRooms} Rooms Occupied`} 
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockCount} 
          icon={Boxes} 
          color={lowStockCount > 0 ? '#ff1744' : '#ffd600'} 
          trend={lowStockCount > 0 ? 'Requires attention' : 'All stocks stable'} 
          trendColor={lowStockCount > 0 ? 'var(--danger)' : 'var(--text-muted)'} 
        />
        <StatCard 
          title="Active Staff deployed" 
          value={staff.filter(s => s.status === 'Active').length} 
          icon={Users} 
          color="#7c4dff" 
          trend="Across 5 departments" 
        />
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Active Bookings Summary */}
        <div style={{ flex: '2', minWidth: '400px' }}>
          <GlassContainer title="Recent Active Stays">
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking) => {
                    const bookingId = booking._id || booking.id;
                    return (
                      <tr key={bookingId}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{booking.guest?.name || 'Guest'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.guest?.email || ''}</div>
                        </td>
                        <td>{booking.roomNumber} ({booking.roomType})</td>
                        <td>{new Date(booking.checkInDate).toLocaleDateString()} to {new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            booking.bookingStatus === 'CheckedIn' ? 'badge-success' :
                            booking.bookingStatus === 'Confirmed' ? 'badge-info' : 'badge-warning'
                          }`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700 }}>₹{booking.totalAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassContainer>
        </div>

        {/* Low Stock supplies panel */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <GlassContainer title="Safety Stock Alerts">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inventory.map((item) => {
                const itemId = item._id || item.id;
                const isAlert = item.quantity <= item.safetyStockLevel;
                return (
                  <div 
                    key={itemId} 
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      background: isAlert ? 'rgba(255, 23, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isAlert ? 'rgba(255, 23, 68, 0.15)' : 'var(--border-glass)'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock: {item.quantity} {item.unit}</div>
                    </div>
                    {isAlert && (
                      <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <AlertCircle size={14} />
                        <span>Low</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassContainer>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
