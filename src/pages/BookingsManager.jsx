import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminBookingsThunk, checkInGuestThunk, checkOutGuestThunk } from '../store/bookingSlice';
import Header from '../components/Header';
import GlassContainer from '../components/GlassContainer';
import { UserCheck, UserMinus, CreditCard } from 'lucide-react';

const BookingsManager = () => {
  const bookings = useSelector((state) => state.bookings.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminBookingsThunk());
  }, [dispatch]);

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const handleCheckIn = (id) => {
    dispatch(checkInGuestThunk(id)).then(() => {
      dispatch(fetchAdminBookingsThunk());
    });
  };

  const handleCheckOut = (id) => {
    dispatch(checkOutGuestThunk({ id, paymentMethod })).then(() => {
      dispatch(fetchAdminBookingsThunk());
    });
    setSelectedBookingId(null);
  };

  return (
    <>
      <Header 
        title="Guest Bookings & Stays" 
        subtitle="Manage guest reservations, automate check-ins, process departures, and settle invoices." 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Checkout Modal overlay */}
        {selectedBookingId && (
          <GlassContainer title="Process Departure & Billing Settle">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '0.95rem' }}>Select the preferred payment method to settle the guest invoice and release room.</p>
              
              <div className="form-group" style={{ maxWidth: '300px' }}>
                <label className="form-label">Payment Gateway</label>
                <select className="form-input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / Digital Wallet</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleCheckOut(selectedBookingId)} 
                  className="btn btn-primary"
                >
                  <CreditCard size={16} />
                  <span>Settle & Check-Out</span>
                </button>
                <button onClick={() => setSelectedBookingId(null)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </GlassContainer>
        )}

        <GlassContainer title="Reservations Log">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Room Allocation</th>
                  <th>Check-In / Out</th>
                  <th>Total Stay Cost</th>
                  <th>Stay Status</th>
                  <th>Billing Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const bookingId = booking._id || booking.id;
                  const guestName = booking.guest?.name || 'Valued Guest';
                  const guestPhone = booking.guest?.phone || 'N/A';
                  const roomNumber = booking.room?.roomNumber || booking.roomNumber || 'N/A';
                  const roomType = booking.room?.type || booking.roomType || 'Standard';

                  return (
                    <tr key={bookingId}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{guestName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{guestPhone}</div>
                      </td>
                      <td>Room {roomNumber} ({roomType})</td>
                      <td>
                        <div>In: {new Date(booking.checkInDate).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Out: {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>${booking.totalAmount}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          booking.bookingStatus === 'CheckedIn' ? 'badge-success' :
                          booking.bookingStatus === 'CheckedOut' ? 'badge-secondary' :
                          booking.bookingStatus === 'Cancelled' ? 'badge-danger' : 'badge-info'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${booking.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                          {booking.paymentStatus || 'Unpaid'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {booking.bookingStatus === 'Confirmed' && (
                            <button 
                              onClick={() => handleCheckIn(bookingId)} 
                              className="btn btn-primary"
                              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            >
                              <UserCheck size={12} />
                              <span>Check-In</span>
                            </button>
                          )}

                          {booking.bookingStatus === 'CheckedIn' && (
                            <button 
                              onClick={() => setSelectedBookingId(bookingId)} 
                              className="btn btn-secondary"
                              style={{ padding: '8px 12px', fontSize: '0.8rem', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
                            >
                              <UserMinus size={12} />
                              <span>Check-Out</span>
                            </button>
                          )}

                          {(booking.bookingStatus === 'CheckedOut' || booking.bookingStatus === 'Cancelled') && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Archived</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassContainer>
      </div>
    </>
  );
};

export default BookingsManager;
