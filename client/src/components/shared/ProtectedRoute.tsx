import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const localdata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const isLoggedIn = !!localdata?.token;

  return isLoggedIn ? <Navigate to="/" /> : children;
};

export default ProtectedRoute;