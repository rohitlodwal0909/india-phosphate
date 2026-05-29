import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

interface CustomerData {
  company_address?: string;
  potential_opportunity?: number;
  convert_to_customer?: number;
}

interface TotalCustomersState {
  customers: CustomerData[];
  message: string;
  pending_orders: number;
  total_disputes: number;
  total_orders: number;
}

interface DashboardState {
  loading: boolean;
  error: string | null;

  totalcustomers: TotalCustomersState;

  addResult: any;
  updateResult: any;
  deleteResult: any;
}

const initialState: DashboardState = {
  loading: false,
  error: null,

  totalcustomers: {
    customers: [],
    message: '',
    pending_orders: 0,
    total_disputes: 0,
    total_orders: 0,
  },

  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const gettotalCustomer = createAsyncThunk('dashboard/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/get-total-customers');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch customers.';

    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const DashboardCustomerSlice = createSlice({
  name: 'customerdashboard',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default DashboardCustomerSlice.reducer;
