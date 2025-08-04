import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  userdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetUsermodule = createAsyncThunk("users/fetch", async () => {
  const response = await axios.get( `${apiUrl}/user/all`);
  return response.data;
});


export const addUser = createAsyncThunk(
  "users/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/register`,
        formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

export const updateUser = createAsyncThunk("users/update", async (updatedUser:any, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${apiUrl}/update-profile/${updatedUser?.user_id}`, updatedUser, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: "Update failed" });
  }
});

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/user/delete/${userId}`);
      return userId; // success
    } catch (error: any) {
      // If the error has a response from server
      if (error.response && error.response.data) {
        // return the error message from server response
        return rejectWithValue(error.response.data.message || "Failed to delete user");
      } else {
        // generic error message
        return rejectWithValue(error.message || "Failed to delete user");
      }
    }
  }
);



const UsermanagmentSlice = createSlice({
  name: "usermanagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetUsermodule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUsermodule.fulfilled, (state, action) => {
        state.loading = false;
        state.userdata = action.payload;
      })
      .addCase(GetUsermodule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addUser.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default UsermanagmentSlice.reducer;

