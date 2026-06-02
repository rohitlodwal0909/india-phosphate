import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  overalldata: [],
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getAllAccountdata = createAsyncThunk<any>('accountdata/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-overall-payment`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch Sample Invoice',
    );
  }
});

const LedgerSlice = createSlice({
  name: 'ledgers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= GET ================= */
      .addCase(getAllAccountdata.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAccountdata.fulfilled, (state, action) => {
        state.loading = false;
        state.overalldata = action.payload;
      })

      .addCase(getAllAccountdata.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default LedgerSlice.reducer;
