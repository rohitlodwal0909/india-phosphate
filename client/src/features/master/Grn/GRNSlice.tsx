import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  grndata: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetGrn = createAsyncThunk('GetGrn/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-grn`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch grn';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addGrn = createAsyncThunk('Grn/add', async (formdata: any, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/store-grn`, formdata);
    return response.data;
  } catch (error) {
    // Return a rejected action containing the error message
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Something went wrong',
    );
  }
});

export const updateGrn = createAsyncThunk('Grn/update', async (updatedUser: any) => {
  const response = await axiosInstance.put(`/update-grn/${updatedUser?.id}`, updatedUser);
  return response.data;
});

export const deleteGrn = createAsyncThunk<any, { id: string }, { rejectValue: any }>(
  'deleteGrn/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-grn/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
    }
  },
);

const GrnSlice = createSlice({
  name: 'grn',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetGrn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetGrn.fulfilled, (state, action) => {
        state.loading = false;
        state.grndata = action.payload;
      })
      .addCase(GetGrn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addGrn.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addGrn.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateGrn.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateGrn.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteGrn.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteGrn.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default GrnSlice.reducer;
