import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute({ children }) {
  const isAuthenticated = Boolean(Cookies.get("authToken")); // Replace with your auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
