import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Inwarddata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetInward = createAsyncThunk(
  "GetInward /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-inward`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addInward = createAsyncThunk(
  "Inward/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-inward`,
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

  export const updateInward = createAsyncThunk("Inward/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-inward/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteInward = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteInward/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-inward/${id}`,{
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



const InwardSlice = createSlice({
  name: "inward",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetInward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetInward.fulfilled, (state, action) => {
        state.loading = false;
        state.Inwarddata = action.payload;
      })
      .addCase(GetInward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addInward.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addInward.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateInward.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateInward.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteInward.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteInward.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default InwardSlice.reducer;

