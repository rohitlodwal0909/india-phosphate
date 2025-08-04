import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl }from '../../../constants/contant.tsx'


const initialState = {
  loading: false,
  error: null,
  storedata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetStoremodule = createAsyncThunk(
  "stores/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/grn-entries`);
      return response.data;
    } catch (error) {
      // error.response?.data ya error.message ko rejectWithValue karo
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

export const addStore = createAsyncThunk(
  "stores/add",
  async (newStore:any, thunkAPI) => {
    try {
      console.log(newStore);
      const response = await axios.post(`${apiUrl}/grn-entries`, newStore);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);


export const ShowStore = createAsyncThunk(
  "stores/update",
  async (ShowStore, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/grn-entries/${ShowStore}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

export const deleteStore = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "stores/delete",
  async ({id , user_id}, thunkAPI) => {
    try {
      await axios.delete(`${apiUrl}/grn-entries/${id}`, {
  data: { user_id }
});
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

const StoreInventorySlice = createSlice({
  name: "storeinventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET store
      .addCase(GetStoremodule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetStoremodule.fulfilled, (state, action) => {
        state.loading = false;
        state.storedata = action.payload;
      })
      .addCase(GetStoremodule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD store
      .addCase(addStore.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addStore.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE store
      .addCase(ShowStore.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(ShowStore.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE Store
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default StoreInventorySlice.reducer;

