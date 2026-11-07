
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    if (user?.role === "instructor" || user?.role === "admin") {
      return (
        <Navigate
          to="/instructor-dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/student-dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
