import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from 'src/constants/contant';

const initialState = {
  loading: false,
  error: null,
  data: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetBmrRecords = createAsyncThunk('Bmr/record', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/get-bmr-records`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong while fetching check-ins.';
    return rejectWithValue(message);
  }
});

export const saveBmrRecord = createAsyncThunk(
  'Bmr/save',
  async (newCheckin: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/save-bmr-record`, newCheckin);
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

export const updateLineClearance = createAsyncThunk(
  'Bmr/lineUpdate',
  async ({ id, payload }: { id: number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/update-bmr-line-clearance/${id}`, payload);

      return response.data;
    } catch (error: any) {
      console.error('Update Line Clearance error:', error);

      const message = error.response?.data?.message || error.message || 'Update failed';

      return rejectWithValue(message);
    }
  },
);

export const getLineClearance = createAsyncThunk(
  'Bmr/line',
  async (recordId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/get-line-clearance/` + recordId);
      return response.data;
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

export const updateBmrRecord = createAsyncThunk(
  'Bmr/update',
  async (updatedCheckin: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-bmr-record/${updatedCheckin.id}`,
        updatedCheckin,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update checkin.');
    }
  },
);

export const deleteBmrRecord = createAsyncThunk(
  'Bmr/delete',
  async (checkinId: any, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-bmr-record/${checkinId}`);
      return checkinId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
    }
  },
);

const BmrRecordSlice = createSlice({
  name: 'bmrRecords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetBmrRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetBmrRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(GetBmrRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD checkin
      .addCase(saveBmrRecord.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(saveBmrRecord.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(updateLineClearance.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(updateLineClearance.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE checkin
      .addCase(updateBmrRecord.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateBmrRecord.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // DELETE checkin
      .addCase(deleteBmrRecord.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteBmrRecord.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default BmrRecordSlice.reducer;
