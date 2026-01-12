import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../../constants/contant.tsx';

const initialState = {
  loading: false,
  error: null,
  storerm: [],
  issueRawmaterial: [],
  data: null,
  addResult: null,
  update: null,
  deleteRawmaterial: null,
};

export const getStoreRM = createAsyncThunk('issue/store-rm', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/get-store-rm`);
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

export const issuedRawMaterial = createAsyncThunk(
  'issue/issued-raw-material',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/issued-raw-material`, data);
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

export const getIssuedRawMaterial = createAsyncThunk(
  'issue/rawmaterial',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/get-issued-raw-material`);
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

export const deleteIssuedRawMaterial = createAsyncThunk(
  'issue/delete-raw-material',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/issued-delete-rm/${id}`);
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

export const updateIssuedRawMaterial = createAsyncThunk(
  'issue/update-issued-rm',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/update-issued-rm`, data);
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

const RMIssueSlice = createSlice({
  name: 'rmissue',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET checkin
      .addCase(getStoreRM.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreRM.fulfilled, (state, action) => {
        state.loading = false;
        state.storerm = action.payload.data;
      })
      .addCase(getStoreRM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(issuedRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(issuedRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(issuedRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getIssuedRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIssuedRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.issueRawmaterial = action.payload.data;
      })
      .addCase(getIssuedRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteIssuedRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssuedRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteRawmaterial = action.payload;
      })
      .addCase(deleteIssuedRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateIssuedRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssuedRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;
      })
      .addCase(updateIssuedRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default RMIssueSlice.reducer;
