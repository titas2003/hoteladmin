import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStaffThunk, createStaffThunk, updateStaffThunk, deleteStaffThunk } from '../store/staffSlice';
import Header from '../components/Header';
import GlassContainer from '../components/GlassContainer';
import { Plus, Trash2, Award } from 'lucide-react';

const StaffManager = () => {
  const staff = useSelector((state) => state.staff.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStaffThunk());
  }, [dispatch]);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Staff');
  const [salary, setSalary] = useState('');
  const [department, setDepartment] = useState('Housekeeping');
  const [shift, setShift] = useState('Morning');

  const [editingId, setEditingId] = useState(null);
  const [editSalary, setEditSalary] = useState('');
  const [editRole, setEditRole] = useState('Staff');

  const [deployingId, setDeployingId] = useState(null);
  const [deployDept, setDeployDept] = useState('Housekeeping');
  const [deployShift, setDeployShift] = useState('Morning');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !email || !salary) return;

    dispatch(createStaffThunk({
      name,
      email,
      password: 'password123', // Default base password for new staff
      phone,
      role,
      salary: Number(salary)
    })).then(() => {
      dispatch(fetchStaffThunk());
    });

    setName('');
    setEmail('');
    setPhone('');
    setSalary('');
    setIsAdding(false);
  };

  const saveSalaryAndRole = (id) => {
    dispatch(updateStaffThunk({ id, updateData: { salary: Number(editSalary), role: editRole } })).then(() => {
      dispatch(fetchStaffThunk());
    });
    setEditingId(null);
  };

  const saveDeployment = (id) => {
    // Dispatch local states or thunk
    setDeployingId(null);
  };

  return (
    <>
      <Header 
        title="Staff & Payroll Deployment" 
        subtitle="Manage employee salaries, assign organizational roles, and schedule shift deployments." 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
            <Plus size={16} />
            <span>{isAdding ? 'Close Panel' : 'Add Staff Member'}</span>
          </button>
        </div>

        {isAdding && (
          <GlassContainer title="Hire New Staff Member">
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john@hotelcal.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="555-123-4567"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Role Classification</label>
                <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Staff">General Staff</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Annual Salary (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="45000"
                  value={salary} 
                  onChange={(e) => setSalary(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Department</label>
                <select className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Kitchen">Kitchen & Dining</option>
                  <option value="Security">Security</option>
                  <option value="Valet & Transport">Valet & Transport</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Deployment Shift</label>
                <select className="form-input" value={shift} onChange={(e) => setShift(e.target.value)}>
                  <option value="Morning">Morning (06:00 - 14:00)</option>
                  <option value="Evening">Evening (14:00 - 22:00)</option>
                  <option value="Night">Night (22:00 - 06:00)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                <button type="submit" className="btn btn-primary">Hire & Deploy</button>
              </div>
            </form>
          </GlassContainer>
        )}

        {/* Deployment Shift Adjust Overlay */}
        {deployingId && (
          <GlassContainer title="Re-deploy Staff Department & Shift">
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Select Department</label>
                <select className="form-input" value={deployDept} onChange={(e) => setDeployDept(e.target.value)}>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Kitchen">Kitchen & Dining</option>
                  <option value="Security">Security</option>
                  <option value="Valet & Transport">Valet & Transport</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Select Shift</label>
                <select className="form-input" value={deployShift} onChange={(e) => setDeployShift(e.target.value)}>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <button onClick={() => saveDeployment(deployingId)} className="btn btn-primary">Apply Deployment</button>
                <button onClick={() => setDeployingId(null)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </GlassContainer>
        )}

        <GlassContainer title="Employee Roster & Contracts">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Role Classification</th>
                  <th>Salary (Annual)</th>
                  <th>Department Assigned</th>
                  <th>Active Shift</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => {
                  const staffId = member._id || member.id;
                  return (
                    <tr key={staffId}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                      </td>
                      <td>
                        {editingId === staffId ? (
                          <select className="form-input" style={{ padding: '6px' }} value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`badge ${member.role === 'Admin' ? 'badge-danger' : 'badge-success'}`}>{member.role}</span>
                        )}
                      </td>
                      <td>
                        {editingId === staffId ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>₹</span>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ width: '100px', padding: '6px' }}
                              value={editSalary}
                              onChange={(e) => setEditSalary(e.target.value)}
                            />
                            <button onClick={() => saveSalaryAndRole(staffId)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Save</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>₹{member.salary.toLocaleString()}</span>
                            <button 
                              onClick={() => { setEditingId(staffId); setEditSalary(member.salary.toString()); setEditRole(member.role); }} 
                              style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}
                            >
                              <Award size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>{member.department || 'N/A'}</td>
                      <td>
                        <span className="badge badge-info">{member.shift || 'Morning'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => { setDeployingId(staffId); setDeployDept(member.department || 'Housekeeping'); setDeployShift(member.shift || 'Morning'); }} 
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                          >
                            Deploy
                          </button>
                          {member.role !== 'Admin' && (
                            <button 
                              onClick={() => dispatch(deleteStaffThunk(staffId))} 
                              className="btn btn-danger"
                              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            >
                              <Trash2 size={12} />
                            </button>
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

export default StaffManager;
