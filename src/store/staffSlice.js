import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, getHeaders } from '../config';

export const fetchStaffThunk = createAsyncThunk(
  'staff/fetchStaff',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/staff`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch staff');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createStaffThunk = createAsyncThunk(
  'staff/createStaff',
  async (staffDetails, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/staff`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(staffDetails)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Creation failed');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStaffThunk = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/staff/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Update failed');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStaffThunk = createAsyncThunk(
  'staff/deleteStaff',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/staff/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Delete failed');
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialStaff = [
  { id: 's1', name: 'Staff Member John', email: 'staff@hotelcal.com', phone: '9876543210', role: 'Staff', salary: 45000, department: 'Front Desk', shift: 'Morning', status: 'Active' },
  { id: 's2', name: 'Super Admin', email: 'admin@hotelcal.com', phone: '1234567890', role: 'Admin', salary: 120000, department: 'Management', shift: 'Morning', status: 'Active' }
];

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    list: initialStaff
  },
  reducers: {
    addStaffMember: (state, action) => {
      state.list.push({
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        status: 'Active'
      });
    },
    updateStaffSalaryAndRole: (state, action) => {
      const { id, salary, role } = action.payload;
      const member = state.list.find((s) => (s._id || s.id) === id);
      if (member) {
        if (salary !== undefined) member.salary = Number(salary);
        if (role !== undefined) member.role = role;
      }
    },
    updateStaffDeployment: (state, action) => {
      const { id, department, shift, status } = action.payload;
      const member = state.list.find((s) => (s._id || s.id) === id);
      if (member) {
        if (department !== undefined) member.department = department;
        if (shift !== undefined) member.shift = shift;
        if (status !== undefined) member.status = status;
      }
    },
    deleteStaffMember: (state, action) => {
      state.list = state.list.filter((s) => (s._id || s.id) !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createStaffThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateStaffThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      .addCase(deleteStaffThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s._id !== action.payload);
      });
  }
});

export const { addStaffMember, updateStaffSalaryAndRole, updateStaffDeployment, deleteStaffMember } = staffSlice.actions;
export default staffSlice.reducer;
