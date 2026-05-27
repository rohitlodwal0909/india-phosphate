import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  disputes: [],
  poandsample: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getPoandsample = createAsyncThunk('dispute/poandsample', async ({ name }: any) => {
  const response = await axiosInstance.get(`/get-poandsample/${name}`);
  return response.data;
});

export const getDispute = createAsyncThunk('dispute/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-disputes`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch dispute.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addDispute = createAsyncThunk(
  'dispute/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-dispute`, formdata);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateDispute = createAsyncThunk('dispute/update', async ({ id, data }: any) => {
  const response = await axiosInstance.put(`/update-dispute/${id}`, data);
  return response.data;
});

export const deleteDispute = createAsyncThunk<any, number, { rejectValue: any }>(
  'dispute/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-dispute/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete dispute.');
    }
  },
);

const DisputeSlice = createSlice({
  name: 'disputes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDispute.fulfilled, (state, action) => {
        state.loading = false;
        state.disputes = action.payload;
      })

      .addCase(getDispute.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPoandsample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoandsample.fulfilled, (state, action) => {
        state.loading = false;
        state.poandsample = action.payload;
      })

      .addCase(getPoandsample.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addDispute.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDispute.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDispute.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDispute.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteDispute.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDispute.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default DisputeSlice.reducer;
