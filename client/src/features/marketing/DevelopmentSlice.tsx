import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  developments: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getDevelopment = createAsyncThunk('development/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-development`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch development.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addDevelopment = createAsyncThunk(
  'development/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-development`, formdata);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateDevelopment = createAsyncThunk(
  'development/update',
  async ({ id, data }: any) => {
    const response = await axiosInstance.put(`/update-development/${id}`, data);
    return response.data;
  },
);

export const deleteDevelopment = createAsyncThunk<any, number, { rejectValue: any }>(
  'development/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-development/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete development.');
    }
  },
);

const DevelopmentSlice = createSlice({
  name: 'development',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getDevelopment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDevelopment.fulfilled, (state, action) => {
        state.loading = false;
        state.developments = action.payload;
      })

      .addCase(getDevelopment.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addDevelopment.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDevelopment.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDevelopment.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDevelopment.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteDevelopment.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDevelopment.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default DevelopmentSlice.reducer;
