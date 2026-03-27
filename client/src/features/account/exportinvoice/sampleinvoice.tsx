import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  invoices: [],
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

/* ======================================================
   CREATE SAMPLE INVOICE
====================================================== */
export const createSampleInvoice = createAsyncThunk<any, FormData>(
  'sampleInvoice/create',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/upload-sample-invoice`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Sample Invoice upload failed',
      );
    }
  },
);

/* ======================================================
   GET SAMPLE INVOICE
====================================================== */
export const getSampleInvoice = createAsyncThunk<any>('sampleInvoice/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-sample-invoice`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch Sample Invoice',
    );
  }
});

export const downloadSampleInvoice = createAsyncThunk<any, number>(
  'sampleInvoice/download',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/download-sample-invoice/${id}`, {
        responseType: 'blob', // ✅ VERY IMPORTANT
      });

      // create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SampleInvoice.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.remove();

      return true;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Download failed');
    }
  },
);

/* ======================================================
   UPDATE SAMPLE INVOICE
====================================================== */
export const updateSampleInvoice = createAsyncThunk<any, { id: number; data: FormData }>(
  'sampleInvoice/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-sample-invoice/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

/* ======================================================
   DELETE SAMPLE INVOICE
====================================================== */
export const deleteSampleInvoice = createAsyncThunk<any, number>(
  'sampleInvoice/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-sample-invoice/${id}`);

      return { id, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

/* ======================================================
   SLICE
====================================================== */

const SampleInvoiceSlice = createSlice({
  name: 'sampleInvoice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= CREATE ================= */
      .addCase(createSampleInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSampleInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = action.payload;

        state.invoices.unshift(action.payload);
      })
      .addCase(createSampleInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET ================= */
      .addCase(getSampleInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSampleInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })

      .addCase(getSampleInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(downloadSampleInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadSampleInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadSampleInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updateSampleInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSampleInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = action.payload;

        const index = state.invoices.findIndex((item: any) => item.id === action.payload.id);

        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(updateSampleInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteSampleInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSampleInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;

        state.invoices = state.invoices.filter((item: any) => item.id !== action.payload.id);
      })
      .addCase(deleteSampleInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SampleInvoiceSlice.reducer;
