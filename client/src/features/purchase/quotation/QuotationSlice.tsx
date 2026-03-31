import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  quotations: [],
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

/* ======================================================
   CREATE QUOTATION
====================================================== */

export const createQuotation = createAsyncThunk<any, any, { rejectValue: any }>(
  'quotation/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-quotation`, formData);
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
export const getQuotation = createAsyncThunk<any>('quotation/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-quotation`);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch quotation');
  }
});

/* ======================================================
   UPDATE QUOTATION
====================================================== */
export const updateQuotation = createAsyncThunk<any, { id: number; data: FormData }>(
  'quotation/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-quotation/${id}`, data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

/* ======================================================
   DELETE QUOTATION
====================================================== */
export const deleteQuotation = createAsyncThunk<any, number>(
  'quotation/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-quotation/${id}`);

      return { id, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

/* ======================================================
   SLICE
====================================================== */

const QuotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= CREATE ================= */
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = action.payload;

        state.quotations.unshift(action.payload);
      })
      .addCase(createQuotation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET ================= */
      .addCase(getQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload;
      })
      .addCase(getQuotation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updateQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = action.payload;

        const index = state.quotations.findIndex((item: any) => item.id === action.payload.id);

        if (index !== -1) {
          state.quotations[index] = action.payload;
        }
      })
      .addCase(updateQuotation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;

        state.quotations = state.quotations.filter((item: any) => item.id !== action.payload.id);
      })
      .addCase(deleteQuotation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default QuotationSlice.reducer;
