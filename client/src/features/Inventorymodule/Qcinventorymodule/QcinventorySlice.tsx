import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from '../../../constants/contant';

type QCState = {
  loading: boolean;
  error: string | null;
  qcdata: any;
  qcbatchdata:any;
  approveResult: any;
  rejectResult: any;
  holdResult: any;
  deleteResult: any;
  finalresult: any;
  rowmaterial:any;
};

const initialState: QCState = {
  loading: false,
  error: null,
  qcdata: [],
  qcbatchdata:[],
  approveResult: null,
  rejectResult: null,
  holdResult: null,
  deleteResult: null,
  finalresult: null,
  rowmaterial:[]
};

export const GetrawMaterial = createAsyncThunk<any, string, { rejectValue: any }>(
  'qcs/fetch',
  async (rm_code, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/raw-material/${rm_code}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const GetAllrowmaterial = createAsyncThunk< { rejectValue: any }>(
  'GetAllrowmaterial/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/all-raw-material`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const GetAllQcbatch = createAsyncThunk< { rejectValue: any }>(
  'GetAllQcbatch/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/all-qc-batch`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const Approvemodule = createAsyncThunk<any, { id: string; remarks: string }, { rejectValue: any }>(
  "qcs/approve",
  async (Approve, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/approvedOrRejected/${Approve.id}`, { status: "APPROVED", remark: Approve.remarks });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || "Server Error");
      } else if (error.request) {
        return rejectWithValue("No response from server");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const Rejectmodule = createAsyncThunk<any, { user: any; remark: string }, { rejectValue: any }>(
  "qcs/reject",
  async ({ user, remark }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/approvedOrRejected/${user.id}`, { status: "REJECTED", remark });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || "Server Error");
      } else if (error.request) {
        return rejectWithValue("No response from server");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const Holdmodule = createAsyncThunk<any, { user: any; remark: string }, { rejectValue: any }>(
  "qcs/hold",
  async ({ user, remark }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/approvedOrRejected/${user.id}`, { status: "HOLD", remark });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || "Server Error");
      } else if (error.request) {
        return rejectWithValue("No response from server");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const deleteQc = createAsyncThunk<string, string>("qcs/delete", async (QcId) => {
  await axios.delete(`${apiUrl}/endpoint`);
  return QcId;
});

export const RawMaterialResult = createAsyncThunk<any, any, { rejectValue: any }>(
  "RawMaterialResult/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/save-report-result`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || "Server Error");
      } else if (error.request) {
        return rejectWithValue("No response from server");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const qcBatchadd = createAsyncThunk<any, any, { rejectValue: any }>(
  "qcBatchadd/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/qc-batch-number`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || "Server Error");
      } else if (error.request) {
        return rejectWithValue("No response from server");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);


export const Getresult = createAsyncThunk<any, string, { rejectValue: any }>(
  'get/fetch',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/report/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const Deleteqcbatch = createAsyncThunk<any, string, { rejectValue: any }>(
  'Deleteqcbatch/fetch',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/qc-batch/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);



const QcinventorySlice = createSlice({
  name: "qcinventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetrawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetrawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.qcdata = action.payload;
      })
      .addCase(GetrawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
       .addCase(GetAllrowmaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
       })
      .addCase(GetAllrowmaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.rowmaterial = action.payload;
      })
      .addCase(GetAllrowmaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
        })
        .addCase(GetAllQcbatch.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
      .addCase(GetAllQcbatch.fulfilled, (state, action) => {
        state.loading = false;
        state.qcbatchdata = action.payload;
      })
      .addCase(GetAllQcbatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(Getresult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Getresult.fulfilled, (state, action) => {
        state.loading = false;
        state.finalresult = action.payload;
      })
      .addCase(Getresult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(Approvemodule.fulfilled, (state, action) => {
        state.approveResult = action.payload;
      })
      .addCase(Approvemodule.rejected, (state, action) => {
        state.error = action.error.message || null;
      })

      .addCase(Rejectmodule.fulfilled, (state, action) => {
        state.rejectResult = action.payload;
      })
      .addCase(Rejectmodule.rejected, (state, action) => {
        state.error = action.error.message || null;
      })

      .addCase(Holdmodule.fulfilled, (state, action) => {
        state.holdResult = action.payload;
      })
      .addCase(Holdmodule.rejected, (state, action) => {
        state.error = action.error.message || null;
      })

      .addCase(deleteQc.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteQc.rejected, (state, action) => {
        state.error = action.error.message || null;
      });
  },
});

export default QcinventorySlice.reducer;
