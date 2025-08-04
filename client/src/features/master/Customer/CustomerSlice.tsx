import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  customerdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetCustomer = createAsyncThunk(
  "GetCustomer /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-customer`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addCustomer = createAsyncThunk(
  "Customer/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-customer`,
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

  export const updateCustomer = createAsyncThunk("Customer/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-customer/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteCustomer = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteCustomer/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-customer/${id}`,{
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



const CustomerSlice = createSlice({
  name: "Customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerdata = action.payload;
      })
      .addCase(GetCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CustomerSlice.reducer;

