import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, getHeaders } from '../config';

export const fetchTransportThunk = createAsyncThunk(
  'transport/fetchTransport',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transport`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch transport fleet');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTransportThunk = createAsyncThunk(
  'transport/createTransport',
  async (vehicleDetails, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transport`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(vehicleDetails)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Creation failed');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTransportThunk = createAsyncThunk(
  'transport/updateTransport',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transport/${id}`, {
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

export const deleteTransportThunk = createAsyncThunk(
  'transport/deleteTransport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transport/${id}`, {
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

const initialTransport = [
  { id: 't1', vehicleName: 'Beverly Shuttle Bus', plateNumber: 'CAL101BUS', vehicleType: 'Shuttle Bus', offeredTo: 'Both', driverName: 'Robert Carter', driverPhone: '555-4433', status: 'Available', pricePerTrip: 0 },
  { id: 't2', vehicleName: 'Luxury Guest Limo', plateNumber: 'VIPCAL777', vehicleType: 'Luxury Limo', offeredTo: 'Customers', driverName: 'Michael Sterling', driverPhone: '555-8899', status: 'Available', pricePerTrip: 75.00 }
];

const transportSlice = createSlice({
  name: 'transport',
  initialState: {
    list: initialTransport
  },
  reducers: {
    addVehicle: (state, action) => {
      state.list.push({
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload
      });
    },
    updateVehicleStatus: (state, action) => {
      const { id, status, driverName, driverPhone } = action.payload;
      const vehicle = state.list.find((v) => (v._id || v.id) === id);
      if (vehicle) {
        if (status !== undefined) vehicle.status = status;
        if (driverName !== undefined) vehicle.driverName = driverName;
        if (driverPhone !== undefined) vehicle.driverPhone = driverPhone;
      }
    },
    deleteVehicle: (state, action) => {
      state.list = state.list.filter((v) => (v._id || v.id) !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransportThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createTransportThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTransportThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(v => v._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      .addCase(deleteTransportThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(v => v._id !== action.payload);
      });
  }
});

export const { addVehicle, updateVehicleStatus, deleteVehicle } = transportSlice.actions;
export default transportSlice.reducer;
