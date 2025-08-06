import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  StockMasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetStockMaster = createAsyncThunk(
  "GetStockMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-stock-master`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addStockMaster = createAsyncThunk(
  "StockMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-stock-master`,
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

 export const updateStockMaster = createAsyncThunk(
  "StockMaster/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-stock-master/${updatedUser?.id}`,
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

export const deleteStockMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteStockMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-stock-master/${id}`,{
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



const StockMasterSlice = createSlice({
  name: "stockmaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetStockMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetStockMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.StockMasterdata = action.payload;
      })
      .addCase(GetStockMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addStockMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addStockMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateStockMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateStockMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteStockMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteStockMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default StockMasterSlice.reducer;

