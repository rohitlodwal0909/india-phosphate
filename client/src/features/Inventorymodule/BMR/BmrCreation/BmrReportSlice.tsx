import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  data: [],
  bmrreport: [],
  addResult: null,
  lineClearance: null,
  dispensingRaw: null,
  pmIssuance: null,
  sieverecord: null,
  inprocessdata: null,
  qcIntemation: null,
  updateResult: null,
  deleteResult: null,
};

export const getProductionBatch = createAsyncThunk(
  'production/batch',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/get-production-batch/${id}`);
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
export const getBmrReport = createAsyncThunk(
  'bmr/bmr-report',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/get-bmr-report/${id}`);
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

export const saveLineClearance = createAsyncThunk(
  'Bmr/lineSave',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-bmr-line-clearance`, data);
      return response.data;
    } catch (error) {
      // Optional: Log for debugging
      console.error('Add checkin error:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error occurred';

      return rejectWithValue(message);
    }
  },
);

export const saveDispensingRawMaterial = createAsyncThunk<any, any, { rejectValue: string }>(
  'bmr/saveDispensingRM',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-bmr-dispensing-raw-material`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Server Error');
      }
      if (error.request) {
        return rejectWithValue('No response from server');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const saveEquipmentList = createAsyncThunk<any, any, { rejectValue: string }>(
  'bmr/saveEquipment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-bmr-equipment-list`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Server Error');
      }
      if (error.request) {
        return rejectWithValue('No response from server');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const saveSieveIntegrityRecord = createAsyncThunk<any, any, { rejectValue: string }>(
  'bmr/saveSieveIntegrity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-sieve-integrity-record`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Server Error');
      }
      if (error.request) {
        return rejectWithValue('No response from server');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const inprocessCheck = createAsyncThunk<any, any, { rejectValue: string }>(
  'bmr/inprocess-check',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-inprocess-check`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Server Error');
      }
      if (error.request) {
        return rejectWithValue('No response from server');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const createQCIntimation = createAsyncThunk<any, any, { rejectValue: string }>(
  'bmr/save-qc-intimation',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-qc-intimation`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Server Error');
      }
      if (error.request) {
        return rejectWithValue('No response from server');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const savePmIssuence = createAsyncThunk<any, any, { rejectValue: string }>(
  'bmr/save-pm-issuence',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-pm-issuence`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Server Error');
      }
      if (error.request) {
        return rejectWithValue('No response from server');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

const BmrReportSlice = createSlice({
  name: 'bmrReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductionBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductionBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getProductionBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getBmrReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBmrReport.fulfilled, (state, action) => {
        state.loading = false;
        state.bmrreport = action.payload;
      })
      .addCase(getBmrReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(saveLineClearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveLineClearance.fulfilled, (state, action) => {
        state.lineClearance = action.payload;
      })
      .addCase(saveLineClearance.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(saveDispensingRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDispensingRawMaterial.fulfilled, (state, action) => {
        state.dispensingRaw = action.payload;
      })
      .addCase(saveDispensingRawMaterial.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(saveSieveIntegrityRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSieveIntegrityRecord.fulfilled, (state, action) => {
        state.sieverecord = action.payload;
      })
      .addCase(saveSieveIntegrityRecord.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(inprocessCheck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inprocessCheck.fulfilled, (state, action) => {
        state.inprocessdata = action.payload;
      })
      .addCase(inprocessCheck.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createQCIntimation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQCIntimation.fulfilled, (state, action) => {
        state.qcIntemation = action.payload;
      })
      .addCase(createQCIntimation.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(savePmIssuence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePmIssuence.fulfilled, (state, action) => {
        state.pmIssuance = action.payload;
      })
      .addCase(savePmIssuence.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default BmrReportSlice.reducer;
