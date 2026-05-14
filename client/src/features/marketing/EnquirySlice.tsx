import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  enquiries: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getEnquiry = createAsyncThunk('enquiry/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-enquiry`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch enquiry.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addEnquiry = createAsyncThunk(
  'enquiry/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-enquiry`, formdata);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateEnquiry = createAsyncThunk('enquiry/update', async ({ id, data }: any) => {
  const response = await axiosInstance.put(`/update-enquiry/${id}`, data);
  return response.data;
});

export const deleteEnquiry = createAsyncThunk<any, number, { rejectValue: any }>(
  'enquiry/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-enquiry/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete enquiry.');
    }
  },
);

const EnquirySlice = createSlice({
  name: 'enquiry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload;
      })

      .addCase(getEnquiry.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addEnquiry.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addEnquiry.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateEnquiry.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateEnquiry.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteEnquiry.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default EnquirySlice.reducer;
