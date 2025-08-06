import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  BatchMasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetBatchMaster = createAsyncThunk(
  "GetBatchMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-batch-master`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addBatchMaster = createAsyncThunk(
  "BatchMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-batch-master`,
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

 export const updateBatchMaster = createAsyncThunk(
  "BatchMaster/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-batch-master/${updatedUser?.id}`,
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

export const deleteBatchMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteBatchMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-batch-master/${id}`,{
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



const BatchMasterSlice = createSlice({
  name: "batchmaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetBatchMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetBatchMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.BatchMasterdata = action.payload;
      })
      .addCase(GetBatchMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addBatchMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addBatchMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateBatchMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateBatchMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteBatchMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteBatchMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default BatchMasterSlice.reducer;

