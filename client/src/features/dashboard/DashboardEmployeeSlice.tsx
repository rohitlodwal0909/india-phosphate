import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

interface DashboardState {
  loading: boolean;
  error: string | null;

  employeedata: any;
  pendingtask: any[];
  remainingtask: any[];

  addResult: any;
  updateResult: any;
  deleteResult: any;
}

const initialState: DashboardState = {
  loading: false,
  error: null,

  employeedata: null,
  pendingtask: [],
  remainingtask: [],

  addResult: null,
  updateResult: null,
  deleteResult: null,
};

/* =========================================================
   GET PENDING TASK
========================================================= */

export const getPendingTask = createAsyncThunk(
  'dashboard/getPendingTask',
  async (id: number | string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-pending-task/${id}`);

      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch pending tasks',
      );
    }
  },
);

export const getRemainingTask = createAsyncThunk(
  'dashboard/getRemainingTask',
  async (id: number | string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-remaining-task/${id}`);

      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch remaining tasks',
      );
    }
  },
);

const DashboardEmployeeSlice = createSlice({
  name: 'employeedashboard',
  initialState,

  reducers: {
    clearPendingTasks: (state) => {
      state.pendingtask = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPendingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPendingTask.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingtask = action.payload || [];
      })

      .addCase(getPendingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRemainingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRemainingTask.fulfilled, (state, action) => {
        state.loading = false;
        state.remainingtask = action.payload || [];
      })

      .addCase(getRemainingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPendingTasks } = DashboardEmployeeSlice.actions;

export default DashboardEmployeeSlice.reducer;
