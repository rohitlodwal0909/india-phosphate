import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance.tsx';

const initialState = {
  loading: false,
  error: null,
  storeequipment: [],
  issueequipment: [],
  return: [],
  data: null,
  addResult: null,
  update: null,
  deleteIssued: null,
};

export const getStoreEquipment = createAsyncThunk(
  'issue/store-equipment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/get-store-equipment`);
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
      const response = await axiosInstance.post(`/issued-equipment`, data);
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
      const response = await axiosInstance.get(`/get-issued-equipment`);
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
      const response = await axiosInstance.delete(`/issued-delete-equipment/${id}`);
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
      const response = await axiosInstance.post(`/update-issued-equipment`, data);
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

export const returnEquipment = createAsyncThunk(
  'issue/return-equipment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/return-equipment`, data);
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
      })

      .addCase(returnEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.return = action.payload;
      })
      .addCase(returnEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default IssueEquipmentSlice.reducer;
