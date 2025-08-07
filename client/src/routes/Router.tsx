// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy, useState } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom'; // 🛠 make sure it's 'react-router-dom'
import Loadable from '../layouts/full/shared/loadable/Loadable';

import ProtectedRoute from 'src/components/shared/ProtectedRoute'; // ✅ Import the guard
import AuthGuard from 'src/utils/Authcard';
import Supplier from 'src/views/master/Supplier/Supplier';
import Customer from 'src/views/master/Customer/Customer';
import Category from 'src/views/master/Category/Category';
import RmCode from 'src/views/master/RmCode/RmCode';
import Unit from 'src/views/master/Unit/Unit';
import StaffMaster from 'src/views/master/StaffMaster/StaffMaster';
import Qualification from 'src/views/master/Qualification/Qualification';
import Designation from 'src/views/master/Designation/Designation';
import State from 'src/views/master/State/State';
import City from 'src/views/master/City/City';
import Inward from 'src/views/master/Inward/Inward';
import Company from 'src/views/master/Company/Company';
import MakeMaster from 'src/views/master/MakeMaster/MakeMaster';
import DepartmentMaster from 'src/views/master/DepartmentMaster/DepartmentMaster';
import Account from 'src/views/master/Account/Account';
import PackingMaterial from 'src/views/master/PackingMaterial/PackingMaterial';
import Transport from 'src/views/master/Transport/Transport';
import BatchMaster from 'src/views/master/BatchMaster/BatchMaster';
import PendingOrder from 'src/views/master/PendingOrder/PendingOrder';
import StockMaster from 'src/views/master/StockMaster/StockMaster';
import SalesMaster from 'src/views/master/SalesMaster/SalesMaster';
import HsnMaster from 'src/views/master/HsnMaster/HsnMaster';
import Currency from 'src/views/master/Currency/Currency';
import Equipment from 'src/views/master/Equipment/Currency';
import Outward from 'src/views/master/Outward/Outward';
import Purchase from 'src/views/master/Purchase/Purchase';
import BmrMaster from 'src/views/master/BmrMaster/BmrMaster';

const WelcomeDashboard = Loadable(lazy(() => import('src/views/dashboard/WelcomeDashboard.tsx')));
const SubmitReport = Loadable(lazy(() => import('src/views/Report/SubmitReport')));
const ProductionInventory = Loadable(lazy(() => import('src/views/inventory/production/ProductionInventory')));
const DispatchInventory = Loadable(lazy(() => import('src/views/inventory/dispatch-inventory/DispatchInventory')));
const Qcbatch = Loadable(lazy(() => import('src/views/inventory/qcbatch/Qcbatch')));
const SeeAllNotifications = Loadable(lazy(() => import('src/views/Notifications/SeeAllNotifications')));
const Finishing = Loadable(lazy(() => import('src/views/inventory/finishing/Finishing')));
const ChangePassword = Loadable(lazy(() => import('src/views/authentication/ChangePassword')));
const Logs = Loadable(lazy(() => import('src/views/authentication/Logs')));
// import { useSelector } from 'react-redux';
const Usermanagment = Loadable(lazy(() => import('src/views/usermanagment/Usermanagment')));
const GuardInventory = Loadable(lazy(() => import('src/views/inventory/Guardentry/GuardInventory')));
const StoreInventory = Loadable(lazy(() => import('src/views/inventory/inventory-store/StoreInventory')));
const QcInventory = Loadable(lazy(() => import('src/views/inventory/qC-inventory/QcInventory')));
const Userprofile = Loadable(lazy(() => import('src/views/userprofile/Userprofile')));
const PermissionsTable = Loadable(lazy(() => import('src/views/permission/PermissionsTable')));
const ViewReport = Loadable(lazy(() => import('src/views/Report/ViewReport')));
/* Layouts */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* Authentication */
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const Maintainance = Loadable(lazy(() => import('../views/authentication/Maintainance')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

/* Pages */

const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
    // const logindata = useSelector((state: any) => state.authentication?.logindata);
const isAdminRole = logindata?.admin?.role_id == 1;

const fullLayoutChildren = [
  { path: '/', element: <WelcomeDashboard /> },
  { path: '/view-report/:id', element: <ViewReport /> },
  { path: '/user-profile', element: <Userprofile /> },
  { path: '/change-password', element: <ChangePassword /> },
  { path: '/log', element: <Logs /> },
  { path: '/inventory/check-in', element: <GuardInventory /> },
  { path: '/inventory/store', element: <StoreInventory /> },
  { path: '/inventory/qc', element: <QcInventory /> },
  { path: '/inventory/qc-batch', element: <Qcbatch /> },
  { path: '/notifications', element: <SeeAllNotifications/> },
  { path: '/inventory/production', element: <ProductionInventory /> },
  { path: '/inventory/finishing', element: <Finishing /> },
  { path: '/inventory/dispatch', element: <DispatchInventory /> },
 
  { path: '/inventory/report/:id', element: <SubmitReport/> },
  { path: '/master/company', element: <Company/> },
  { path: '/master/supplier', element: <Supplier/> },
  { path: '/master/customer', element: <Customer/> },
  { path: '/master/category', element: <Category/> },
  { path: '/master/rm-code', element: <RmCode/> },
  { path: '/master/unit', element: <Unit/> },
  { path: '/master/make-masters', element: <MakeMaster/> },
  { path: '/master/department-masters', element: <DepartmentMaster/> },
  { path: '/master/accounts', element: <Account/> },
  { path: '/master/packing-material', element: <PackingMaterial/> },
  { path: '/master/transport', element: <Transport/> },
  { path: '/master/batch-masters', element: <BatchMaster/> },
  { path: '/master/pending-orders', element: <PendingOrder/> },
  { path: '/master/stock-masters', element: <StockMaster/> },
  { path: '/master/sales-masters', element: <SalesMaster/> },
  { path: '/master/hsn-masters', element: <HsnMaster/> },
  { path: '/master/currency-master', element: <Currency/> },
  { path: '/master/equipment', element: <Equipment/> },
  { path: '/master/outward', element: <Outward/> },
  { path: '/master/purchase', element: <Purchase/> },
  { path: '/master/bmr', element: <BmrMaster/> },
  { path: '/master/unit', element: <Unit/> },
  { path: '/master/staff-master', element: <StaffMaster/> },
  { path: '/master/designation', element: <Designation/> },
  { path: '/master/qualification', element: <Qualification/> },
  { path: '/master/states', element: <State/> },
  { path: '/master/cites', element: <City/> },
  { path: '/master/inward', element: <Inward/> },

  { path: '*', element: <Navigate to="/auth/404" /> },
];

// Only add sensitive routes if NOT role_id === 1
if (isAdminRole) {
  fullLayoutChildren.splice(2, 0, { path: '/user-profile/user-managment', element: <Usermanagment /> }); // insert after user-profile
  fullLayoutChildren.push({ path: '/permission', element: <PermissionsTable /> });
}

const Router = [
 {
  path: '/',
  element: <AuthGuard />, // Protects private pages
  children: [
    {
      path: '/',
      element: <FullLayout />,
      children: fullLayoutChildren,
    },
  ],
},

{
  path: '/',
  element: <BlankLayout />,
  children: [
    {
      path: '/admin/login',
      element: (
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/register',
      element: (
        <ProtectedRoute>
          <Register />
        </ProtectedRoute>
      ),
    },
    { path: '/admin/forgot-password', element: <ForgotPassword /> },
    { path: '/admin/two-steps', element: <TwoSteps /> },
    { path: '/admin/maintenance', element: <Maintainance /> },
    { path: '/auth/404', element: <Error /> },
    { path: '*', element: <Navigate to="/auth/404" /> },
  ],
}

];

const router = createBrowserRouter(Router);
export default router;
