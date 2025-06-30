import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'


// Initial state
const initialState = {
  loading: false,
  error: null,
  logindata: []
};
export const Authenticationmodule = createAsyncThunk(
  "authentication/authenticationmodule",
  async (formdata :any , { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, formdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Throw error data back to catch block
      return rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);

const AuthenticationSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Authenticationmodule.pending, (state) => {
        state.loading = true;
      })
      .addCase(Authenticationmodule.fulfilled, (state, action) => {
        state.loading = false;
       console.log(action.payload)
      })
      .addCase(Authenticationmodule.rejected, (state, action) => {
        state.loading = false;
    
        state.error = action.payload;
      });
  }
});

export default AuthenticationSlice.reducer;
