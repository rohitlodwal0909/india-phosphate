import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  audits: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getAudit = createAsyncThunk('audit/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-audit`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch audit.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addAudit = createAsyncThunk(
  'audit/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-audit`, formdata);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateAudit = createAsyncThunk('audit/update', async ({ id, data }: any) => {
  const response = await axiosInstance.put(`/update-audit/${id}`, data);
  return response.data;
});

export const deleteAudit = createAsyncThunk<any, number, { rejectValue: any }>(
  'audit/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-audit/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete audit.');
    }
  },
);

const AuditSlice = createSlice({
  name: 'audits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAudit.fulfilled, (state, action) => {
        state.loading = false;
        state.audits = action.payload;
      })

      .addCase(getAudit.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addAudit.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addAudit.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAudit.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateAudit.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAudit.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteAudit.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default AuditSlice.reducer;
