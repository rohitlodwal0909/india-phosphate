import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  meetings: [],
  addResult: null,
  complete: null,
  updateResult: null,
  deleteResult: null,
};

export const getMeeting = createAsyncThunk('meeting/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-meeting`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch meeting.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addMeeting = createAsyncThunk(
  'meeting/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-meeting`, formdata);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateMeeting = createAsyncThunk('meeting/update', async ({ id, data }: any) => {
  const response = await axiosInstance.put(`/update-meeting/${id}`, data);
  return response.data;
});

export const meetingComplete = createAsyncThunk(
  'meeting/complete',
  async ({ id }: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/complete-meeting/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Meeting complete failed');
    }
  },
);

export const deleteMeeting = createAsyncThunk<any, number, { rejectValue: any }>(
  'meeting/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-meeting/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meeting.');
    }
  },
);

const MeetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload;
      })

      .addCase(getMeeting.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addMeeting.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addMeeting.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateMeeting.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      .addCase(meetingComplete.fulfilled, (state, action) => {
        state.complete = action.payload;
      })
      .addCase(meetingComplete.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteMeeting.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default MeetingSlice.reducer;
