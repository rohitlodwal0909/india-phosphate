import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  invoiceentry: [],
  singleinvoice: [],
  dispatchBatches: [],
  invoices: [],
  create: null,
  update: null,
  deleteResult: null,
};

export const getentryinvoice = createAsyncThunk<any, number>(
  'invoiceentry/fetch',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-invoice-entry?status=${id}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch invoice entry.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const createInvoice = createAsyncThunk<any, any, { rejectValue: any }>(
  'refrensenumber/add',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-invoice`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to create invoice.');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

interface UpdateInvoicePayload {
  id: string;
  data: any;
}

export const updateInvoice = createAsyncThunk<any, UpdateInvoicePayload>(
  'invoice/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-invoice/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update invoice.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const getInvoice = createAsyncThunk<any, number>('invoice/get', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-invoice/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch invoice.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getInvoices = createAsyncThunk<any, void>('invoices/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-invoices`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch invoice.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getDispatchBatches = createAsyncThunk<any, void>(
  'dispatch/getBatches',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-dispatch-batches`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch invoice.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const uploadEwayPdf = createAsyncThunk<any, FormData>(
  'invoice/uploadEwayPdf',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/upload-eway`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  },
);

const TaxInvoiceSlice = createSlice({
  name: 'taxinvoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getentryinvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getentryinvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceentry = action.payload;
      })
      .addCase(getentryinvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDispatchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDispatchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatchBatches = action.payload;
      })
      .addCase(getDispatchBatches.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.create = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;
      })
      .addCase(updateInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.singleinvoice = action.payload;
      })
      .addCase(getInvoice.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(getInvoices.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadEwayPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadEwayPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;
      })
      .addCase(uploadEwayPdf.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default TaxInvoiceSlice.reducer;
