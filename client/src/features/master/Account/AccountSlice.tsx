import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Accountdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetAccount= createAsyncThunk(
  "GetAccount /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-account`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addAccount = createAsyncThunk(
  "Account/add",
  async (formdata:any, { rejectWithValue }) => {

  
    try {
      const response = await axios.post(`${apiUrl}/store-account`,
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

  export const updateAccount = createAsyncThunk("Account/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-account/${updatedUser?.account_id}`,
    updatedUser
  );
  return response.data;
});

export const deleteAccount = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteAccount/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-account/${id}`,{
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



const AccountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.Accountdata = action.payload;
      })
      .addCase(GetAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addAccount.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default AccountSlice.reducer;

