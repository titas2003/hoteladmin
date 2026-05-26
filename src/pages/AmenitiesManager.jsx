import React, { useState } from 'react';
import Header from '../components/Header';
import GlassContainer from '../components/GlassContainer';
import { Plus, Check, Star } from 'lucide-react';

const AmenitiesManager = () => {
  const [amenities, setAmenities] = useState([
    { id: '1', name: 'High-speed Wi-Fi', description: 'Fiber internet access (500Mbps)', category: 'Both' },
    { id: '2', name: 'Indoor Jacuzzi', description: 'En-suite dynamic massage tub', category: 'Room' },
    { id: '3', name: 'Valet Parking', description: 'Complimentary guest vehicle parking service', category: 'Hotel' },
    { id: '4', name: 'Mini Bar', description: 'Premium refreshments and snacks', category: 'Room' },
    { id: '5', name: 'Infinity Pool', description: 'Outdoor heated high-rise pool', category: 'Hotel' },
    { id: '6', name: 'Spa Access', description: 'Sauna and personal massage suite access', category: 'Hotel' }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Both');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name) return;

    setAmenities([
      ...amenities,
      {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        category
      }
    ]);

    setName('');
    setDescription('');
    setIsAdding(false);
  };

  return (
    <>
      <Header 
        title="Global Amenities Registry" 
        subtitle="Manage available amenities, room service options, and hotel attractions." 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
            <Plus size={16} />
            <span>{isAdding ? 'Close Panel' : 'Register New Amenity'}</span>
          </button>
        </div>

        {isAdding && (
          <GlassContainer title="Register Global Amenity">
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '2', minWidth: '240px' }}>
                <label className="form-label">Amenity Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Smart LED Television"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Category</label>
                <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Both">Both Rooms & Hotel</option>
                  <option value="Room">Rooms Only</option>
                  <option value="Hotel">Hotel Only</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '3', minWidth: '300px' }}>
                <label className="form-label">Description</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Ultra high definition screen connected to hotel smart network"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                <button type="submit" className="btn btn-primary">Save Amenity</button>
              </div>
            </form>
          </GlassContainer>
        )}

        <GlassContainer title="Amenities Catalog">
          <div className="grid-3">
            {amenities.map((item) => (
              <div 
                key={item.id} 
                className="glass-panel glass-panel-hover" 
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.name}</h4>
                  <span className="badge badge-info">{item.category}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flexGrow: 1 }}>{item.description || 'No description provided.'}</p>
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                  <Check size={12} />
                  <span>Registered Active</span>
                </div>
              </div>
            ))}
          </div>
        </GlassContainer>
      </div>
    </>
  );
};

export default AmenitiesManager;
