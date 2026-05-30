import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  tasks: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getTask = createAsyncThunk('task/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-task`);
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch task.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addTask = createAsyncThunk('task/add', async (formdata: any, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/store-task`, formdata);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Something went wrong',
    );
  }
});

export const updateTask = createAsyncThunk('task/update', async ({ id, data }: any) => {
  const response = await axiosInstance.put(`/update-task/${id}`, data);
  return response.data;
});

export const statusChange = createAsyncThunk(
  'task/status',
  async ({ id, status }: any, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/change-status-task/${id}`, {
        status,
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Status update failed');
    }
  },
);

export const deleteTask = createAsyncThunk<any, number, { rejectValue: any }>(
  'task/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-task/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task.');
    }
  },
);

const TaskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(getTask.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addTask.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addTask.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateTask.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      .addCase(statusChange.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(statusChange.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteTask.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default TaskSlice.reducer;
