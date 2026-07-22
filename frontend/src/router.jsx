import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotificationList from "./pages/Notification/NotificationList";

// Customer pages
import SearchServices from "./pages/Customer/SearchServices";
import CustomerBookings from "./pages/Booking/BookingList";
import CustomerReviews from "./pages/Customer/CustomerReviews";
import CustomerProfile from "./pages/Customer/CustomerProfile";

// Provider pages
import BookingRequests from "./pages/Provider/BookingRequests";
import ActiveJobs from "./pages/Provider/ActiveJobs";
import ProviderReviews from "./pages/Provider/ProviderReviews";
import ProviderProfile from "./pages/Provider/ProviderProfile";

// Admin pages
import CustomerList from "./pages/Customer/CustomerList";
import ProviderList from "./pages/Provider/ProviderList";
import CategoryList from "./pages/Category/CategoryList";
import BookingList from "./pages/Booking/BookingList";
import ReviewList from "./pages/Review/ReviewList";
import Reports from "./pages/Reports/Reports";

function RoleRoute({ roles, children }) {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Shared */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationList /></ProtectedRoute>} />

      {/* Customer only */}
      <Route path="/search-services" element={<RoleRoute roles={["CUSTOMER"]}><SearchServices /></RoleRoute>} />
      <Route path="/my-bookings"     element={<RoleRoute roles={["CUSTOMER"]}><CustomerBookings /></RoleRoute>} />
      <Route path="/my-reviews"      element={<RoleRoute roles={["CUSTOMER"]}><CustomerReviews /></RoleRoute>} />
      <Route path="/profile"         element={<RoleRoute roles={["CUSTOMER"]}><CustomerProfile /></RoleRoute>} />

      {/* Provider only */}
      <Route path="/booking-requests" element={<RoleRoute roles={["PROVIDER"]}><BookingRequests /></RoleRoute>} />
      <Route path="/active-jobs"      element={<RoleRoute roles={["PROVIDER"]}><ActiveJobs /></RoleRoute>} />
      <Route path="/provider-reviews" element={<RoleRoute roles={["PROVIDER"]}><ProviderReviews /></RoleRoute>} />
      <Route path="/provider-profile" element={<RoleRoute roles={["PROVIDER"]}><ProviderProfile /></RoleRoute>} />

      {/* Admin only */}
      <Route path="/customers"     element={<RoleRoute roles={["ADMIN"]}><CustomerList /></RoleRoute>} />
      <Route path="/providers"     element={<RoleRoute roles={["ADMIN"]}><ProviderList /></RoleRoute>} />
      <Route path="/categories"    element={<RoleRoute roles={["ADMIN"]}><CategoryList /></RoleRoute>} />
      <Route path="/bookings"      element={<RoleRoute roles={["ADMIN"]}><BookingList /></RoleRoute>} />
      <Route path="/reviews"       element={<RoleRoute roles={["ADMIN"]}><ReviewList /></RoleRoute>} />
      <Route path="/reports"       element={<RoleRoute roles={["ADMIN"]}><Reports /></RoleRoute>} />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
