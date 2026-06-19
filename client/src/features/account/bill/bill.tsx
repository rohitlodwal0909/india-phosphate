import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  bills: [],
  singlebill: [],
  dispatchBatches: [],
  invoices: [],
  invoicepayment: [],
  dispatchpo: [],
  create: null,
  update: null,
  deleteResult: null,
};

export const createBill = createAsyncThunk<any, any, { rejectValue: any }>(
  'bill/add',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-bill`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to create bill.');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

interface UpdateInvoicePayload {
  id: string;
  data: any;
}

export const updateBill = createAsyncThunk<any, UpdateInvoicePayload>(
  'bill/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-bill/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update bill.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const getBill = createAsyncThunk<any, number>('bill/single', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-bill/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch invoice.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getBills = createAsyncThunk<any, void>('bill/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-bills`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch bills.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const BillSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(getBills.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.create = action.payload;
      })
      .addCase(createBill.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;
      })
      .addCase(updateBill.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBill.fulfilled, (state, action) => {
        state.loading = false;
        state.singlebill = action.payload;
      })
      .addCase(getBill.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default BillSlice.reducer;
