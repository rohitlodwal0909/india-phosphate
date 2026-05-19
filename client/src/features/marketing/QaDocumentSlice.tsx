import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  qadocuments: [],
  addResult: null,
  updateResult: null,
  deleteResult: null,
};

export const getQaDocument = createAsyncThunk('qa-documents/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-qa-documents`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch qa-documents.';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addQaDocument = createAsyncThunk(
  'qa-documents/add',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-qa-documents`, formdata);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateQaDocument = createAsyncThunk(
  'qa-documents/update',
  async ({ id, data }: any) => {
    const response = await axiosInstance.put(`/update-qa-documents/${id}`, data);

    return response.data;
  },
);

export const deleteQaDocument = createAsyncThunk<any, number, { rejectValue: any }>(
  'qa-documents/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete-qa-documents/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete qa-documents.');
    }
  },
);

const QaDocumentSlice = createSlice({
  name: 'qadocuments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getQaDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQaDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.qadocuments = action.payload;
      })

      .addCase(getQaDocument.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addQaDocument.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addQaDocument.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateQaDocument.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateQaDocument.rejected, (state, action: any) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteQaDocument.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteQaDocument.rejected, (state, action: any) => {
        state.error = action.payload;
      });
  },
});

export default QaDocumentSlice.reducer;
