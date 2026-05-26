import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  gradedata: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetGrade = createAsyncThunk('GetGrade /fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-grade`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addGrade = createAsyncThunk(
  'Grade/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-grade`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateGrade = createAsyncThunk('Grade/update', async (updatedUser: any) => {
  const response = await axiosInstance.put(`/update-grade/${updatedUser?.id}`, updatedUser);
  return response.data;
});

export const deleteGrade = createAsyncThunk<any, { id: string }, { rejectValue: any }>(
  'deleteGrade/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-grade/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
    }
  },
);

const GradeSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.gradedata = action.payload;
      })
      .addCase(GetGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addGrade.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addGrade.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateGrade.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteGrade.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteGrade.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default GradeSlice.reducer;
