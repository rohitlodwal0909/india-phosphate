import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  DepartmentMasterdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetDepartmentMaster = createAsyncThunk(
  "GetDepartmentMaster /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-department-master`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addDepartmentMaster = createAsyncThunk(
  "DepartmentMaster/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-department-master`,
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

 export const updateDepartmentMaster = createAsyncThunk(
  "DepartmentMaster/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-department-master/${updatedUser?.id}`,
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

export const deleteDepartmentMaster = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteDepartmentMaster/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-department-master/${id}`,{
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



const DepartmentMasterSlice = createSlice({
  name: "departmentmaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetDepartmentMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDepartmentMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.DepartmentMasterdata = action.payload;
      })
      .addCase(GetDepartmentMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addDepartmentMaster.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDepartmentMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateDepartmentMaster.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDepartmentMaster.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteDepartmentMaster.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDepartmentMaster.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default DepartmentMasterSlice.reducer;

