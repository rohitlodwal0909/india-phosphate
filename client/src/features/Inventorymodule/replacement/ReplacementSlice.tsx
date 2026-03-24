import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance.tsx';

const initialState = {
  loading: false,
  error: null,
  replacement: [],
  addreplacement: null,
  updateResult: null,
  deleteResult: null,
};

export const addReplacement = createAsyncThunk('replacement/add', async (data: any, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/add-replacement`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data || error.message || 'Something went wrong',
    );
  }
});

export const getReplacement = createAsyncThunk('replacement/find', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-replacement`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data || error.message || 'Something went wrong',
    );
  }
});

const ReplacementSlice = createSlice({
  name: 'replacements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getReplacement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReplacement.fulfilled, (state, action) => {
        state.loading = false;
        state.replacement = action.payload;
      })
      .addCase(getReplacement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addReplacement.fulfilled, (state, action) => {
        state.addreplacement = action.payload;
      })
      .addCase(addReplacement.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ReplacementSlice.reducer;
