import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminRoomsThunk, createAdminRoomThunk, updateAdminRoomThunk } from '../store/roomSlice';
import Header from '../components/Header';
import GlassContainer from '../components/GlassContainer';
import { Plus, Edit2, CheckCircle2, AlertTriangle, Hammer } from 'lucide-react';

const RoomsManager = () => {
  const rooms = useSelector((state) => state.rooms.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminRoomsThunk());
  }, [dispatch]);

  const [isAdding, setIsAdding] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('Standard');
  const [pricePerNight, setPricePerNight] = useState('');
  const [capacity, setCapacity] = useState('2');

  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!roomNumber || !pricePerNight) return;

    // Use default hotel from seeder
    dispatch(createAdminRoomThunk({
      hotel: 'hotel-california-id', // backend handles binding or falls back
      roomNumber,
      type,
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      status: 'Available',
      amenities: []
    })).then(() => {
      dispatch(fetchAdminRoomsThunk());
    });

    setRoomNumber('');
    setPricePerNight('');
    setIsAdding(false);
  };

  const startEdit = (room) => {
    const roomId = room._id || room.id;
    setEditingId(roomId);
    setEditPrice(room.pricePerNight.toString());
  };

  const saveCost = (id) => {
    dispatch(updateAdminRoomThunk({ id, updateData: { pricePerNight: Number(editPrice) } })).then(() => {
      dispatch(fetchAdminRoomsThunk());
    });
    setEditingId(null);
  };

  const toggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Under Maintenance' : 'Available';
    dispatch(updateAdminRoomThunk({ id, updateData: { status: nextStatus } })).then(() => {
      dispatch(fetchAdminRoomsThunk());
    });
  };

  return (
    <>
      <Header 
        title="Rooms & Pricing Manager" 
        subtitle="Manage room inventory, rates/night, and manually toggle operational or maintenance states." 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Create room trigger */}
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
            <Plus size={16} />
            <span>{isAdding ? 'Close Panel' : 'Register New Room'}</span>
          </button>
        </div>

        {isAdding && (
          <GlassContainer title="Register New Room">
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Room Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 404"
                  value={roomNumber} 
                  onChange={(e) => setRoomNumber(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Room Type</label>
                <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Price per Night (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="200"
                  value={pricePerNight} 
                  onChange={(e) => setPricePerNight(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Capacity (Guests)</label>
                <select className="form-input" value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                <button type="submit" className="btn btn-primary">Save Room Details</button>
              </div>
            </form>
          </GlassContainer>
        )}

        {/* Rooms Listing Table */}
        <GlassContainer title="Room Catalog & Cost Controls">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Room No.</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Price per Night</th>
                  <th>Availability Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const roomId = room._id || room.id;
                  return (
                    <tr key={roomId}>
                      <td style={{ fontWeight: 700 }}>Room {room.roomNumber}</td>
                      <td>
                        <span className="badge badge-info">{room.type}</span>
                      </td>
                      <td>{room.capacity} Guests</td>
                      <td>
                        {editingId === roomId ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>₹</span>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ width: '80px', padding: '6px' }}
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                            />
                            <button onClick={() => saveCost(roomId)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Save</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>₹{room.pricePerNight}</span>
                            <button onClick={() => startEdit(room)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}>
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          room.status === 'Available' ? 'badge-success' :
                          room.status === 'Occupied' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {room.status !== 'Occupied' ? (
                            <button 
                              onClick={() => toggleStatus(roomId, room.status)} 
                              className={`btn ${room.status === 'Available' ? 'btn-danger' : 'btn-secondary'}`}
                              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            >
                              {room.status === 'Available' ? (
                                <>
                                  <Hammer size={12} />
                                  <span>Put to Repair</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={12} />
                                  <span>Mark Available</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', italic: 'true' }}>Occupied (Locked)</span>
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

export default RoomsManager;
