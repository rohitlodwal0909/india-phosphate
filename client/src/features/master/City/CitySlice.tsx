import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Citydata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetCity= createAsyncThunk(
  "GetCity /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-city`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addCity = createAsyncThunk(
  "City/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-city`,
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

  export const updateCity = createAsyncThunk("City/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-city/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteCity = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteCity/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-city/${id}`,{
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



const CitySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCity.fulfilled, (state, action) => {
        state.loading = false;
        state.Citydata = action.payload;
      })
      .addCase(GetCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addCity.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCity.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateCity.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CitySlice.reducer;

