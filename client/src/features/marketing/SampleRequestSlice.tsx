import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  samplerequests: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getSampleRequest = createAsyncThunk('samplerequest/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-samplerequest`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch samplerequest.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addSampleRequest = createAsyncThunk(
  'samplerequest/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-samplerequest`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateSampleRequest = createAsyncThunk(
  'samplerequest/update',
  async ({ id, data }: any) => {
    const response = await axiosInstance.put(`/update-samplerequest/${id}`, data);
    return response.data;
  },
);

export const deleteSampleRequest = createAsyncThunk<any, number, { rejectValue: any }>(
  'samplerequest/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-samplerequest/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete samplerequest.');
    }
  },
);

const SampleRequestSlice = createSlice({
  name: 'samplerequest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getSampleRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSampleRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.samplerequests = action.payload;
      })

      .addCase(getSampleRequest.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addSampleRequest.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addSampleRequest.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateSampleRequest.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateSampleRequest.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteSampleRequest.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteSampleRequest.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default SampleRequestSlice.reducer;
