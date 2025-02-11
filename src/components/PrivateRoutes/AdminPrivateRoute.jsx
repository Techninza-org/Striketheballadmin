import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function AdminPrivateRoute({ children }) {
  const isAuthenticated = Boolean(Cookies.get("authToken")); 
  const isEmployee = Boolean(Cookies.get("storeId"));
  const isAdmin = isAuthenticated && !isEmployee;
   
    return isAdmin ? children : <Navigate to="/" />;
}

export default AdminPrivateRoute;