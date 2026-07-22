import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import CategoryList from "./pages/Category/CategoryList";
import CustomerList from "./pages/Customer/CustomerList";
import ProviderList from "./pages/Provider/ProviderList";
import BookingList from "./pages/Booking/BookingList";
import ReviewList from "./pages/Review/ReviewList";
import NotificationList from "./pages/Notification/NotificationList";
import Reports from "./pages/Reports/Reports";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
      <Route path="/providers" element={<ProtectedRoute><ProviderList /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><ReviewList /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationList /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
