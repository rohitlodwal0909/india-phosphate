import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

// --------------------
// State Types
// --------------------
type QCState = {
  loading: boolean;
  error: string | null;
  qcdata: any;
  qcbatchdata: any;
  productSpecification: any;
  approveResult: any;
  rejectResult: any;
  holdResult: any;
  deleteResult: any;
  createReport: any;
  finalresult: any;
  rowmaterial: any;
  qcReport: any;
};

const initialState: QCState = {
  loading: false,
  error: null,
  qcdata: [],
  qcbatchdata: [],
  productSpecification: [],
  approveResult: null,
  rejectResult: null,
  holdResult: null,
  deleteResult: null,
  finalresult: null,
  createReport: null,
  rowmaterial: [],
  qcReport: [],
};

interface GetRawMaterialPayload {
  id: string;
  status: string;
  qc_id: number | string;
}
// --------------------
// Thunks
// --------------------

export const GetrawMaterial = createAsyncThunk<any, GetRawMaterialPayload, { rejectValue: any }>(
  'qcs/fetch',
  async ({ id, qc_id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/raw-material/${id}/${qc_id}/${status}`);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue(error.message);
    }
  },
);

export const GetAllrowmaterial = createAsyncThunk<any, void, { rejectValue: any }>(
  'GetAllrowmaterial/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/all-raw-material`);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue(error.message);
    }
  },
);

export const GetAllQcbatch = createAsyncThunk<any, void, { rejectValue: any }>(
  'GetAllQcbatch/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/all-qc-batch`);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue(error.message);
    }
  },
);

export const Approvemodule = createAsyncThunk<
  any,
  { id: string; remark: string; user_id: any },
  { rejectValue: any }
>('qcs/approve', async ({ id, remark, user_id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/approvedOrRejected/${id}`, {
      status: 'APPROVED',
      remark,
      user_id,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
    if (error.request) return rejectWithValue('No response from server');
    return rejectWithValue('An unexpected error occurred');
  }
});

export const getProductandSpecification = createAsyncThunk<string, string, { rejectValue: any }>(
  'qcs/productdata',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/get-product-and-specification/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue(error.message);
    }
  },
);

export const createQcReport = createAsyncThunk<any, any, { rejectValue: any }>(
  'result/createQcReport',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/create-qcReport`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const Rejectmodule = createAsyncThunk<
  any,
  { id: string; remark: string; user_id: any },
  { rejectValue: any }
>('qcs/reject', async ({ id, remark, user_id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/approvedOrRejected/${id}`, {
      status: 'REJECTED',
      remark,
      user_id,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
    if (error.request) return rejectWithValue('No response from server');
    return rejectWithValue('An unexpected error occurred');
  }
});

export const Holdmodule = createAsyncThunk<
  any,
  { id: string; remark: string; user_id: any },
  { rejectValue: any }
>('qcs/hold', async ({ id, remark, user_id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/approvedOrRejected/${id}`, {
      status: 'HOLD',
      remark,
      user_id,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
    if (error.request) return rejectWithValue('No response from server');
    return rejectWithValue('An unexpected error occurred');
  }
});

export const deleteQc = createAsyncThunk<string, string, { rejectValue: any }>(
  'qcs/delete',
  async (QcId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/qc/${QcId}`);
      return QcId;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue(error.message);
    }
  },
);

export const RawMaterialResult = createAsyncThunk<any, any, { rejectValue: any }>(
  'RawMaterialResult/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/save-report-result`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const qcBatchadd = createAsyncThunk<any, any, { rejectValue: any }>(
  'qcBatchadd/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/qc-batch-number`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const qcBatchUpdate = createAsyncThunk<any, any, { rejectValue: any }>(
  'qcBatchupdate/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/qc-batch-update`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const batchStatusChange = createAsyncThunk<any, string, { rejectValue: any }>(
  'batchStatus/change',
  async (id, { rejectWithValue }) => {
    try {
      // If backend expects PUT/PATCH, replace axiosInstance.get with axios.put
      const response = await axiosInstance.get(`/qc-batch-status/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const addRefrenceNumber = createAsyncThunk<any, any, { rejectValue: any }>(
  'refrensenumber/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/qc-add-refrensenumber`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data?.message || 'Server Error');
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const Getresult = createAsyncThunk<any, string, { rejectValue: any }>(
  'get/fetch',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/report/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue(error.message);
    }
  },
);

export const getQcreport = createAsyncThunk<any, string, { rejectValue: any }>(
  'get/qcreport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/get-qc-report/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      if (error.request) return rejectWithValue('No response from server');
      return rejectWithValue(error.message);
    }
  },
);

export const Deleteqcbatch = createAsyncThunk<
  any,
  { id: string; user_id: any },
  { rejectValue: any }
>('Deleteqcbatch/fetch', async ({ id, user_id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/qc-batch/${id}`, {
      data: { user_id },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) return rejectWithValue(error.response.data);
    if (error.request) return rejectWithValue('No response from server');
    return rejectWithValue(error.message);
  }
});

// --------------------
// Slice
// --------------------
const QcinventorySlice = createSlice({
  name: 'qcinventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Raw Material
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
        state.error = action.payload || action.error.message || null;
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
        state.error = action.payload || action.error.message || null;
      })
      .addCase(getProductandSpecification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductandSpecification.fulfilled, (state, action) => {
        state.loading = false;
        state.productSpecification = action.payload;
      })
      .addCase(getProductandSpecification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      })

      .addCase(getQcreport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQcreport.fulfilled, (state, action) => {
        state.loading = false;
        state.qcReport = action.payload;
      })
      .addCase(getQcreport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      })

      // QC Batch
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
        state.error = action.payload || action.error.message || null;
      })

      .addCase(batchStatusChange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchStatusChange.fulfilled, (state, action) => {
        state.loading = false;
        state.qcbatchdata = action.payload;
      })
      .addCase(batchStatusChange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      })

      // Reports
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
        state.error = action.payload || action.error.message || null;
      })

      // Approve / Reject / Hold
      .addCase(Approvemodule.pending, (state) => {
        state.approveResult = null;
        state.error = null;
      })
      .addCase(Approvemodule.fulfilled, (state, action) => {
        state.approveResult = action.payload;
      })
      .addCase(Approvemodule.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      })

      .addCase(createQcReport.pending, (state) => {
        state.approveResult = null;
        state.error = null;
      })
      .addCase(createQcReport.fulfilled, (state, action) => {
        state.createReport = action.payload;
      })
      .addCase(createQcReport.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      })

      .addCase(Rejectmodule.pending, (state) => {
        state.rejectResult = null;
        state.error = null;
      })
      .addCase(Rejectmodule.fulfilled, (state, action) => {
        state.rejectResult = action.payload;
      })
      .addCase(Rejectmodule.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      })

      .addCase(Holdmodule.pending, (state) => {
        state.holdResult = null;
        state.error = null;
      })
      .addCase(Holdmodule.fulfilled, (state, action) => {
        state.holdResult = action.payload;
      })
      .addCase(Holdmodule.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      })

      // Delete
      .addCase(deleteQc.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteQc.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      })

      .addCase(Deleteqcbatch.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(Deleteqcbatch.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      });
  },
});

export default QcinventorySlice.reducer;
