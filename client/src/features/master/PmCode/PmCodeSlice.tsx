import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../../constants/contant';

const initialState = {
  loading: false,
  error: null,
  pmcodedata: [],
  pmrawmaterial: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetPmCode = createAsyncThunk('GetPmCode/fetch', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${apiUrl}/get-pm-code`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const GetPmRawMaterial = createAsyncThunk('GetPmRaw/fetch', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${apiUrl}/get-pm-raw-material/` + id);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addPmCode = createAsyncThunk(
  'PmCode/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-pm-code`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const addpmrawmaterial = createAsyncThunk(
  'PmCode/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-pm-raw-material`, formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updatePmCode = createAsyncThunk('PmCode/update', async (updatedUser: any) => {
  const response = await axios.put(`${apiUrl}/update-pm-code/${updatedUser?.id}`, updatedUser);
  return response.data;
});

export const deletePmCode = createAsyncThunk<
  any,
  { id: string; user_id: any },
  { rejectValue: any }
>('deletePmCode/delete', async ({ id, user_id }, { rejectWithValue }) => {
  try {
    await axios.delete(`${apiUrl}/delete-pm-code/${id}`, {
      data: { user_id },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
  }
});

const PmCodeSlice = createSlice({
  name: 'pmcodes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetPmCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPmCode.fulfilled, (state, action) => {
        state.loading = false;
        state.pmcodedata = action.payload;
      })
      .addCase(GetPmCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(GetPmRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPmRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.pmrawmaterial = action.payload;
      })
      .addCase(GetPmRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addPmCode.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addPmCode.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updatePmCode.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updatePmCode.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deletePmCode.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deletePmCode.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default PmCodeSlice.reducer;
