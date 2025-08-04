import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  rmcodedata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetRmCode = createAsyncThunk(
  "GetRmCode /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-rm-code`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addRmCode = createAsyncThunk(
  "RmCode/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-rm-code`,
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

export const addrawmaterial = createAsyncThunk(
  "RmCode/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-row-material`,
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

  export const updateRmCode = createAsyncThunk("RmCode/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-rm-code/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteRmCode = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteRmCode/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-rm-code/${id}`,{
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



const RmCodeSlice = createSlice({
  name: "rmcodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetRmCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetRmCode.fulfilled, (state, action) => {
        state.loading = false;
        state.rmcodedata = action.payload;
      })
      .addCase(GetRmCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addRmCode.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addRmCode.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateRmCode.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateRmCode.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteRmCode.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteRmCode.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default RmCodeSlice.reducer;

