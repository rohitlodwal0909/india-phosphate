import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  data: [],
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

/* ======================================================
   CREATE QUOTATION
====================================================== */

export const createTransport = createAsyncThunk<any, any, { rejectValue: any }>(
  'purchasestore/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-purchase-store`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to create invoice.');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const updateTransport = createAsyncThunk<any, any, { rejectValue: any }>(
  'purchasestore/update',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/update-purchase-store`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to create invoice.');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);
/* ======================================================
   GET QUOTATION
====================================================== */
export const findStore = createAsyncThunk<
  any, // response type
  number, // argument type (po_id)
  { rejectValue: string }
>('purchasestore/get', async (po_id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/find-store/${po_id}`);

    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch store');
  }
});

/* ======================================================
   SLICE
====================================================== */

const PurchaseStoreSlice = createSlice({
  name: 'purchasestore',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= CREATE ================= */
      .addCase(createTransport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransport.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = action.payload;
      })
      .addCase(createTransport.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTransport.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTransport.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = action.payload;
      })
      .addCase(updateTransport.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET ================= */
      .addCase(findStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(findStore.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(findStore.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* ================= DELETE ================= */
  },
});

export default PurchaseStoreSlice.reducer;
