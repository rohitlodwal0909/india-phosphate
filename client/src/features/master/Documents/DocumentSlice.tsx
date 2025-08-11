import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Documentdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetDocument = createAsyncThunk(
  "GetDocument /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-document`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addDocument = createAsyncThunk(
  "Document/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-document`,
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

export const updateDocument = createAsyncThunk(
  'Document/update',
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-document/${updatedUser?.id}`,
        updatedUser,{
         headers: {
    'Content-Type': 'multipart/form-data',
  },
      }
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
export const deleteDocument = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteDocument/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-document/${id}`,{
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



const DocumentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.Documentdata = action.payload;
      })
      .addCase(GetDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addDocument.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDocument.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default DocumentSlice.reducer;

