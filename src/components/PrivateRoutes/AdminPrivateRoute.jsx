import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

function AdminPrivateRoute({ children }) {
  const isAuthenticated = Boolean(Cookies.get("authToken")); 
  const isEmployee = Boolean(Cookies.get("storeId"));
  const isSubadmin = Boolean(Cookies.get("accessTo"));
  const isAdmin = isAuthenticated && !isEmployee;

  if(isSubadmin){
    const accessToCookie = Cookies.get("accessTo");
    const accessArray = Object.keys(JSON.parse(accessToCookie)).filter(
      (route) => JSON.parse(accessToCookie)[route]
    );
    const accessRoutes = accessArray.map((route) => `/${route}`);
    const currentRoute = useLocation().pathname;
    const hasAccessToCurrentRoute = accessRoutes.includes(currentRoute);
    return hasAccessToCurrentRoute ? children : <Navigate to="/" />;
  }
   
  return isAdmin ? children : <Navigate to="/" />;
}

export default AdminPrivateRoute;