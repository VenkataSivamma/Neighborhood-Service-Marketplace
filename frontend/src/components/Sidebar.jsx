import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

const NAV = {
  CUSTOMER: [
    { path: "/dashboard",        label: "Dashboard",       icon: "📊" },
    { path: "/search-services",  label: "Search Services", icon: "🔍" },
    { path: "/my-bookings",      label: "My Bookings",     icon: "📅" },
    { path: "/my-reviews",       label: "My Reviews",      icon: "⭐" },
    { path: "/notifications",    label: "Notifications",   icon: "🔔" },
    { path: "/profile",          label: "Profile",         icon: "👤" },
  ],
  PROVIDER: [
    { path: "/dashboard",        label: "Dashboard",       icon: "📊" },
    { path: "/booking-requests", label: "Booking Requests",icon: "📋" },
    { path: "/active-jobs",      label: "Active Jobs",     icon: "🔨" },
    { path: "/provider-reviews", label: "My Reviews",      icon: "⭐" },
    { path: "/notifications",    label: "Notifications",   icon: "🔔" },
    { path: "/provider-profile", label: "Profile",         icon: "👤" },
  ],
  ADMIN: [
    { path: "/dashboard",     label: "Dashboard",     icon: "📊" },
    { path: "/customers",     label: "Customers",     icon: "👥" },
    { path: "/providers",     label: "Providers",     icon: "🔧" },
    { path: "/categories",    label: "Categories",    icon: "🏷️" },
    { path: "/bookings",      label: "Bookings",      icon: "📅" },
    { path: "/reviews",       label: "Reviews",       icon: "⭐" },
    { path: "/notifications", label: "Notifications", icon: "🔔" },
    { path: "/reports",       label: "Reports",       icon: "📈" },
  ],
};

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const role = (user?.role || "ADMIN").toUpperCase();
  const navItems = NAV[role] || NAV.ADMIN;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <h2>🏘️ Neighbourhood</h2>
        <span>Service Marketplace</span>
      </div>

      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user.name?.[0]?.toUpperCase() || "A"}</div>
          <div>
            <div className="sidebar-user-name">{user.name || "User"}</div>
            <div className="sidebar-user-role">{user.role || "ADMIN"}</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
