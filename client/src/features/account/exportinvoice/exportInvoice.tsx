import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  excels: [],
  upload: null,
  update: null,
  deleteResult: null,
};

// ✅ UPLOAD (CREATE)
export const createExcelInvoice = createAsyncThunk<any, FormData>(
  'invoice/upload',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/upload-export-invoice`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  },
);

// ✅ GET
export const getExcelInvoice = createAsyncThunk<any>('invoice/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-excel-invoice`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice.');
  }
});

// ✅ UPDATE
export const updateExcelInvoice = createAsyncThunk<any, { id: number; data: FormData }>(
  'invoice/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-export-invoice/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

// ✅ DELETE
export const deleteExportInvoice = createAsyncThunk<any, number>(
  'invoice/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-export-invoice/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

const ExportInvoiceSlice = createSlice({
  name: 'exportinvoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ================= UPLOAD =================
      .addCase(createExcelInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExcelInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.upload = action.payload;

        // 👉 auto add in list (no refetch needed)
        state.excels.unshift(action.payload);
      })
      .addCase(createExcelInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET =================
      .addCase(getExcelInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExcelInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.excels = action.payload;
      })
      .addCase(getExcelInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateExcelInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExcelInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;

        // 👉 update list without reload
        const index = state.excels.findIndex((item: any) => item.id === action.payload.id);

        if (index !== -1) {
          state.excels[index] = action.payload;
        }
      })
      .addCase(updateExcelInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteExportInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExportInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;

        // 👉 remove from list instantly
        state.excels = state.excels.filter((item: any) => item.id !== action.payload.id);
      })
      .addCase(deleteExportInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ExportInvoiceSlice.reducer;
