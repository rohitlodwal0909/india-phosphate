import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  overalldata: {
    total_debit: 0,
    total_credit: 0,
    total_po: 0,
    invoice_value: 0,
    company_wise: null,
    product_wise: null,
    grade_wise: null,
    topOutstandingCompanies: null,
  },
  customerledger: {
    customer: null,
    summary: null,
    productPurchaseSummary: null,
    gradeWiseBusiness: null,
    invoices: null,
    invoice_history: null,
    ledger: null,
  },
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getAllAccountdata = createAsyncThunk<any>('accountdata/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-overall-payment`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch Sample Invoice',
    );
  }
});

export const getCustomerledger = createAsyncThunk(
  'ledger/getCustomerLedger',
  async (id: number | string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-customer_ledger/${id}`);

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch customer ledger',
      );
    }
  },
);

const LedgerSlice = createSlice({
  name: 'ledgers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= GET ================= */
      .addCase(getAllAccountdata.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAccountdata.fulfilled, (state, action) => {
        state.loading = false;
        state.overalldata = action.payload;
      })

      .addCase(getAllAccountdata.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCustomerledger.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerledger.fulfilled, (state, action) => {
        state.loading = false;
        state.customerledger = action.payload;
      })

      .addCase(getCustomerledger.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default LedgerSlice.reducer;
