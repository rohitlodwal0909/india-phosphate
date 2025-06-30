import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl }from '../../../constants/contant.tsx'

const initialState = {
  loading: false,
  error: null,
  dispatchdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetFetchDispatch = createAsyncThunk(
  "Dispatch/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/all-dispatch`);
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



export const addDispatch= createAsyncThunk(
  "Dispatch/add",
  async (newCheckin:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/add-dispatch`, newCheckin);
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

export const updateDispatch = createAsyncThunk(
  "Dispatch/update",
  async (updatedCheckin: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-dispatch/${updatedCheckin.id}`,
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



const DispatchSlice = createSlice({
  name: "checkininventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(GetFetchDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFetchDispatch.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatchdata = action.payload;
      })
      .addCase(GetFetchDispatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD checkin
      .addCase(addDispatch.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDispatch.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE checkin
      .addCase(updateDispatch.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDispatch.rejected, (state, action) => {
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

export default DispatchSlice.reducer;

