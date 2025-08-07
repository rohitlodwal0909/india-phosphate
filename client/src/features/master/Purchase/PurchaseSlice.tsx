import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Purchasedata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetPurchase = createAsyncThunk(
  "GetPurchase /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-purchase`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addPurchase = createAsyncThunk(
  "Purchase/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-purchase`,
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

 export const updatePurchase = createAsyncThunk(
  "Purchase/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-purchase/${updatedUser?.id}`,
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

export const deletePurchase = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deletePurchase/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-purchase/${id}`,{
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



const PurchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.Purchasedata = action.payload;
      })
      .addCase(GetPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addPurchase.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default PurchaseSlice.reducer;

