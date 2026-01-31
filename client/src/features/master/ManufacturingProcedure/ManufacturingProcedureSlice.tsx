import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiUrl } from '../../../constants/contant';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  data: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const GetProcedure = createAsyncThunk('GetProcedure /fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/get-procedure`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user modules.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addProcedure = createAsyncThunk(
  'Proceduredata/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${apiUrl}/create-procedure`, formdata);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateProcedure = createAsyncThunk(
  'Proceduredata/update',
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${apiUrl}/update-procedure/${updatedUser?.id}`,
        updatedUser,
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // custom error message from backend
      } else {
        return rejectWithValue({ message: 'Something went wrong' }); // fallback error
      }
    }
  },
);

export const deleteProcedure = createAsyncThunk<any, { id: string }, { rejectValue: any }>(
  'deleteProcedure/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/delete-procedure/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete checkin.');
    }
  },
);

const ProcedureSlice = createSlice({
  name: 'procedure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetProcedure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetProcedure.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(GetProcedure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addProcedure.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addProcedure.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateProcedure.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateProcedure.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteProcedure.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteProcedure.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ProcedureSlice.reducer;
