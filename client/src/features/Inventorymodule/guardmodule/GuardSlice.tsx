import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl }from '../../../constants/contant.tsx'

const initialState = {
  loading: false,
  error: null,
  checkindata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetCheckinmodule = createAsyncThunk(
  "checkins/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/guard-entries`);
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



export const addCheckin = createAsyncThunk(
  "checkins/add",
  async (newCheckin:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/guard-entries`, newCheckin);
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

export const updateCheckin = createAsyncThunk(
  "checkins/update",
  async (updatedCheckin: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/guard-entries/${updatedCheckin.id}`,
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

export const deleteCheckin = createAsyncThunk(
  "checkins/delete",
  async (checkinId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/guard-entries/${checkinId}`);
      return checkinId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete checkin."
      );
    }
  }
);



const CheckinSlice = createSlice({
  name: "checkininventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET checkin
      .addCase(GetCheckinmodule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCheckinmodule.fulfilled, (state, action) => {
        state.loading = false;
        state.checkindata = action.payload;
      })
      .addCase(GetCheckinmodule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD checkin
      .addCase(addCheckin.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCheckin.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE checkin
      .addCase(updateCheckin.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCheckin.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE checkin
      .addCase(deleteCheckin.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCheckin.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CheckinSlice.reducer;

