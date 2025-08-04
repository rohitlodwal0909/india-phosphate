import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Designationdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetDesignation = createAsyncThunk(
  "GetDesignation /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-designation`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addDesignation = createAsyncThunk(
  "Designation/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-designation`,
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

  export const updateDesignation = createAsyncThunk("Designation/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-designation/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteDesignation = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteDesignation/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-designation/${id}`,{
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



const DesignationSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetDesignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.Designationdata = action.payload;
      })
      .addCase(GetDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addDesignation.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default DesignationSlice.reducer;

