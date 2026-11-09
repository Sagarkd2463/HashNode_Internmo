import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading session...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;