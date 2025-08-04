import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  categorydata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetCategory = createAsyncThunk(
  "GetCategory /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-category`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addCategory = createAsyncThunk(
  "Category/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-category`,
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

  export const updateCategory = createAsyncThunk("Category/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-category/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteCategory = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteCategory/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-category/${id}`,{
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



const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categorydata = action.payload;
      })
      .addCase(GetCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addCategory.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CategorySlice.reducer;

