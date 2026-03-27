import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  draftPackingLists: [],
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

/* ======================================================
   CREATE DRAFT PACKING LIST
====================================================== */
export const createDraftPackingList = createAsyncThunk<any, FormData>(
  'draftPackingList/create',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/upload-draft-packing-list`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Draft Packing List upload failed',
      );
    }
  },
);

/* ======================================================
   GET DRAFT PACKING LIST
====================================================== */
export const getDraftPackingList = createAsyncThunk<any>(
  'draftPackingList/get',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-draft-packing-list`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch Draft Packing List',
      );
    }
  },
);

export const downloadDraftPackingList = createAsyncThunk<any, number>(
  'draft/download',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/download-draft-packing-list/${id}`, {
        responseType: 'blob', // ✅ VERY IMPORTANT
      });

      // create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DraftPackingList.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.remove();

      return true;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Download failed');
    }
  },
);
/* ======================================================
   UPDATE DRAFT PACKING LIST
====================================================== */
export const updateDraftPackingList = createAsyncThunk<any, { id: number; data: FormData }>(
  'draftPackingList/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-draft-packing-list/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

/* ======================================================
   DELETE DRAFT PACKING LIST
====================================================== */
export const deleteDraftPackingList = createAsyncThunk<any, number>(
  'draftPackingList/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-draft-packing-list/${id}`);

      return { id, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

/* ======================================================
   SLICE
====================================================== */

const DraftPackingListSlice = createSlice({
  name: 'draftPackingList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= CREATE ================= */
      .addCase(createDraftPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDraftPackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = action.payload;

        // auto add to list
        state.draftPackingLists.unshift(action.payload);
      })
      .addCase(createDraftPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(downloadDraftPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadDraftPackingList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadDraftPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET ================= */
      .addCase(getDraftPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDraftPackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.draftPackingLists = action.payload;
      })
      .addCase(getDraftPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updateDraftPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDraftPackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = action.payload;

        const index = state.draftPackingLists.findIndex(
          (item: any) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.draftPackingLists[index] = action.payload;
        }
      })
      .addCase(updateDraftPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteDraftPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDraftPackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;

        state.draftPackingLists = state.draftPackingLists.filter(
          (item: any) => item.id !== action.payload.id,
        );
      })
      .addCase(deleteDraftPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default DraftPackingListSlice.reducer;
