import { useState, useEffect } from "react";
import { getAdminReports, getAdminBookings, getAdminCustomers, getAdminProviders } from "../../services/adminService";
import { getBookingsByCustomer, getBookingsByProvider } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import "../../styles/dashboard.css";
import "../../styles/table.css";

const StatCard = ({ label, value, icon, colorClass }) => (
  <div className={`stat-card ${colorClass || ""}`}>
    <div className="stat-icon">{icon}</div>
    <h3>{label}</h3>
    <div className="stat-value">{value ?? "—"}</div>
  </div>
);

// Safely flatten any response into key-value pairs for stat cards
const toEntries = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return [["Total Records", data.length]];
  if (typeof data === "object") return Object.entries(data).filter(([, v]) => typeof v !== "object");
  return [["Result", String(data)]];
};

export default function Reports() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = (user?.role || "").toUpperCase();
  // Resolve id from whichever field the backend returned
  const uid = user?.id || user?.customerId || user?.providerId;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        if (role === "CUSTOMER" && uid) {
          const res = await getBookingsByCustomer(uid);
          const data = Array.isArray(res.data) ? res.data : [];
          setBookings(data);
          setReport({
            totalBookings: data.length,
            completedBookings: data.filter((b) => b.status === "COMPLETED").length,
            cancelledBookings: data.filter((b) => b.status === "CANCELLED").length,
            pendingBookings: data.filter((b) => b.status === "PENDING").length,
            acceptedBookings: data.filter((b) => b.status === "ACCEPTED").length,
          });
        } else if (role === "PROVIDER" && uid) {
          const res = await getBookingsByProvider(uid);
          const data = Array.isArray(res.data) ? res.data : [];
          setBookings(data);
          setReport({
            totalBookings: data.length,
            completedBookings: data.filter((b) => b.status === "COMPLETED").length,
            cancelledBookings: data.filter((b) => b.status === "CANCELLED").length,
            inProgressBookings: data.filter((b) => b.status === "IN_PROGRESS").length,
            pendingBookings: data.filter((b) => b.status === "PENDING").length,
          });
        } else {
          // Admin: call /admin/reports
          const res = await getAdminReports();
          setReport(res.data);
          // Also load bookings table for admin
          try {
            const bRes = await getAdminBookings();
            setBookings(Array.isArray(bRes.data) ? bRes.data.slice(0, 10) : []);
          } catch {
            // bookings table is optional — ignore if it fails
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data;
        setError(typeof msg === "string" ? msg : "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [uid, user?.role]);

  if (loading) return <Loader />;

  const statEntries = toEntries(report);

  return (
    <div>
      <h1 className="page-heading">Reports</h1>
      {error && <div className="error-msg">{error}</div>}

      {/* Stat cards */}
      {statEntries.length > 0 && (
        <div className="dashboard-grid" style={{ marginBottom: 28 }}>
          {statEntries.map(([key, value]) => (
            <StatCard
              key={key}
              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              value={value}
              icon={
                key.toLowerCase().includes("complete") ? "✅" :
                key.toLowerCase().includes("cancel") ? "❌" :
                key.toLowerCase().includes("pending") ? "⏳" :
                key.toLowerCase().includes("progress") ? "🔄" :
                key.toLowerCase().includes("customer") ? "👥" :
                key.toLowerCase().includes("provider") ? "🔧" :
                key.toLowerCase().includes("review") ? "⭐" :
                "📊"
              }
              colorClass={
                key.toLowerCase().includes("complete") ? "green" :
                key.toLowerCase().includes("cancel") ? "red" :
                key.toLowerCase().includes("pending") ? "orange" :
                key.toLowerCase().includes("provider") ? "purple" :
                key.toLowerCase().includes("customer") ? "teal" : ""
              }
            />
          ))}
        </div>
      )}

      {statEntries.length === 0 && !error && (
        <div className="table-container" style={{ marginBottom: 24 }}>
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <p>No report data available</p>
          </div>
        </div>
      )}

      {/* Bookings breakdown table */}
      {bookings.length > 0 && (
        <div className="table-container">
          <div className="table-header">
            <h2>Bookings Breakdown</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{role === "PROVIDER" ? "Customer" : "Provider"}</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>
                      {role === "PROVIDER"
                        ? (b.customerName || b.customerId || "—")
                        : (b.providerName || b.providerId || "—")}
                    </td>
                    <td>{b.serviceDescription || b.serviceType || b.serviceName || "—"}</td>
                    <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "—"}</td>
                    <td>
                      <span className={`badge badge-${(b.status || "").toLowerCase().replace("_", "-")}`}>
                        {b.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
