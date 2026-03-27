import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

const initialState = {
  loading: false,
  error: null,
  lists: [],
  upload: null,
  update: null,
  deleteResult: null,
};

// ✅ UPLOAD (CREATE)
export const createPackingList = createAsyncThunk<any, FormData>(
  'invoice/upload',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/upload-packing-list`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  },
);

export const downloadPackingList = createAsyncThunk<any, number>(
  'packinglist/download',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/download-packing-list/${id}`, {
        responseType: 'blob', // ✅ VERY IMPORTANT
      });

      // create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PackingList.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.remove();

      return true;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Download failed');
    }
  },
);

// ✅ GET
export const getPackingList = createAsyncThunk<any>('invoice/get', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/get-export-packing-list`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice.');
  }
});

// ✅ UPDATE
export const updatePackingList = createAsyncThunk<any, { id: number; data: FormData }>(
  'invoice/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-export-packing-list/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  },
);

// ✅ DELETE
export const deletePackingList = createAsyncThunk<any, number>(
  'invoice/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-export-packing-list/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  },
);

const PackingListSlice = createSlice({
  name: 'exportpackinglists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ================= UPLOAD =================
      .addCase(createPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.upload = action.payload;

        // 👉 auto add in list (no refetch needed)
        state.lists.unshift(action.payload);
      })
      .addCase(createPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(downloadPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadPackingList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET =================
      .addCase(getPackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(getPackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updatePackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;

        // 👉 update list without reload
        const index = state.lists.findIndex((item: any) => item.id === action.payload.id);

        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(updatePackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deletePackingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePackingList.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = action.payload;

        // 👉 remove from list instantly
        state.lists = state.lists.filter((item: any) => item.id !== action.payload.id);
      })
      .addCase(deletePackingList.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PackingListSlice.reducer;
