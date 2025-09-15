import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../constants/contant.tsx";

const initialState = {
  loading: false,
  error: null as string | null,
  data: [] as any[],         // for approved batches
  addResult: null as any,    // for add-fpr result
};

// ✅ Fetch Approved Batches
export const getApprovedBatch = createAsyncThunk(
  "approvedBatch/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/get-approved-batch`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong while fetching approved batches.";
      return rejectWithValue(message);
    }
  }
);

// ✅ Add FPR (Release No + Release Date)
export const addFpr = createAsyncThunk(
  "fpr/add",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/add-fpr`, data);
      return response.data;
    } catch (error: any) {
      console.error("Add FPR error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error occurred";
      return rejectWithValue(message);
    }
  }
);

const FprSlice = createSlice({
  name: "fpr",
  initialState,
  reducers: {
    resetAddResult(state) {
      state.addResult = null; // optional: reset after success
    },
  },
  extraReducers: (builder) => {
    builder
      // 📌 Approved Batch
      .addCase(getApprovedBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApprovedBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getApprovedBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 📌 Add FPR
      .addCase(addFpr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFpr.fulfilled, (state, action) => {
        state.loading = false;
        state.addResult = action.payload;
      })
      .addCase(addFpr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAddResult } = FprSlice.actions;
export default FprSlice.reducer;
