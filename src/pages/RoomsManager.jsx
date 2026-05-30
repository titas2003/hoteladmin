import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAdminRoomsThunk, 
  createAdminRoomThunk, 
  updateAdminRoomThunk,
  deleteAdminRoomThunk 
} from '../store/roomSlice';
import { fetchAdminBookingsThunk } from '../store/bookingSlice';
import Header from '../components/Header';
import GlassContainer from '../components/GlassContainer';
import { 
  Plus, 
  Edit2, 
  CheckCircle2, 
  AlertTriangle, 
  Hammer, 
  Trash2, 
  Calendar, 
  X,
  FileText,
  User,
  Info
} from 'lucide-react';

const RoomsManager = () => {
  const rooms = useSelector((state) => state.rooms.list);
  const bookings = useSelector((state) => state.bookings.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminRoomsThunk());
    dispatch(fetchAdminBookingsThunk());
  }, [dispatch]);

  // Create room states
  const [isAdding, setIsAdding] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('Standard');
  const [pricePerNight, setPricePerNight] = useState('');
  const [capacity, setCapacity] = useState('2');
  
  // Dynamic Infinite Images (at least 1 required)
  const [imageUrls, setImageUrls] = useState(['']);

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageUrl = (index) => {
    const updated = imageUrls.filter((_, idx) => idx !== index);
    setImageUrls(updated.length > 0 ? updated : ['']);
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  // Maintenance state modal
  const [maintenanceRoom, setMaintenanceRoom] = useState(null);
  const [mReason, setMReason] = useState('');
  const [mStart, setMStart] = useState('');
  const [mEnd, setMEnd] = useState('');

  // active booking detail modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!roomNumber || !pricePerNight) return;

    const activeImages = imageUrls.filter(url => url.trim() !== '');
    if (activeImages.length === 0) {
      alert('Strict Operational Policy: Please supply at least one valid room image URL.');
      return;
    }

    // Use default hotel from seeder
    dispatch(createAdminRoomThunk({
      hotel: 'hotel-california-id', 
      roomNumber,
      type,
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      status: 'Available',
      images: activeImages,
      amenities: []
    }))
      .unwrap()
      .then(() => {
        dispatch(fetchAdminRoomsThunk());
        setRoomNumber('');
        setPricePerNight('');
        setImageUrls(['']);
        setIsAdding(false);
      })
      .catch((err) => {
        alert(`Registry Failed: ${err}`);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Strict Operations Control: Are you sure you want to permanently delete this suite from registry?')) {
      dispatch(deleteAdminRoomThunk(id))
        .unwrap()
        .then(() => {
          dispatch(fetchAdminRoomsThunk());
        })
        .catch((err) => {
          alert(`Deletion Failed: ${err}`);
        });
    }
  };

  const startEdit = (room) => {
    const roomId = room._id || room.id;
    setEditingId(roomId);
    setEditPrice(room.pricePerNight.toString());
  };

  const saveCost = (id) => {
    dispatch(updateAdminRoomThunk({ id, updateData: { pricePerNight: Number(editPrice) } }))
      .unwrap()
      .then(() => {
        dispatch(fetchAdminRoomsThunk());
      })
      .catch((err) => {
        alert(`Update Failed: ${err}`);
      });
    setEditingId(null);
  };

  const startMaintenance = (room) => {
    setMaintenanceRoom(room);
    setMReason('');
    setMStart('');
    setMEnd('');
  };

  const saveMaintenance = (e) => {
    e.preventDefault();
    if (!maintenanceRoom || !mReason || !mStart || !mEnd) return;
    
    const roomId = maintenanceRoom._id || maintenanceRoom.id;
    dispatch(updateAdminRoomThunk({
      id: roomId,
      updateData: {
        status: 'Under Maintenance',
        maintenanceReason: mReason,
        maintenanceStart: mStart,
        maintenanceEnd: mEnd
      }
    })).then(() => {
      dispatch(fetchAdminRoomsThunk());
    });

    setMaintenanceRoom(null);
  };

  const markAvailable = (id) => {
    dispatch(updateAdminRoomThunk({
      id,
      updateData: {
        status: 'Available',
        maintenanceReason: '',
        maintenanceStart: null,
        maintenanceEnd: null
      }
    })).then(() => {
      dispatch(fetchAdminRoomsThunk());
    });
  };

  // Find active booking details for Occupied room
  const getActiveBooking = (roomNum) => {
    return bookings.find(b => 
      b.roomNumber === roomNum && 
      (b.bookingStatus === 'CheckedIn' || b.bookingStatus === 'Confirmed')
    );
  };

  return (
    <>
      <Header 
        title="Rooms & Pricing Operations" 
        subtitle="Manage suite registers, mandatory image compliance, view occupancy logs, and manage maintenance parameters." 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
        {/* Create room trigger */}
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
            <Plus size={16} />
            <span>{isAdding ? 'Close Register Panel' : 'Register New Suite'}</span>
          </button>
        </div>

        {isAdding && (
          <GlassContainer title="Register New Suite">
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
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
                    placeholder="2000"
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
              </div>

              {/* Dynamic Infinite Images */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-gold)' }}>
                    Room Image Assets (At least 1 mandatory, unlimited allowed)
                  </h4>
                  <button 
                    type="button" 
                    onClick={handleAddImageUrl} 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={12} />
                    <span>Add Image URL</span>
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {imageUrls.map((url, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Image URL {index + 1} {index === 0 && '(Mandatory)'}</label>
                        <input 
                          type="url" 
                          className="form-input" 
                          placeholder="https://images.unsplash.com/... (Image URL)" 
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          required={index === 0}
                        />
                      </div>
                      
                      {imageUrls.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImageUrl(index)} 
                          className="btn"
                          style={{ 
                            background: 'rgba(255, 23, 68, 0.1)', 
                            border: '1px solid rgba(255, 23, 68, 0.2)', 
                            color: 'var(--danger)', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '42px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-primary">Save Suite Details</button>
              </div>
            </form>
          </GlassContainer>
        )}

        {/* Rooms Listing Table */}
        <GlassContainer title="Suite Catalog & Controls">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Room No.</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Price per Night</th>
                  <th>Operational Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const roomId = room._id || room.id;
                  const activeBooking = room.status === 'Occupied' ? getActiveBooking(room.roomNumber) : null;
                  
                  return (
                    <tr key={roomId}>
                      <td>
                        <div style={{ fontWeight: 700 }}>Room {room.roomNumber}</div>
                        {room.images && room.images.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                            {room.images.slice(0, 3).map((img, i) => (
                              <img 
                                key={i} 
                                src={img} 
                                alt="" 
                                style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} 
                              />
                            ))}
                          </div>
                        )}
                      </td>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={`badge ${
                            room.status === 'Available' ? 'badge-success' :
                            room.status === 'Occupied' ? 'badge-warning' : 'badge-danger'
                          }`} style={{ width: 'fit-content' }}>
                            {room.status}
                          </span>
                          
                          {room.status === 'Under Maintenance' && room.maintenanceReason && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', maxWidth: '200px', lineHeight: '1.3' }}>
                              <strong>Reason:</strong> {room.maintenanceReason}
                              <br />
                              <strong>Window:</strong> {new Date(room.maintenanceStart).toLocaleDateString()} - {new Date(room.maintenanceEnd).toLocaleDateString()}
                            </div>
                          )}

                          {activeBooking && (
                            <button 
                              onClick={() => setSelectedBooking(activeBooking)}
                              className="btn btn-secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', width: 'fit-content' }}
                            >
                              <FileText size={10} />
                              <span>View Stay Detail</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {room.status === 'Available' && (
                            <button 
                              onClick={() => startMaintenance(room)} 
                              className="btn btn-danger"
                              style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Hammer size={12} />
                              <span>Put to Repair</span>
                            </button>
                          )}

                          {room.status === 'Under Maintenance' && (
                            <button 
                              onClick={() => markAvailable(roomId)} 
                              className="btn btn-secondary"
                              style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                              <span>Make Available</span>
                            </button>
                          )}

                          {room.status === 'Occupied' && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Live Occupancy</span>
                          )}

                          <button 
                            onClick={() => handleDelete(roomId)}
                            className="btn"
                            style={{ background: 'rgba(255, 23, 68, 0.1)', border: '1px solid rgba(255, 23, 68, 0.2)', color: 'var(--danger)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                            title="Delete Room"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassContainer>

        {/* Maintenance scheduler overlay modal */}
        {maintenanceRoom && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="glass-card" style={{ padding: '40px', maxWidth: '500px', width: '90%', border: '1px solid rgba(255, 23, 68, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 className="serif-text" style={{ fontSize: '1.4rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Hammer size={18} />
                  <span>Suite Maintenance Scheduler</span>
                </h3>
                <button onClick={() => setMaintenanceRoom(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <form onSubmit={saveMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>
                  Scheduling repair logs for <strong>Room {maintenanceRoom.roomNumber} ({maintenanceRoom.type})</strong>. This suite will automatically be taken offline on the guest-side search engine.
                </div>

                <div className="form-group">
                  <label className="form-label">Maintenance Window (Start Date)</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={mStart} 
                    onChange={(e) => setMStart(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated End Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={mEnd} 
                    onChange={(e) => setMEnd(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Fault Reason</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="e.g. Broken basalt Jacuzzi valves replacement, repaint walls..."
                    value={mReason} 
                    onChange={(e) => setMReason(e.target.value)} 
                    required 
                    style={{ resize: 'none', background: 'rgba(255,255,255,0.03)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setMaintenanceRoom(null)} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', background: 'var(--danger)', borderColor: 'var(--danger)' }}>Confirm Maintenance Schedule</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Live Booking stay details modal */}
        {selectedBooking && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="glass-card" style={{ padding: '40px', maxWidth: '500px', width: '90%', border: '1px solid var(--accent-gold)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 className="serif-text" style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} />
                  <span>Live Stay Registry</span>
                </h3>
                <button onClick={() => setSelectedBooking(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Guest Name</span>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontSize: '1rem', marginTop: '2px' }}>
                      <User size={14} style={{ color: 'var(--accent-gold)' }} />
                      <span>{selectedBooking.guest?.name || 'Registered Guest'}</span>
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Coordinates</span>
                    <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{selectedBooking.guest?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stay Schedule</span>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Calendar size={14} style={{ color: 'var(--accent-gold)' }} />
                      <span>{new Date(selectedBooking.checkInDate).toLocaleDateString()} to {new Date(selectedBooking.checkOutDate).toLocaleDateString()}</span>
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount Settle</span>
                    <strong style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>₹{selectedBooking.totalAmount}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stay Operational status</span>
                    <span className="badge badge-success" style={{ marginTop: '4px', display: 'inline-block' }}>{selectedBooking.bookingStatus}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button onClick={() => setSelectedBooking(null)} className="btn btn-primary" style={{ padding: '10px 24px' }}>Close logs</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default RoomsManager;
