import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  HsnMasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetHsnMaster = createAsyncThunk(
  "GetHsnMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-hsn`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addHsnMaster = createAsyncThunk(
  "HsnMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-hsn`,
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

 export const updateHsnMaster = createAsyncThunk(
  "HsnMaster/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-hsn/${updatedUser?.id}`,
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

export const deleteHsnMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteHsnMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-hsn/${id}`,{
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



const HsnMasterSlice = createSlice({
  name: "hsnmasters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetHsnMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetHsnMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.HsnMasterdata = action.payload;
      })
      .addCase(GetHsnMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addHsnMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addHsnMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateHsnMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateHsnMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteHsnMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteHsnMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default HsnMasterSlice.reducer;

