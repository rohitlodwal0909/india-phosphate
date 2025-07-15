import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl }from '../../../constants/contant.tsx'

const initialState = {
  loading: false,
  error: null,
  productiondata: [], 
  qcproduction:[],        
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetFetchProduction = createAsyncThunk(
  "GetFetchProduction/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/all-production`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Something went wrong while fetching check-ins.';
      return rejectWithValue(message);
    }
  }
);
export const GetFetchQcProduction = createAsyncThunk(
  "GetFetchQcProduction/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/qc-allproduction`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Something went wrong while fetching check-ins.';
      return rejectWithValue(message);
    }
  }
);


export const addProduction= createAsyncThunk(
  "addProduction/add",
  async (newCheckin:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/add-Production`, newCheckin);
      return response.data;
    } catch (error) {
      // Optional: Log for debugging
      console.error("Add checkin error:", error);

      // Try to extract a message from the server
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error occurred';

      return rejectWithValue(message);
    }
  }
);

export const addFinishingEntry= createAsyncThunk(
  "addFinishingEntry/add",
  async (newCheckin:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/add-finishing-entry`, newCheckin);
      return response.data;
    } catch (error) {
      // Optional: Log for debugging
      console.error("Add checkin error:", error);

      // Try to extract a message from the server
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error occurred';

      return rejectWithValue(message);
    }
  }
);

export const updateFinishentry = createAsyncThunk(
  "updateFinishentry/update",
  async (updatedCheckin: any, { rejectWithValue }) => {
    
    try {
      const response = await axios.put(
        `${apiUrl}/update-finishing-entry/${updatedCheckin.batch_number}`,
        updatedCheckin
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update checkin."
      );
    }
  }
);

export const deleteDispatch = createAsyncThunk(
  "Dispatch/delete",
  async (checkinId: any, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-dispatch/${checkinId}`);
      return checkinId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete checkin."
      );
    }
  }
);



const ProdutionSlice = createSlice({
  name: "checkininventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(GetFetchProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFetchProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.productiondata = action.payload;
      })
      .addCase(GetFetchProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    .addCase(GetFetchQcProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFetchQcProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.qcproduction = action.payload;
      })
      .addCase(GetFetchQcProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD checkin
      .addCase(addProduction.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addProduction.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE checkin
      .addCase(updateFinishentry.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateFinishentry.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // DELETE checkin
      .addCase(deleteDispatch.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDispatch.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ProdutionSlice.reducer;

