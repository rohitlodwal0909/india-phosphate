import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  unitdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetUnit = createAsyncThunk(
  "GetUnit /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-unit`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addUnit = createAsyncThunk(
  "Unit/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-unit`,
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

  export const updateUnit = createAsyncThunk("Unit/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-unit/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteUnit = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteUnit/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-unit/${id}`,{
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



const UnitSlice = createSlice({
  name: "Unit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.unitdata = action.payload;
      })
      .addCase(GetUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addUnit.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addUnit.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default UnitSlice.reducer;

