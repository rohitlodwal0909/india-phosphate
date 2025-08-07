import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  BmrMasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetBmrMaster = createAsyncThunk(
  "GetBmrMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-bmr`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addBmrMaster = createAsyncThunk(
  "BmrMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-bmr`,
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

 export const updateBmrMaster = createAsyncThunk(
  "BmrMaster/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-bmr/${updatedUser?.id}`,
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

export const deleteBmrMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteBmrMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-bmr/${id}`,{
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



const BmrMasterSlice = createSlice({
  name: "bmrmaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetBmrMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetBmrMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.BmrMasterdata = action.payload;
      })
      .addCase(GetBmrMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addBmrMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addBmrMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateBmrMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateBmrMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteBmrMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteBmrMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default BmrMasterSlice.reducer;

