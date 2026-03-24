import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  invoiceentry: [],
  updateResult: null,
  deleteResult: null,
};

export const getentryinvoice = createAsyncThunk<
  any, // response type (baad me refine kar sakte ho)
  number // 👈 id (status) ka type
>('invoiceentry/fetch', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-invoice-entry?status=${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch invoice entry.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const TaxInvoiceSlice = createSlice({
  name: 'taxinvoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getentryinvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getentryinvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceentry = action.payload;
      })
      .addCase(getentryinvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default TaxInvoiceSlice.reducer;
