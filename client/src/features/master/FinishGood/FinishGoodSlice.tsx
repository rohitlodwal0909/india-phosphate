import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  FinishGooddata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetFinishGood = createAsyncThunk(
  "GetFinishGood /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-finish-good`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addFinishGood = createAsyncThunk(
  "FinishGood/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-finish-good`,
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

export const updateFinishGood = createAsyncThunk(
  'FinishGood/update',
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-finish-good/${updatedUser?.id}`,
        updatedUser
      );
      return response.data;
    } catch (error: any) {
      // Handle server or validation error
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // API responded with error message
      } else {
        return rejectWithValue({ message: 'Something went wrong. Please try again.' });
      }
    }
  }
);
export const deleteFinishGood = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteFinishGood/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-finish-good/${id}`,{
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



const FinishGoodSlice = createSlice({
  name: "finishgood",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetFinishGood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFinishGood.fulfilled, (state, action) => {
        state.loading = false;
        state.FinishGooddata = action.payload;
      })
      .addCase(GetFinishGood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addFinishGood.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addFinishGood.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateFinishGood.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateFinishGood.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteFinishGood.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteFinishGood.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default FinishGoodSlice.reducer;

