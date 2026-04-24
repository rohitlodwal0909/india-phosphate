import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  purchasepos: [],
  remaining: [],
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

/* ======================================================
   CREATE QUOTATION
====================================================== */

export const createPurchasePo = createAsyncThunk<any, any, { rejectValue: any }>(
  'purchasepo/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-purchasepo`, formData);
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
export const getPurchasePo = createAsyncThunk<any>('purchasepo/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-purchasepo`);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch purchasepo');
  }
});

export const getRemaningStock = createAsyncThunk<any>(
  'purchasepo/remaining',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-remaining-stock`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch purchasepo',
      );
    }
  },
);

/* ======================================================
   UPDATE QUOTATION
====================================================== */
export const updatePurchasePo = createAsyncThunk<any, { id: number; data: FormData }>(
  'purchasepo/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-purchasepo/${id}`, data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

/* ======================================================
   DELETE QUOTATION
====================================================== */
export const deletePurchasePo = createAsyncThunk<any, number>(
  'purchasepo/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-purchasepo/${id}`);

      return { id, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

/* ======================================================
   SLICE
====================================================== */

const PurchasePoSlice = createSlice({
  name: 'purchasepo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= CREATE ================= */
      .addCase(createPurchasePo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPurchasePo.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = action.payload;

        state.purchasepos.unshift(action.payload);
      })
      .addCase(createPurchasePo.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET ================= */
      .addCase(getPurchasePo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPurchasePo.fulfilled, (state, action) => {
        state.loading = false;
        state.purchasepos = action.payload;
      })
      .addCase(getPurchasePo.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRemaningStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRemaningStock.fulfilled, (state, action) => {
        state.loading = false;
        state.remaining = action.payload;
      })
      .addCase(getRemaningStock.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updatePurchasePo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePurchasePo.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = action.payload;

        const index = state.purchasepos.findIndex((item: any) => item.id === action.payload.id);

        if (index !== -1) {
          state.purchasepos[index] = action.payload;
        }
      })
      .addCase(updatePurchasePo.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deletePurchasePo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePurchasePo.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;

        state.purchasepos = state.purchasepos.filter((item: any) => item.id !== action.payload.id);
      })
      .addCase(deletePurchasePo.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PurchasePoSlice.reducer;
