import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const titles = {
  "/dashboard":        "Dashboard",
  "/search-services":  "Search Services",
  "/my-bookings":      "My Bookings",
  "/my-reviews":       "My Reviews",
  "/profile":          "My Profile",
  "/booking-requests": "Booking Requests",
  "/active-jobs":      "Active Jobs",
  "/provider-reviews": "My Reviews",
  "/provider-profile": "My Profile",
  "/categories":       "Categories",
  "/customers":        "Customers",
  "/providers":        "Providers",
  "/bookings":         "Bookings",
  "/reviews":          "Reviews",
  "/notifications":    "Notifications",
  "/reports":          "Reports",
};

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();
  const title = titles[location.pathname] || "Admin Panel";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={onToggleSidebar}>☰</button>
        <span className="navbar-title">{title}</span>
      </div>
      <div className="navbar-right">
        <div className="navbar-admin">
          <div className="admin-avatar">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span>{user?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
