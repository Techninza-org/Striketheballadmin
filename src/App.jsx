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
import AdminPrivateRoute from "./components/PrivateRoutes/AdminPrivateRoute";
import StoreAddBooking from "./pages/StoreAddBookingPage";
import StoreBookingsPage from "./pages/StoreBookingsPage";
import AdminBookingLogsPage from "./pages/AdminBookingLog";
import StoreBookingLogsPage from "./pages/StoreBookingLogPage";
import SubadminPage from "./pages/SubadminPage";
import AddSubadminPage from "./pages/AddSubadminPage";
import Calls from "./pages/CallsPage";


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
            path="/subadmins"
            element={
              <AdminPrivateRoute>
                <SubadminPage />
              </AdminPrivateRoute>
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
              <AdminPrivateRoute>
                <StoresPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <AdminPrivateRoute>
                <AdminBookingLogsPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/calls"
            element={
              <AdminPrivateRoute>
                <Calls />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/store-logs"
            element={
              <PrivateRoute>
                <StoreBookingLogsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-store"
            element={
              <AdminPrivateRoute>
                <CreateStorePage />
              </AdminPrivateRoute>
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
              <AdminPrivateRoute>
                <AddEmployeePage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/add-subadmin"
            element={
              <AdminPrivateRoute>
                <AddSubadminPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/packages"
            element={
              <AdminPrivateRoute>
                <PackagesPage />
              </AdminPrivateRoute>
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
              <AdminPrivateRoute>
                <BookingPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/store-bookings"
            element={
              <PrivateRoute>
                <StoreBookingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/store-add-booking"
            element={
              <PrivateRoute>
                <StoreAddBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-package"
            element={
              <AdminPrivateRoute>
                <AddPackage />
              </AdminPrivateRoute>
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
