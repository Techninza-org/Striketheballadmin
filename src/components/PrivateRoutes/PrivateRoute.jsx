import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute({ children }) {
  const isAuthenticated = Boolean(Cookies.get("authToken")); 
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
