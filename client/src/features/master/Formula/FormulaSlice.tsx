import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  Formuladata: [],
  data: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetFormula = createAsyncThunk('GetFormula /fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-formula`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addFormula = createAsyncThunk(
  'Formula/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/store-formula`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const createSpecification = createAsyncThunk(
  'specification/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-specification`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const getSpecificationById = createAsyncThunk(
  'Formula/getSpecificationById',
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getSpecificationById/${id}`);
      return response.data;
    } catch (error: any) {
      // Handle server or validation error
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // API responded with error message
      } else {
        return rejectWithValue({ message: 'Something went wrong. Please try again.' });
      }
    }
  },
);

export const updateFormula = createAsyncThunk(
  'Formula/update',
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/update-formula/${updatedUser?.id}`, updatedUser);
      return response.data;
    } catch (error: any) {
      // Handle server or validation error
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // API responded with error message
      } else {
        return rejectWithValue({ message: 'Something went wrong. Please try again.' });
      }
    }
  },
);

export const deleteFormula = createAsyncThunk<
  any,
  { id: string; user_id: any },
  { rejectValue: any }
>('deleteFormula/delete', async ({ id, user_id }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/delete-formula/${id}`, {
      data: { user_id },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
  }
});

const FormulaSlice = createSlice({
  name: 'formula',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetFormula.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFormula.fulfilled, (state, action) => {
        state.loading = false;
        state.Formuladata = action.payload;
      })
      .addCase(GetFormula.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getSpecificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpecificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getSpecificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addFormula.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addFormula.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(createSpecification.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(createSpecification.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateFormula.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateFormula.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteFormula.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteFormula.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default FormulaSlice.reducer;
