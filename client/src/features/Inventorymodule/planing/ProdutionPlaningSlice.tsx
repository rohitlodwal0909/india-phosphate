import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance.tsx';

const initialState = {
  loading: false,
  error: null,
  data: [],
  qcproduction: [],
  addResult: null,
  editResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getProductionPlanning = createAsyncThunk(
  'getproductionPlanning/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/get-production-planning`);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Something went wrong while fetching check-ins.';
      return rejectWithValue(message);
    }
  },
);

export const createProductionPlaning = createAsyncThunk(
  'addProduction/create',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-production-planing`, formdata);
      return response.data;
    } catch (error) {
      // Optional: Log for debugging
      console.error('Add checkin error:', error);

      // Try to extract a message from the server
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error occurred';

      return rejectWithValue(message);
    }
  },
);

export const updateProductionPlaning = createAsyncThunk(
  'editProduction/edit',
  async ({ id, formdata }: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/update-production-planing/${id}`, formdata);

      return response.data;
    } catch (error: any) {
      console.error('Update Production error:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error occurred';

      return rejectWithValue(message);
    }
  },
);

export const deleteProductionPlanning = createAsyncThunk(
  'Dispatch/delete',
  async (id: any, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-production-planning/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
    }
  },
);

const ProdutionSlice = createSlice({
  name: 'productionplanning',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getProductionPlanning.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductionPlanning.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProductionPlanning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD checkin
      .addCase(createProductionPlaning.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(createProductionPlaning.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(updateProductionPlaning.fulfilled, (state, action) => {
        state.editResult = action.payload;
      })
      .addCase(updateProductionPlaning.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(deleteProductionPlanning.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteProductionPlanning.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ProdutionSlice.reducer;
