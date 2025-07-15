import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'


// Initial state
const initialState = {
  loading: false,
  error: null,
  logindata: []
};

export const GetAuthenticationmodule = createAsyncThunk(
  "GetAuthenticationmodule/authenticationmodule",
  async (userid:any, { rejectWithValue }) => {
    
    try {
      const response = await axios.get(`${apiUrl}/get-profile/${userid}`, {
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

export const AuthenticationUpdatemodule = createAsyncThunk(
  "AuthenticationUpdatemodule/authentication",
  async (formdata:any, { rejectWithValue }) => {
     const stored = JSON.parse(localStorage.getItem('logincheck'))
    try {
      const response = await axios.put(`${apiUrl}/update-profile/${stored?.admin?.id}`, formdata, {
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
)

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
      })
       .addCase(GetAuthenticationmodule.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAuthenticationmodule.fulfilled, (state, action) => {
        state.loading = false;
        state.logindata = action.payload
      })
      .addCase(GetAuthenticationmodule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default AuthenticationSlice.reducer;
