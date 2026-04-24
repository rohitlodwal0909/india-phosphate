import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  purchaseOrders: [],
  poReport: [],
  customers: [],
  addResult: null,
  remark: null,
  paymentremark: null,
  status: null,
  change: null,
  addWorkOrder: null,
  updateResult: null,
  deleteResult: null,
};

export const getPurchaseOrders = createAsyncThunk('purchaseOrder/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-purchase-orders`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch purchase orders.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getPOById = createAsyncThunk<
  any, // response type
  number, // argument type
  { rejectValue: string }
>('purchaseOrder/ById', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-po-report/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch purchase orders.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getAllCustomers = createAsyncThunk(
  'purchaseOrder/all-customers',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-all-customers`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch purchase orders.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const addPurchaseOrder = createAsyncThunk(
  'purchaseOrder/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-purchase-order`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrder/update',
  async ({ id, data }: any) => {
    const response = await axiosInstance.put(`/update-purchase-order/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
);

export const paymentApprove = createAsyncThunk(
  'purchaseOrder/paymentApprove',
  async ({ id, status }: { id: number; status: string }) => {
    const response = await axiosInstance.put(
      `/payment-approve/${id}`,
      { status }, // ✅ send object
    );

    return response.data;
  },
);

export const addRemarkPO = createAsyncThunk(
  'purchaseOrder/addRemarkPO',
  async ({ id, remark }: { id: number; remark: string }) => {
    const response = await axiosInstance.put(
      `/payment-remark/${id}`,
      { remark }, // ✅ send object
    );

    return response.data;
  },
);

export const deletePurchaseOrder = createAsyncThunk<any, number, { rejectValue: any }>(
  'purchaseOrder/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-purchase-order/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete purchase order.');
    }
  },
);

export const createWorkOrderNo = createAsyncThunk(
  'purchaseOrder/createWorkorder',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-work-order-no`, formdata);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateWorkOrderStatus = createAsyncThunk(
  'purchaseOrder/updateWorkOrderStatus',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/work-order/status-update', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  },
);

export const addRemark = createAsyncThunk(
  'purchaseOrder/remark',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/add-remark`, formdata);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

const PurchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload;
      })

      .addCase(getPurchaseOrders.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPOById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPOById.fulfilled, (state, action) => {
        state.loading = false;
        state.poReport = action.payload;
      })
      .addCase(getPOById.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getAllCustomers.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addPurchaseOrder.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addPurchaseOrder.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updatePurchaseOrder.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      .addCase(paymentApprove.fulfilled, (state, action) => {
        state.change = action.payload;
      })
      .addCase(paymentApprove.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      .addCase(addRemarkPO.fulfilled, (state, action) => {
        state.paymentremark = action.payload;
      })
      .addCase(addRemarkPO.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deletePurchaseOrder.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // ADD
      .addCase(createWorkOrderNo.fulfilled, (state, action) => {
        state.addWorkOrder = action.payload;
      })
      .addCase(createWorkOrderNo.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      .addCase(addRemark.fulfilled, (state, action) => {
        state.remark = action.payload;
      })
      .addCase(addRemark.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      .addCase(updateWorkOrderStatus.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(updateWorkOrderStatus.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default PurchaseOrderSlice.reducer;
