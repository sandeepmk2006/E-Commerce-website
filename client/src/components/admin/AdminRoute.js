import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserContext from '../../context/UserContext';

const AdminRoute = () => {
  const { user } = useContext(UserContext);

  if (user && user.role === 'admin') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
