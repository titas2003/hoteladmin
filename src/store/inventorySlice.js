import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, getHeaders } from '../config';

export const fetchInventoryThunk = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/inventory`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch inventory');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInventoryThunk = createAsyncThunk(
  'inventory/createInventory',
  async (itemDetails, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(itemDetails)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Creation failed');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryThunk = createAsyncThunk(
  'inventory/updateInventory',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/inventory/${id}`, {
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

export const deleteInventoryThunk = createAsyncThunk(
  'inventory/deleteInventory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/inventory/${id}`, {
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

const initialInventory = [
  { id: 'i1', name: 'Organic Lavender Toiletries Kit', category: 'Toiletries', quantity: 120, unit: 'kits', safetyStockLevel: 25, unitCost: 3.50, supplier: 'Eco Bath Corp' },
  { id: 'i2', name: 'Egyptian Cotton Sheets (Queen)', category: 'Linen', quantity: 45, unit: 'sheets', safetyStockLevel: 15, unitCost: 15.00, supplier: 'Luxe Linens Ltd' },
  { id: 'i3', name: 'Universal Cleaning Detergent (5L)', category: 'Cleaning', quantity: 8, unit: 'bottles', safetyStockLevel: 10, unitCost: 12.50, supplier: 'Apex Supplies' }
];

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    list: initialInventory
  },
  reducers: {
    addInventoryItem: (state, action) => {
      state.list.push({
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload
      });
    },
    updateStockQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.list.find((i) => (i._id || i.id) === id);
      if (item) {
        item.quantity = Number(quantity);
      }
    },
    deleteInventoryItem: (state, action) => {
      state.list = state.list.filter((i) => (i._id || i.id) !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createInventoryThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateInventoryThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(i => i._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      .addCase(deleteInventoryThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(i => i._id !== action.payload);
      });
  }
});

export const { addInventoryItem, updateStockQuantity, deleteInventoryItem } = inventorySlice.actions;
export default inventorySlice.reducer;
