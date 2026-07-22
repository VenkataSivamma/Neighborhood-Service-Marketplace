import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

const allNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊", roles: ["ADMIN", "CUSTOMER", "PROVIDER"] },
  { path: "/categories", label: "Categories", icon: "🏷️", roles: ["ADMIN", "CUSTOMER", "PROVIDER"] },
  { path: "/customers", label: "Customers", icon: "👥", roles: ["ADMIN"] },
  { path: "/providers", label: "Providers", icon: "🔧", roles: ["ADMIN"] },
  { path: "/bookings", label: "Bookings", icon: "📅", roles: ["ADMIN", "CUSTOMER", "PROVIDER"] },
  { path: "/reviews", label: "Reviews", icon: "⭐", roles: ["ADMIN", "CUSTOMER", "PROVIDER"] },
  { path: "/notifications", label: "Notifications", icon: "🔔", roles: ["ADMIN", "CUSTOMER", "PROVIDER"] },
  { path: "/reports", label: "Reports", icon: "📈", roles: ["ADMIN", "CUSTOMER", "PROVIDER"] },
];

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const role = (user?.role || "").toUpperCase();

  const navItems = allNavItems.filter((item) => item.roles.includes(role) || role === "");

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
            <div className="sidebar-user-name">{user.name || "Admin"}</div>
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
