import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../../store/auth-context';

const PrivateRoutes = () => {
  const authCtx = useContext(AuthContext);
  return authCtx.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
