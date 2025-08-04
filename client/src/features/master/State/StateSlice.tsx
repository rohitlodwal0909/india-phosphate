import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Statedata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetState = createAsyncThunk(
  "GetState /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-state`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addState = createAsyncThunk(
  "State/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-state`,
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

  export const updateState = createAsyncThunk("State/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-state/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteState = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteState/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-state/${id}`,{
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



const StateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetState.fulfilled, (state, action) => {
        state.loading = false;
        state.Statedata = action.payload;
      })
      .addCase(GetState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addState.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addState.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateState.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateState.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteState.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default StateSlice.reducer;

