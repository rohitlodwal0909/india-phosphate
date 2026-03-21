import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  productdata: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetProduct = createAsyncThunk('GetProduct/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-product`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addProduct = createAsyncThunk(
  'Product/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-product`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateProduct = createAsyncThunk('Product/update', async (updatedUser: any) => {
  const response = await axiosInstance.put(`/update-product/${updatedUser?.id}`, updatedUser);
  return response.data;
});

export const deleteProduct = createAsyncThunk<any, { id: string }, { rejectValue: any }>(
  'deleteProduct/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-product/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
    }
  },
);

const ProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productdata = action.payload;
      })
      .addCase(GetProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addProduct.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ProductSlice.reducer;
