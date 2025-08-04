import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  staffmasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetStaffMaster = createAsyncThunk(
  "GetStaffMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-staff-master`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addStaffMaster = createAsyncThunk(
  "StaffMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-staff-master`,
        formdata,{
         headers: {
    'Content-Type': 'multipart/form-data',
  },
      });
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

export const updateStaffMaster = createAsyncThunk(
  "StaffMaster/update",
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-staff-master/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      // If the backend sent an error message, return that
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }

      // Otherwise return a generic error
      return rejectWithValue("Failed to update staff. Please try again.");
    }
  }
);
  

export const deleteStaffMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteStaffMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-staff-master/${id}`,{
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



const StaffMasterSlice = createSlice({
  name: "staffmaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetStaffMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetStaffMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.staffmasterdata = action.payload;
      })
      .addCase(GetStaffMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addStaffMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addStaffMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateStaffMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateStaffMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteStaffMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteStaffMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default StaffMasterSlice.reducer;

