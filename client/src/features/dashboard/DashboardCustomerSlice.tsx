import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'src/constants/axiosInstance';

/* =========================================================
    CUSTOMER TYPES
========================================================= */

interface CustomerData {
  company_address?: string;
  potential_opportunity?: number;
  convert_to_customer?: number;
}

interface TotalCustomersState {
  customers: CustomerData[];
  message: string;
  pending_orders: number;
  total_disputes: number;
  total_orders: number;
}

/* =========================================================
    EMPLOYEE DASHBOARD TYPES
========================================================= */

interface EmployeeDashboardData {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  slaBreaches: number;

  workingHours: number;
  avgResponse: string;

  acceptedTime: string;

  revenueImpact: string;

  todayTasks: any[];

  weeklyProductivity: {
    name: string;
    task: number;
  }[];

  message?: string;
}

/* =========================================================
    SLICE STATE
========================================================= */

interface DashboardState {
  loading: boolean;

  error: string | null;

  totalcustomers: TotalCustomersState;

  employeedata: EmployeeDashboardData;

  addResult: any;

  updateResult: any;

  deleteResult: any;
}

/* =========================================================
    INITIAL STATE
========================================================= */

const initialState: DashboardState = {
  loading: false,

  error: null,

  totalcustomers: {
    customers: [],

    message: '',

    pending_orders: 0,

    total_disputes: 0,

    total_orders: 0,
  },

  employeedata: {
    totalTasks: 0,

    completedTasks: 0,

    remainingTasks: 0,

    pendingTasks: 0,

    inProgressTasks: 0,

    overdueTasks: 0,

    slaBreaches: 0,

    workingHours: 0,

    avgResponse: '',

    acceptedTime: '',

    revenueImpact: '',

    todayTasks: [],

    weeklyProductivity: [],
  },

  addResult: null,

  updateResult: null,

  deleteResult: null,
};

/* =========================================================
    GET TOTAL CUSTOMERS
========================================================= */

export const gettotalCustomer = createAsyncThunk('dashboard/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/get-total-customers');

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch customers.';

    return thunkAPI.rejectWithValue(errorMessage);
  }
});

/* =========================================================
    GET EMPLOYEE DASHBOARD DATA
========================================================= */

export const getemployeedata = createAsyncThunk('dashboard/employee', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/get-employee-data');

    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch employee data.';

    return thunkAPI.rejectWithValue(errorMessage);
  }
});

/* =========================================================
    SLICE
========================================================= */

const DashboardCustomerSlice = createSlice({
  name: 'customerdashboard',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ================= CUSTOMERS ================= */

      .addCase(gettotalCustomer.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(gettotalCustomer.fulfilled, (state, action) => {
        state.loading = false;

        state.totalcustomers = action.payload;
      })

      .addCase(gettotalCustomer.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      })

      /* ================= EMPLOYEE DASHBOARD ================= */

      .addCase(getemployeedata.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(getemployeedata.fulfilled, (state, action) => {
        state.loading = false;

        state.employeedata = action.payload;
      })

      .addCase(getemployeedata.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      });
  },
});

export default DashboardCustomerSlice.reducer;
