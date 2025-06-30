import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {
  const localdata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const isLoggedIn = !!localdata?.token;

  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AuthGuard;