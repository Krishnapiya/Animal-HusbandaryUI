/*eslint-disable*/
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserAttributes } from "./utils";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();

  const user = getUserAttributes(); // get user data

  // 1. user not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. roles provided but user role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
