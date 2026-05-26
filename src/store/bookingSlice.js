import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, getHeaders } from '../config';

export const fetchAdminBookingsThunk = createAsyncThunk(
  'bookings/fetchAdminBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch bookings');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkInGuestThunk = createAsyncThunk(
  'bookings/checkInGuest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${id}/checkin`, {
        method: 'PUT',
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Check-in failed');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkOutGuestThunk = createAsyncThunk(
  'bookings/checkOutGuest',
  async ({ id, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${id}/checkout`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ paymentMethod })
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Check-out failed');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialBookings = [
  {
    id: 'b1',
    guest: { name: 'John Doe', email: 'guest@hotelcal.com', phone: '5551234567' },
    roomNumber: '101',
    roomType: 'Standard',
    checkInDate: '2026-05-26',
    checkOutDate: '2026-05-29',
    totalAmount: 360,
    tax: 43.2,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Pending'
  }
];

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: initialBookings
  },
  reducers: {
    addBooking: (state, action) => {
      state.list.push({
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Unpaid'
      });
    },
    checkInGuest: (state, action) => {
      const booking = state.list.find((b) => (b._id || b.id) === action.payload);
      if (booking) {
        booking.bookingStatus = 'CheckedIn';
      }
    },
    checkOutGuest: (state, action) => {
      const { id, paymentMethod } = action.payload;
      const booking = state.list.find((b) => (b._id || b.id) === id);
      if (booking) {
        booking.bookingStatus = 'CheckedOut';
        booking.paymentStatus = 'Paid';
        booking.paymentMethod = paymentMethod || 'Card';
      }
    },
    cancelBooking: (state, action) => {
      const booking = state.list.find((b) => (b._id || b.id) === action.payload);
      if (booking) {
        booking.bookingStatus = 'Cancelled';
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBookingsThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(checkInGuestThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      .addCase(checkOutGuestThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      });
  }
});

export const { addBooking, checkInGuest, checkOutGuest, cancelBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
