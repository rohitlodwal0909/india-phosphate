import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Formuladata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetFormula = createAsyncThunk(
  "GetFormula /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-formula`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addFormula = createAsyncThunk(
  "Formula/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-formula`,
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

export const updateFormula = createAsyncThunk(
  'Formula/update',
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-formula/${updatedUser?.id}`,
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
export const deleteFormula = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteFormula/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-formula/${id}`,{
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



const FormulaSlice = createSlice({
  name: "formula",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetFormula.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFormula.fulfilled, (state, action) => {
        state.loading = false;
        state.Formuladata = action.payload;
      })
      .addCase(GetFormula.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addFormula.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addFormula.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateFormula.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateFormula.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteFormula.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteFormula.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default FormulaSlice.reducer;

