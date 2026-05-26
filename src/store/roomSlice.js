import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, getHeaders } from '../config';

export const fetchAdminRoomsThunk = createAsyncThunk(
  'rooms/fetchAdminRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch rooms');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAdminRoomThunk = createAsyncThunk(
  'rooms/createAdminRoom',
  async (roomDetails, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(roomDetails)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Creation failed');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdminRoomThunk = createAsyncThunk(
  'rooms/updateAdminRoom',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
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

const initialRooms = [
  { id: '101', roomNumber: '101', type: 'Standard', pricePerNight: 120, capacity: 2, status: 'Available', amenities: ['High-speed Wi-Fi'] },
  { id: '202', roomNumber: '202', type: 'Deluxe', pricePerNight: 250, capacity: 3, status: 'Available', amenities: ['High-speed Wi-Fi', 'Mini Bar'] },
  { id: '303', roomNumber: '303', type: 'Suite', pricePerNight: 500, capacity: 4, status: 'Available', amenities: ['High-speed Wi-Fi', 'Indoor Jacuzzi', 'Mini Bar'] }
];

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    list: initialRooms,
    loading: false
  },
  reducers: {
    updateRoomCost: (state, action) => {
      const { id, pricePerNight } = action.payload;
      const room = state.list.find((r) => (r._id || r.id) === id);
      if (room) {
        room.pricePerNight = Number(pricePerNight);
      }
    },
    updateRoomStatus: (state, action) => {
      const { id, status } = action.payload;
      const room = state.list.find((r) => (r._id || r.id) === id);
      if (room) {
        room.status = status;
      }
    },
    addRoom: (state, action) => {
      state.list.push({
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminRoomsThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createAdminRoomThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateAdminRoomThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      });
  }
});

export const { updateRoomCost, updateRoomStatus, addRoom } = roomSlice.actions;
export default roomSlice.reducer;
