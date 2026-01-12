import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../constants/contant';
const initialState = {
  loading: false,
  error: null,
  roledata: [],
  savepermissionData: null,
  permission: null,
};

export const GetRole = createAsyncThunk('role/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/roles`);
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

export const SavePermission = createAsyncThunk(
  'Save/fetch',
  async (fromdata: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/save/permission`, fromdata);
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

export const GetSavePermission = createAsyncThunk(
  'Savepermission/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/role/permission/${userId}`);
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
const PermissionSlice = createSlice({
  name: 'rolepermission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roledata = action.payload;
      })
      .addCase(GetRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(GetSavePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSavePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permission = action.payload;
      })
      .addCase(GetSavePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(SavePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.savepermissionData = action.payload;
      })
      .addCase(SavePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default PermissionSlice.reducer;
