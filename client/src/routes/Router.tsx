// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy, useState } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom'; // 🛠 make sure it's 'react-router-dom'
import Loadable from '../layouts/full/shared/loadable/Loadable';

import ProtectedRoute from 'src/components/shared/ProtectedRoute'; // ✅ Import the guard
import AuthGuard from 'src/utils/Authcard';
import WelcomeDashboard from 'src/views/dashboard/WelcomeDashboard.tsx';
import SubmitReport from 'src/views/Report/SubmitReport';
import ProductionInventory from 'src/views/inventory/production/ProductionInventory';
import DispatchInventory from 'src/views/inventory/dispatch-inventory/DispatchInventory';
import Qcbatch from 'src/views/inventory/qcbatch/Qcbatch';
import SeeAllNotifications from 'src/views/Notifications/SeeAllNotifications';
import Finishing from 'src/views/inventory/finishing/Finishing';

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



const isAdminRole = logindata?.admin?.role_id === 1;

const fullLayoutChildren = [
  { path: '/', element: <WelcomeDashboard /> },
  { path: '/view-report/:id', element: <ViewReport /> },
  { path: '/user-profile', element: <Userprofile /> },
  { path: '/inventory/check-in', element: <GuardInventory /> },
  { path: '/inventory/store', element: <StoreInventory /> },
  { path: '/inventory/qc', element: <QcInventory /> },
  { path: '/inventory/qc-batch', element: <Qcbatch /> },
  { path: '/notifications', element: <SeeAllNotifications/> },
  { path: '/inventory/production', element: <ProductionInventory /> },
  { path: '/inventory/finishing', element: <Finishing /> },
  { path: '/inventory/dispatch', element: <DispatchInventory /> },
  { path: '/inventory/report/:id', element: <SubmitReport/> },
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
