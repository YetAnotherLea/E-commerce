import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserAuthContext } from "../../contexts";

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user } = useContext(UserAuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/" replace />;
  }

  return children;
};
