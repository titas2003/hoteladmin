import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventoryThunk, createInventoryThunk, updateInventoryThunk, deleteInventoryThunk } from '../store/inventorySlice';
import Header from '../components/Header';
import GlassContainer from '../components/GlassContainer';
import { Plus, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';

const InventoryManager = () => {
  const inventory = useSelector((state) => state.inventory.list);
  const dispatch = useDispatch();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Toiletries');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pieces');
  const [safetyStockLevel, setSafetyStockLevel] = useState('10');
  const [unitCost, setUnitCost] = useState('');
  const [supplier, setSupplier] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');

  useEffect(() => {
    dispatch(fetchInventoryThunk());
  }, [dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !quantity || !unitCost) return;

    dispatch(createInventoryThunk({
      name,
      category,
      quantity: Number(quantity),
      unit,
      safetyStockLevel: Number(safetyStockLevel),
      unitCost: Number(unitCost),
      supplier
    }));

    setName('');
    setQuantity('');
    setUnitCost('');
    setSupplier('');
    setIsAdding(false);
  };

  const handleUpdateStock = (id) => {
    dispatch(updateInventoryThunk({ id, updateData: { quantity: Number(editQty) } }));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      dispatch(deleteInventoryThunk(id));
    }
  };

  return (
    <>
      <Header 
        title="Materials & Supplies Inventory" 
        subtitle="Track stock levels, monitor unit costs, manage suppliers, and view low-stock safety alerts." 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
            <Plus size={16} />
            <span>{isAdding ? 'Close Panel' : 'Register New Material'}</span>
          </button>
        </div>

        {isAdding && (
          <GlassContainer title="Register New Material / Asset">
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '2', minWidth: '240px' }}>
                <label className="form-label">Material Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Lavender Soap Bars"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Category</label>
                <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Cleaning">Cleaning Supplies</option>
                  <option value="Linen">Linen</option>
                  <option value="Toiletries">Toiletries</option>
                  <option value="F&B">Food & Beverage</option>
                  <option value="Maintenance Supplies">Maintenance Supplies</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '100px' }}>
                <label className="form-label">Initial Quantity</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="100"
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '100px' }}>
                <label className="form-label">Unit of Measure</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="pieces, bottles, kits"
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '100px' }}>
                <label className="form-label">Safety Alert stock Level</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={safetyStockLevel} 
                  onChange={(e) => setSafetyStockLevel(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '100px' }}>
                <label className="form-label">Unit Cost (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-input" 
                  placeholder="2.50"
                  value={unitCost} 
                  onChange={(e) => setUnitCost(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                <label className="form-label">Supplier Brand Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Apex Supplies"
                  value={supplier} 
                  onChange={(e) => setSupplier(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                <button type="submit" className="btn btn-primary">Save Material</button>
              </div>
            </form>
          </GlassContainer>
        )}

        <GlassContainer title="Materials Stock Sheet">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Material / Item</th>
                  <th>Category</th>
                  <th>Quantity In-Stock</th>
                  <th>Safety Alert Level</th>
                  <th>Unit Cost</th>
                  <th>Supplier</th>
                  <th>Status Alert</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const itemId = item._id || item.id;
                  const isLow = item.quantity <= item.safetyStockLevel;
                  return (
                    <tr key={itemId}>
                      <td style={{ fontWeight: 700 }}>{item.name}</td>
                      <td>
                        <span className="badge badge-info">{item.category}</span>
                      </td>
                      <td>
                        {editingId === itemId ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ width: '80px', padding: '6px' }}
                              value={editQty}
                              onChange={(e) => setEditQty(e.target.value)}
                            />
                            <button onClick={() => handleUpdateStock(itemId)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Save</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>{item.quantity} {item.unit}</span>
                            <button 
                              onClick={() => { setEditingId(itemId); setEditQty(item.quantity.toString()); }} 
                              style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}
                            >
                              <RefreshCw size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>{item.safetyStockLevel} {item.unit}</td>
                      <td>₹{item.unitCost}</td>
                      <td>{typeof item.supplier === 'object' ? item.supplier?.name : item.supplier || 'N/A'}</td>
                      <td>
                        {isLow ? (
                          <span className="badge badge-danger" style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
                            <AlertTriangle size={12} />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="badge badge-success">Sufficient</span>
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(itemId)} 
                          className="btn btn-danger"
                          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                        >
                          <Trash2 size={12} />
                        </button>
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

export default InventoryManager;
