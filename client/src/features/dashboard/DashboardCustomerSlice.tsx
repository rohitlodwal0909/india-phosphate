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

interface AllCustomerData {
  avgOrderValue?: string;
  buyingCycle?: number;
  fyTotalValue?: number;
  productWiseData: any;
  gradeWiseData: string;
  potentialRevenue: number;
  dormantCustomers: number;
  conversionRate: number;
  revivedCustomers: number;
  recoveryRate: number;
  customer_conversation: any;
  revivalQueue: any[];
  customersRevenueMap: any[];
}

interface CustomerDashboardData {
  enquiry: number;
  sample: number;
  order: number;
  po_value: string;
  customer: any;
  fyTotalValue: string;
  avgOrderValue: string;
  lastOrder: any;
  buyingCycle: string;
  productWiseData: any;
  gradeWiseData: string;
  potentialRevenue: number;
}

interface TotalCustomersState {
  customers: CustomerData[];
  customer: AllCustomerData;
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
  customer: CustomerDashboardData;
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
    customer: {
      avgOrderValue: '',
      buyingCycle: 0,
      fyTotalValue: 0,
      productWiseData: [],
      gradeWiseData: '',
      potentialRevenue: 0,
      dormantCustomers: 0,
      conversionRate: 0,
      revivedCustomers: 0,
      recoveryRate: 0,
      customer_conversation: {
        identifiedCompanies: 0,
        contacted: 0,
        enquiry: 0,
        quotation: 0,
        sample: 0,
        order: 0,
        lost: 0,
      },
      customersRevenueMap: [],
      revivalQueue: [],
    },
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

  customer: {
    customer: {},
    enquiry: 0,
    sample: 0,
    order: 0,
    po_value: '',
    fyTotalValue: '',
    avgOrderValue: '',
    lastOrder: '',
    buyingCycle: '',
    productWiseData: [],
    gradeWiseData: '',
    potentialRevenue: 0,
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

export const getemployeedata = createAsyncThunk(
  'dashboard/employee',
  async (
    {
      id,
      fromDate,
      toDate,
    }: {
      id: number | string;
      fromDate?: string;
      toDate?: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.get(`/get-employee-data/${id}`, {
        params: {
          fromDate,
          toDate,
        },
      });

      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employee data.';

      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const getsinglecustomer = createAsyncThunk(
  'dashboard/customer',
  async (id: number | string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/get-customer-data/${id}`);

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employee data.';

      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const getGstdetails = createAsyncThunk('dashboard/gst', async (_, thunkAPI) => {
  try {
    const data = {
      company_name: 'Hindustan Phosphates Pvt. Ltd.',
      state_code: 'MH',
    };
    const response = await axiosInstance.post('/get-gstdetails', data);

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch customers.';

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
      })

      .addCase(getsinglecustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getsinglecustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })

      .addCase(getsinglecustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default DashboardCustomerSlice.reducer;
