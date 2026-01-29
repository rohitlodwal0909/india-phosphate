import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../constants/contant';

// Initial state
const initialState = {
  loading: false,
  error: null,
  logindata: [],
  logdata: [],
};

export const GetAuthenticationmodule = createAsyncThunk(
  'GetAuthenticationmodule/authenticationmodule',
  async (userid: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/get-profile/${userid}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      // Throw error data back to catch block
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  },
);

export const Authenticationmodule = createAsyncThunk(
  'authentication/authenticationmodule',
  async (formdata: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, formdata, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      // Throw error data back to catch block
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  },
);

export const AuthenticationUpdatemodule = createAsyncThunk(
  'AuthenticationUpdatemodule/authentication',
  async (formdata: any, { rejectWithValue }) => {
    const stored = JSON.parse(localStorage.getItem('logincheck'));
    try {
      const response = await axios.put(`${apiUrl}/update-profile/${stored?.admin?.id}`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Throw error data back to catch block
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  },
);

export const Changepassword = createAsyncThunk(
  'Changepassword/authentication',
  async (formdata: any, { rejectWithValue }) => {
    const stored = JSON.parse(localStorage.getItem('logincheck'));
    try {
      const response = await axios.put(
        `${apiUrl}/change-password/${stored?.admin?.id || formdata?.user_id}`,
        formdata,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      // Throw error data back to catch block
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  },
);

export const GetallLogs = createAsyncThunk('GetallLogs/fetch', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${apiUrl}/get-log`);
    return response.data;
  } catch (error) {
    // error.response?.data ya error.message ko rejectWithValue karo
    return thunkAPI.rejectWithValue(
      error.response?.data || error.message || 'Something went wrong',
    );
  }
});

export const forgotpassword = createAsyncThunk(
  'forgotpassword/fetch',
  async (email: any, thunkAPI) => {
    try {
      const response = await axios.post(`${apiUrl}/forgot-password`, { email: email });
      return response.data;
    } catch (error) {
      // error.response?.data ya error.message ko rejectWithValue karo
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || 'Something went wrong',
      );
    }
  },
);

const AuthenticationSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Authenticationmodule.pending, (state) => {
        state.loading = true;
      })
      .addCase(Authenticationmodule.fulfilled, (state, action) => {
        state.loading = false;
        state.logindata = action.payload;
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
        state.logindata = action.payload;
      })
      .addCase(GetAuthenticationmodule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetallLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetallLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logdata = action.payload;
      })
      .addCase(GetallLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default AuthenticationSlice.reducer;
