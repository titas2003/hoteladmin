import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import roomReducer from './roomSlice';
import bookingReducer from './bookingSlice';
import inventoryReducer from './inventorySlice';
import staffReducer from './staffSlice';
import transportReducer from './transportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    bookings: bookingReducer,
    inventory: inventoryReducer,
    staff: staffReducer,
    transport: transportReducer
  }
});
