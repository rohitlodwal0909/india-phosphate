import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../../constants/contant.tsx';

const initialState = {
  loading: false,
  error: null,
  storeequipment: [],
  issueequipment: [],
  data: null,
  addResult: null,
  update: null,
  deleteIssued: null,
};

export const getStoreEquipment = createAsyncThunk(
  'issue/store-equipment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/get-store-equipment`);
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

export const issuedEquipment = createAsyncThunk(
  'issue/issued-equipment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/issued-equipment`, data);
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

export const getIssuedEquipment = createAsyncThunk(
  'issue/equipment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/get-issued-equipment`);
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

export const deleteIssuedEquipment = createAsyncThunk(
  'issue/delete-equipment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/issued-delete-equipment/${id}`);
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

export const updateIssuedEquipment = createAsyncThunk(
  'issue/update-issued-equipment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/update-issued-equipment`, data);
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
const IssueEquipmentSlice = createSlice({
  name: 'issueEquipment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET checkin
      .addCase(getStoreEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.storeequipment = action.payload;
      })
      .addCase(getStoreEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(issuedEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(issuedEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(issuedEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getIssuedEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIssuedEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.issueequipment = action.payload.data;
      })
      .addCase(getIssuedEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteIssuedEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssuedEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteIssued = action.payload;
      })
      .addCase(deleteIssuedEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateIssuedEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssuedEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;
      })
      .addCase(updateIssuedEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default IssueEquipmentSlice.reducer;
