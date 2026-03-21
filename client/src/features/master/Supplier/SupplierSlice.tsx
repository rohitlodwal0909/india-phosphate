import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  supplierdata: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetSupplier = createAsyncThunk('GetSupplier /fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-supplier`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addSupplier = createAsyncThunk(
  'Supplier/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-supplier`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateSupplier = createAsyncThunk('Supplier/update', async (updatedUser: any) => {
  const response = await axiosInstance.put(`/update-supplier/${updatedUser?.id}`, updatedUser);
  return response.data;
});

export const deleteSupplier = createAsyncThunk<
  any,
  { id: string; user_id: any },
  { rejectValue: any }
>('deleteSupplier/delete', async ({ id, user_id }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/delete-supplier/${id}`, {
      data: { user_id },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
  }
});

const SupplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierdata = action.payload;
      })
      .addCase(GetSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addSupplier.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default SupplierSlice.reducer;
