import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import  { apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  notificationData: [],         
  addResult: null,  
};

export const GetNotification = createAsyncThunk(
  "GetNotification/fetch",
  async (user_id, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-all-notification/${user_id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch leads.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const ReadNotification = createAsyncThunk(
  "ReadNotifications/add",
  async (id:any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/read-notification/${id}`,
       );
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);



const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationData = action.payload;
      })
      .addCase(GetNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(ReadNotification.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(ReadNotification.rejected, (state, action) => {
        state.error = action.error.message;
      })

  },
});

export default NotificationSlice.reducer;

