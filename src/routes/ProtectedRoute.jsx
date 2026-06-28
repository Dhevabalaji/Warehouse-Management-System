import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}