import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  totalcustomers: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const gettotalCustomer = createAsyncThunk('dashboard/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-total-customers`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const DashboardCustomerSlice = createSlice({
  name: 'customerdashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(gettotalCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gettotalCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.totalcustomers = action.payload;
      })
      .addCase(gettotalCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default DashboardCustomerSlice.reducer;
