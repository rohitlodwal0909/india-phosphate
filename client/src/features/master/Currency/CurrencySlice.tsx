import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  Currencydata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetCurrency = createAsyncThunk(
  "GetCurrency /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-currency`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addCurrency = createAsyncThunk(
  "Currency/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-currency`,
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

 export const updateCurrency = createAsyncThunk(
  "Currency/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-currency/${updatedUser?.id}`,
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

export const deleteCurrency = createAsyncThunk<any, {id:string,user_id:any}, { rejectValue: any }>(
  "deleteCurrency/delete",
  async ({id,user_id}, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-currency/${id}`,{
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



const CurrencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.Currencydata = action.payload;
      })
      .addCase(GetCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addCurrency.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCurrency.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CurrencySlice.reducer;

