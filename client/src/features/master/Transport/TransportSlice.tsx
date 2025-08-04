import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Transportdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetTransport= createAsyncThunk(
  "GetTransport /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-transport`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addTransport = createAsyncThunk(
  "Transport/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-transport`,
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

 
export const updateTransport = createAsyncThunk(
  "Transport/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-transport/${updatedUser?.id}`,
        updatedUser
      );
      return response.data;
    } catch (error: any) {
      // Check if the error is an axios error with a response
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Update failed");
      } else {
        return rejectWithValue(error.message || "Network error");
      }
    }
  }
);

export const deleteTransport = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteTransport/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-transport/${id}`,{
      data: { user_id }
    });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete checkin."
      );
    }
  }
);



const TransportSlice = createSlice({
  name: "transport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetTransport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetTransport.fulfilled, (state, action) => {
        state.loading = false;
        state.Transportdata = action.payload;
      })
      .addCase(GetTransport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addTransport.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addTransport.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateTransport.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateTransport.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteTransport.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteTransport.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default TransportSlice.reducer;

