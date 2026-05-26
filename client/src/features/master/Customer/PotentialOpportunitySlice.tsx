import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  potoppertunity: [],
  productswithpo: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getPotOppertunity = createAsyncThunk(
  'getPotOppertunity/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-potential-oppertunity`);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const addpotentialNote = createAsyncThunk(
  'note/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/add-potential-note`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const addPotOppertunity = createAsyncThunk(
  'PotOppertunity/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-potential-oppertunity`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updatePotOppertunity = createAsyncThunk(
  'PotOppertunity/update',
  async (updatedUser: any) => {
    const response = await axiosInstance.put(
      `/update-potential-oppertunity/${updatedUser?.id}`,
      updatedUser,
    );
    return response.data;
  },
);

export const deletePotOppertunity = createAsyncThunk<any, { id: string }, { rejectValue: any }>(
  'deletePotOppertunity/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-potential-oppertunity/${id}`);
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

const PotOppertunitySlice = createSlice({
  name: 'potentialopportunity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(getPotOppertunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPotOppertunity.fulfilled, (state, action) => {
        state.loading = false;
        state.potoppertunity = action.payload;
      })
      .addCase(getPotOppertunity.rejected, (state, action) => {
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
      .addCase(addPotOppertunity.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addPotOppertunity.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(addpotentialNote.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addpotentialNote.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updatePotOppertunity.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updatePotOppertunity.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deletePotOppertunity.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deletePotOppertunity.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default PotOppertunitySlice.reducer;
