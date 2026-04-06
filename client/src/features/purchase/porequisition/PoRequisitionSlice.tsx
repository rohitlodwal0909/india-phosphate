import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  requisitions: [],
  remaining: [],
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

/* ======================================================
   CREATE QUOTATION
====================================================== */

export const createPoRequisition = createAsyncThunk<any, any, { rejectValue: any }>(
  'requisition/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-requisition`, formData);
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
export const getPoRequisition = createAsyncThunk<any>('requisition/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-requisition`);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch requisition');
  }
});

export const getRemaningStock = createAsyncThunk<any>(
  'requisition/remaining',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-remaining-stock`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch requisition',
      );
    }
  },
);

/* ======================================================
   UPDATE QUOTATION
====================================================== */
export const updatePoRequisition = createAsyncThunk<any, { id: number; data: FormData }>(
  'requisition/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-requisition/${id}`, data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

/* ======================================================
   DELETE QUOTATION
====================================================== */
export const deletePoRequisition = createAsyncThunk<any, number>(
  'requisition/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-requisition/${id}`);

      return { id, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

/* ======================================================
   SLICE
====================================================== */

const PoRequisitionSlice = createSlice({
  name: 'requisition',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= CREATE ================= */
      .addCase(createPoRequisition.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPoRequisition.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = action.payload;

        state.requisitions.unshift(action.payload);
      })
      .addCase(createPoRequisition.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET ================= */
      .addCase(getPoRequisition.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPoRequisition.fulfilled, (state, action) => {
        state.loading = false;
        state.requisitions = action.payload;
      })
      .addCase(getPoRequisition.rejected, (state, action: any) => {
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
      .addCase(updatePoRequisition.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePoRequisition.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = action.payload;

        const index = state.requisitions.findIndex((item: any) => item.id === action.payload.id);

        if (index !== -1) {
          state.requisitions[index] = action.payload;
        }
      })
      .addCase(updatePoRequisition.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deletePoRequisition.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePoRequisition.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;

        state.requisitions = state.requisitions.filter(
          (item: any) => item.id !== action.payload.id,
        );
      })
      .addCase(deletePoRequisition.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PoRequisitionSlice.reducer;
