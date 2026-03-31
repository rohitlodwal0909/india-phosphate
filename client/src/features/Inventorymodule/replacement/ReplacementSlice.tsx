import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance.tsx';

const initialState = {
  loading: false,
  error: null,
  replacement: [],
  addreplacement: null,
  update: null,
  delete: null,
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

export const updateReplacement = createAsyncThunk(
  'replacement/update',
  async (data: any, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-replacement`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || 'Something went wrong',
      );
    }
  },
);

export const deleteReplacement = createAsyncThunk(
  'replacement/delete',
  async (id: Number, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-replacement/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || 'Something went wrong',
      );
    }
  },
);

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
      })

      .addCase(updateReplacement.fulfilled, (state, action) => {
        state.update = action.payload;
      })
      .addCase(updateReplacement.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteReplacement.fulfilled, (state, action) => {
        state.delete = action.payload;
      })
      .addCase(deleteReplacement.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ReplacementSlice.reducer;
