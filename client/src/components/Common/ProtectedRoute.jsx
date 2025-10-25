import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);

  // If no user → redirect to login
  if (!user || (role && user.role != role)) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise → allow access
  return children;
};

export default ProtectedRoute;
