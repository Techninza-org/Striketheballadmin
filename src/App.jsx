import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import PostProduct from "./pages/PostProduct";
import UsersPage from "./pages/StoresPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/PrivateRoutes/PrivateRoute";
import StoresPage from "./pages/StoresPage";
import AddStorePage from "./pages/AddStorePage";
import CreateStorePage from "./pages/AddStorePage";
import EmployeePage from "./pages/EmployeePage";
import AddEmployeePage from "./pages/AddEmployeePage";
import PackagesPage from "./pages/PackagesPage";
import AddPackage from "./pages/AddPackagePage";
import BookingPage from "./pages/BookingPage";
import AddCustomer from "./pages/AddCustomerPage";
import CustomersPage from "./pages/CustomersPage";
import AddBooking from "./pages/AddBookingPage";


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div
      className={`flex h-screen ${
        isLoginPage
          ? "bg-gray-100"
          : "bg-gray-900 text-gray-100 overflow-hidden"
      }`}
    >
      {/* Background effect */}
      {!isLoginPage && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        </div>
      )}

      {/* Sidebar */}
      {!isLoginPage && <Sidebar />}

      {/* Page content */}
      <div
        className={`flex-1 ${
          isLoginPage ? "flex items-center justify-center" : "overflow-auto"
        }`}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <OverviewPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <EmployeePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/post-products"
            element={
              <PrivateRoute>
                <PostProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <PrivateRoute>
                <StoresPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-store"
            element={
              <PrivateRoute>
                <CreateStorePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-customer"
            element={
              <PrivateRoute>
                <AddCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-booking"
            element={
              <PrivateRoute>
                <AddBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <PrivateRoute>
                <AddEmployeePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/packages"
            element={
              <PrivateRoute>
                <PackagesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <BookingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-package"
            element={
              <PrivateRoute>
                <AddPackage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <SalesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <AnalyticsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
