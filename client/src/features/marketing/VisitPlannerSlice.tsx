import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  visitplanner: [],
  customers: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getVisitPlanner = createAsyncThunk('visitplanner/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-visitplanners`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch visitplanner.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getallCustomer = createAsyncThunk('visitplanner/customer', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-all-customers`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch visitplanner.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addVisitPlanner = createAsyncThunk(
  'visitplanner/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-visitplanner`, formdata);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateVisitPlanner = createAsyncThunk(
  'visitplanner/update',
  async ({ id, data }: any) => {
    const response = await axiosInstance.put(`/update-visitplanner/${id}`, data);
    return response.data;
  },
);

export const deleteVisitPlanner = createAsyncThunk<any, number, { rejectValue: any }>(
  'visitplanner/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-visitplanner/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete visitplanner.');
    }
  },
);

const VisitPlannerSlice = createSlice({
  name: 'visitplanner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getVisitPlanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVisitPlanner.fulfilled, (state, action) => {
        state.loading = false;
        state.visitplanner = action.payload;
      })

      .addCase(getVisitPlanner.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getallCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })

      .addCase(getallCustomer.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addVisitPlanner.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addVisitPlanner.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateVisitPlanner.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateVisitPlanner.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteVisitPlanner.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteVisitPlanner.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default VisitPlannerSlice.reducer;
