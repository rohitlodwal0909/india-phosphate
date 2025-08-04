import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Qualificationdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetQualification = createAsyncThunk(
  "GetQualification /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-qualification`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addQualification = createAsyncThunk(
  "Qualification/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-qualification`,
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

  export const updateQualification = createAsyncThunk("Qualification/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-qualification/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteQualification = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteQualification/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-qualification/${id}`,{
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



const QualificationSlice = createSlice({
  name: "qualification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetQualification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetQualification.fulfilled, (state, action) => {
        state.loading = false;
        state.Qualificationdata = action.payload;
      })
      .addCase(GetQualification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addQualification.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addQualification.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateQualification.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateQualification.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteQualification.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteQualification.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default QualificationSlice.reducer;

