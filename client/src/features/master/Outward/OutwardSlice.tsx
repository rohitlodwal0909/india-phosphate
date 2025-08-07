import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Outwarddata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetOutward = createAsyncThunk(
  "GetOutward /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-outward`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addOutward = createAsyncThunk(
  "Outward/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-outward`,
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

 export const updateOutward = createAsyncThunk(
  "Outward/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-outward/${updatedUser?.id}`,
        updatedUser
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // custom error message from backend
      } else {
        return rejectWithValue({ message: "Something went wrong" }); // fallback error
      }
    }
  }
);

export const deleteOutward = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteOutward/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-outward/${id}`,{
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



const OutwardSlice = createSlice({
  name: "outward",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetOutward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetOutward.fulfilled, (state, action) => {
        state.loading = false;
        state.Outwarddata = action.payload;
      })
      .addCase(GetOutward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addOutward.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addOutward.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateOutward.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateOutward.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteOutward.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteOutward.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default OutwardSlice.reducer;

