import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../../constants/contant.tsx';

const initialState = {
  loading: false,
  error: null,
  storepm: [],
  issuePM: [],
  data: null,
  addResult: null,
  update: null,
  deleteRawmaterial: null,
};

export const getStorePM = createAsyncThunk('issue/store-pm', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/get-store-pm`);
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

export const issuedPM = createAsyncThunk('issue/issued-pm', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiUrl}/issued-pm`, data);
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

export const getIssuedPM = createAsyncThunk('issue/pm', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/get-issued-pm`);
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

export const deleteIssuedPM = createAsyncThunk(
  'issue/delete-pm',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/issued-delete-pm/${id}`);
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

export const updateIssuedPM = createAsyncThunk(
  'issue/update-issued-pm',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/update-issued-pm`, data);
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

const PMIssueSlice = createSlice({
  name: 'pmissue',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET checkin
      .addCase(getStorePM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStorePM.fulfilled, (state, action) => {
        state.loading = false;
        state.storepm = action.payload.data;
      })
      .addCase(getStorePM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(issuedPM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(issuedPM.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(issuedPM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getIssuedPM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIssuedPM.fulfilled, (state, action) => {
        state.loading = false;
        state.issuePM = action.payload.data;
      })
      .addCase(getIssuedPM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteIssuedPM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssuedPM.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteRawmaterial = action.payload;
      })
      .addCase(deleteIssuedPM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateIssuedPM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssuedPM.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;
      })
      .addCase(updateIssuedPM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default PMIssueSlice.reducer;
