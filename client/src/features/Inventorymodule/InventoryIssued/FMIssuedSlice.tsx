import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance.tsx';

/* =====================================================
   TYPES
===================================================== */

interface IssuePayload {
  finish_id: string;
  issued_qty: string;
  remark: string;
}

interface FMIssuedState {
  loading: boolean;
  error: string | null;
  batches: any[];
  issuedFMList: any[];
  addResult: any;
  updateResult: any;
  deleteResult: any;
}

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: FMIssuedState = {
  loading: false,
  error: null,
  batches: [],
  issuedFMList: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

/* =====================================================
   API CALLS (THUNKS)
===================================================== */

/* ✅ GET BATCHES */
export const getBatches = createAsyncThunk(
  'issuedFM/getBatches',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/issued-fm/batches');
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch batches');
    }
  },
);

/* ✅ ADD ISSUED FM */
export const issuedFM = createAsyncThunk<any, IssuePayload>(
  'issuedFM/add',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/issued-fm', data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to issue FM');
    }
  },
);

/* ✅ GET ISSUED FM LIST */
export const getIssuedFM = createAsyncThunk('issuedFM/getAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/get-issued-fm');
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch issued FM');
  }
});

/* ✅ DELETE ISSUED FM */
export const deleteIssuedFM = createAsyncThunk(
  'issuedFM/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/issued-fm/${id}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

/* ✅ UPDATE ISSUED FM */
export const updateIssuedFM = createAsyncThunk(
  'issuedFM/update',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/issued-fm', data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

/* =====================================================
   SLICE
===================================================== */

const FMIssuedSlice = createSlice({
  name: 'issuedFM',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ---------------- BATCHES ---------------- */
      .addCase(getBatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload.data;
      })
      .addCase(getBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------------- ADD FM ---------------- */
      .addCase(issuedFM.pending, (state) => {
        state.loading = true;
      })
      .addCase(issuedFM.fulfilled, (state, action) => {
        state.loading = false;
        state.addResult = action.payload;
      })
      .addCase(issuedFM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------------- GET LIST ---------------- */
      .addCase(getIssuedFM.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIssuedFM.fulfilled, (state, action) => {
        state.loading = false;
        state.issuedFMList = action.payload.data;
      })
      .addCase(getIssuedFM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------------- DELETE ---------------- */
      .addCase(deleteIssuedFM.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteIssuedFM.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;
      })
      .addCase(deleteIssuedFM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------------- UPDATE ---------------- */
      .addCase(updateIssuedFM.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIssuedFM.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = action.payload;
      })
      .addCase(updateIssuedFM.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default FMIssuedSlice.reducer;
