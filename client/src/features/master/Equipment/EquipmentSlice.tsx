import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Equipmentdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetEquipment = createAsyncThunk(
  "GetEquipment /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-equipment`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addEquipment = createAsyncThunk(
  "Equipment/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-equipment`,
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

 export const updateEquipment = createAsyncThunk(
  "Equipment/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-equipment/${updatedUser?.id}`,
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

export const deleteEquipment = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteEquipment/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-equipment/${id}`,{
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



const EquipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.Equipmentdata = action.payload;
      })
      .addCase(GetEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addEquipment.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addEquipment.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateEquipment.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteEquipment.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default EquipmentSlice.reducer;

