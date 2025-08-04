import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  PackingMaterialdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetPackingMaterial = createAsyncThunk(
  "GetPackingMaterial /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-packing-material`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addPackingMaterial = createAsyncThunk(
  "PackingMaterial/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-packing-material`,
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

 export const updatePackingMaterial = createAsyncThunk(
  "PackingMaterial/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-packing-material/${updatedUser?.id}`,
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

export const deletePackingMaterial = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deletePackingMaterial/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-packing-material/${id}`,{
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



const PackingMaterialSlice = createSlice({
  name: "packingmaterial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetPackingMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPackingMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.PackingMaterialdata = action.payload;
      })
      .addCase(GetPackingMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addPackingMaterial.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addPackingMaterial.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updatePackingMaterial.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updatePackingMaterial.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deletePackingMaterial.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deletePackingMaterial.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default PackingMaterialSlice.reducer;

