import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

export const loginAdminThunk = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      dispatch(loginStart());
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(loginFailure(data.message || 'Login failed'));
        return rejectWithValue(data.message || 'Login failed');
      }
      dispatch(loginSuccess(data));
      return data;
    } catch (error) {
      dispatch(loginFailure(error.message));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isAuthenticated: localStorage.getItem('token') ? true : false,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
