import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Companydata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetCompany = createAsyncThunk(
  "GetCompany /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-company`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addCompany = createAsyncThunk(
  "Company/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-company`,
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

 export const updateCompany = createAsyncThunk(
  "Company/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-company/${updatedUser?.id}`,
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

export const deleteCompany = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteCompany/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-company/${id}`,{
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



const CompanySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.Companydata = action.payload;
      })
      .addCase(GetCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addCompany.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CompanySlice.reducer;

