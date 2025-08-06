import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  SalesMasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetSalesMaster = createAsyncThunk(
  "GetSalesMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-sales-master`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addSalesMaster = createAsyncThunk(
  "SalesMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-sales-master`,
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

 export const updateSalesMaster = createAsyncThunk(
  "SalesMaster/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-sales-master/${updatedUser?.id}`,
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

export const deleteSalesMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteSalesMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-sales-master/${id}`,{
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



const SalesMasterSlice = createSlice({
  name: "salesmasters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetSalesMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSalesMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.SalesMasterdata = action.payload;
      })
      .addCase(GetSalesMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addSalesMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addSalesMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateSalesMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateSalesMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteSalesMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteSalesMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default SalesMasterSlice.reducer;

