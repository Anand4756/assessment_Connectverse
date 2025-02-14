import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./provider/authprovider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>.</div>; // Show a loading indicator while checking authentication
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if user is not authenticated
  }

  return children;
};

export default ProtectedRoute;
