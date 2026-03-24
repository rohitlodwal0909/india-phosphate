import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  customerdata: [],
  existscustomer: [],
  productswithpo: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetCustomer = createAsyncThunk('GetCustomer /fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-customer`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const GetExistingCustomer = createAsyncThunk('existing/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-existing-customer`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addNote = createAsyncThunk('note/add', async (formdata: any, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/add-note`, formdata);
    return response.data;
  } catch (error) {
    // Return a rejected action containing the error message
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Something went wrong',
    );
  }
});

export const addCustomer = createAsyncThunk(
  'Customer/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-customer`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateCustomer = createAsyncThunk('Customer/update', async (updatedUser: any) => {
  const response = await axiosInstance.put(`/update-customer/${updatedUser?.id}`, updatedUser);
  return response.data;
});

export const deleteCustomer = createAsyncThunk<any, { id: string }, { rejectValue: any }>(
  'deleteCustomer/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-customer/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
    }
  },
);

export const getProductWithPO = createAsyncThunk<any, { id: string }, { rejectValue: any }>(
  'productspo/find',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/get-products-po/${id}`);
      return response.data.data; // ✅ RETURN DATA
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product PO.');
    }
  },
);

const CustomerSlice = createSlice({
  name: 'Customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerdata = action.payload;
      })
      .addCase(GetCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(GetExistingCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetExistingCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.existscustomer = action.payload;
      })
      .addCase(GetExistingCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getProductWithPO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductWithPO.fulfilled, (state, action) => {
        state.loading = false;
        state.productswithpo = action.payload;
      })
      .addCase(getProductWithPO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(addNote.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CustomerSlice.reducer;
