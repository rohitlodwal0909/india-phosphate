import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  MakeMasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetMakeMaster = createAsyncThunk(
  "GetMakeMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-make-master`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addMakeMaster = createAsyncThunk(
  "MakeMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-make-master`,
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

 export const updateMakeMaster = createAsyncThunk(
  "MakeMaster/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-make-master/${updatedUser?.id}`,
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

export const deleteMakeMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteMakeMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-make-master/${id}`,{
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



const MakeMasterSlice = createSlice({
  name: "makemaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetMakeMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMakeMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.MakeMasterdata = action.payload;
      })
      .addCase(GetMakeMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addMakeMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addMakeMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateMakeMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateMakeMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteMakeMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteMakeMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default MakeMasterSlice.reducer;

