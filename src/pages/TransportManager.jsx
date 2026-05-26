import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransportThunk, createTransportThunk, updateTransportThunk, deleteTransportThunk } from '../store/transportSlice';
import Header from '../components/Header';
import GlassContainer from '../components/GlassContainer';
import { Plus, Trash2, Shield, Eye, Settings } from 'lucide-react';

const TransportManager = () => {
  const fleet = useSelector((state) => state.transport.list);
  const dispatch = useDispatch();

  const [isAdding, setIsAdding] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Shuttle Bus');
  const [offeredTo, setOfferedTo] = useState('Both');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [pricePerTrip, setPricePerTrip] = useState('0');

  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('Available');
  const [editDriver, setEditDriver] = useState('');
  const [editDriverPhone, setEditDriverPhone] = useState('');

  useEffect(() => {
    dispatch(fetchTransportThunk());
  }, [dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!vehicleName || !plateNumber || !driverName) return;

    dispatch(createTransportThunk({
      vehicleName,
      plateNumber,
      vehicleType,
      offeredTo,
      driverName,
      driverPhone,
      status: 'Available',
      pricePerTrip: Number(pricePerTrip)
    }));

    setVehicleName('');
    setPlateNumber('');
    setDriverName('');
    setDriverPhone('');
    setPricePerTrip('0');
    setIsAdding(false);
  };

  const handleUpdate = (id) => {
    dispatch(updateTransportThunk({
      id,
      updateData: {
        status: editStatus,
        driverName: editDriver,
        driverPhone: editDriverPhone
      }
    }));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fleet vehicle?')) {
      dispatch(deleteTransportThunk(id));
    }
  };

  return (
    <>
      <Header 
        title="Transportation Fleet Logistics" 
        subtitle="Manage shuttle buses, luxury customer pick-ups, driver allocations, and transport pricing." 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
            <Plus size={16} />
            <span>{isAdding ? 'Close Panel' : 'Add Vehicle to Fleet'}</span>
          </button>
        </div>

        {isAdding && (
          <GlassContainer title="Register Fleet Vehicle">
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                <label className="form-label">Vehicle Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mercedes Sprinter Shuttle"
                  value={vehicleName} 
                  onChange={(e) => setVehicleName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Plate Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="CAL999BUS"
                  value={plateNumber} 
                  onChange={(e) => setPlateNumber(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Vehicle Classification</label>
                <select className="form-input" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option value="Shuttle Bus">Shuttle Bus</option>
                  <option value="Luxury Limo">Luxury Limo</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Van">Transit Van</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Offered To</label>
                <select className="form-input" value={offeredTo} onChange={(e) => setOfferedTo(e.target.value)}>
                  <option value="Both">Both Customers & Staff</option>
                  <option value="Customers">Customers Only</option>
                  <option value="Staffs">Staff Only</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '100px' }}>
                <label className="form-label">Price per Trip ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={pricePerTrip} 
                  onChange={(e) => setPricePerTrip(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                <label className="form-label">Assigned Driver Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="James Driver"
                  value={driverName} 
                  onChange={(e) => setDriverName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Driver Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="555-0909"
                  value={driverPhone} 
                  onChange={(e) => setDriverPhone(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                <button type="submit" className="btn btn-primary">Save Vehicle</button>
              </div>
            </form>
          </GlassContainer>
        )}

        {/* Edit Driver / Vehicle Status Overlay */}
        {editingId && (
          <GlassContainer title="Update Fleet Log Details">
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Vehicle Status</label>
                <select className="form-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="Available">Available</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                <label className="form-label">Update Driver Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editDriver} 
                  onChange={(e) => setEditDriver(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Update Driver Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editDriverPhone} 
                  onChange={(e) => setEditDriverPhone(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <button onClick={() => handleUpdate(editingId)} className="btn btn-primary">Apply Updates</button>
                <button onClick={() => setEditingId(null)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </GlassContainer>
        )}

        <GlassContainer title="Fleet Registry Log">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vehicle Details</th>
                  <th>License Plate</th>
                  <th>Classification</th>
                  <th>Access Group</th>
                  <th>Cost per Ride</th>
                  <th>Assigned Driver</th>
                  <th>Log Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fleet.map((vehicle) => {
                  const vehicleId = vehicle._id || vehicle.id;
                  return (
                    <tr key={vehicleId}>
                      <td style={{ fontWeight: 700 }}>{vehicle.vehicleName}</td>
                      <td style={{ letterSpacing: '1px', fontWeight: 600 }}>{vehicle.plateNumber}</td>
                      <td>{vehicle.vehicleType}</td>
                      <td>
                        <span className="badge badge-info">{vehicle.offeredTo}</span>
                      </td>
                      <td>{vehicle.pricePerTrip === 0 ? 'Complimentary' : `$${vehicle.pricePerTrip}`}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{vehicle.driverName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vehicle.driverPhone || 'N/A'}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          vehicle.status === 'Available' ? 'badge-success' :
                          vehicle.status === 'In Transit' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => { 
                              setEditingId(vehicleId); 
                              setEditStatus(vehicle.status); 
                              setEditDriver(vehicle.driverName); 
                              setEditDriverPhone(vehicle.driverPhone || ''); 
                            }} 
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                          >
                            <Settings size={12} />
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicleId)} 
                            className="btn btn-danger"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                          >
                            <Trash2 size={12} />
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
      </div>
    </>
  );
};

export default TransportManager;
