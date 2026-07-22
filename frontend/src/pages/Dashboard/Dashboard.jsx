import { useState, useEffect } from "react";
import { getDashboardStats, getAdminBookings, getAdminReviews } from "../../services/adminService";
import { getBookingsByCustomer, getBookingsByProvider } from "../../services/bookingService";
import { getReviewsByCustomer, getReviewsByProvider } from "../../services/reviewService";
import { getNotificationsByCustomer, getNotificationsByProvider } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import "../../styles/dashboard.css";
import "../../styles/table.css";

const StatCard = ({ label, value, icon, colorClass }) => (
  <div className={`stat-card ${colorClass || ""}`}>
    <div className="stat-icon">{icon}</div>
    <h3>{label}</h3>
    <div className="stat-value">{value ?? 0}</div>
  </div>
);

// ─── CUSTOMER DASHBOARD ───────────────────────────────────────────────────────
function CustomerDashboard({ uid }) {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const fetch = async () => {
      const [bRes, rRes, nRes] = await Promise.allSettled([
        getBookingsByCustomer(uid),
        getReviewsByCustomer(uid),
        getNotificationsByCustomer(uid),
      ]);
      setBookings(bRes.status === "fulfilled" && Array.isArray(bRes.value?.data) ? bRes.value.data : []);
      setReviews(rRes.status === "fulfilled" && Array.isArray(rRes.value?.data) ? rRes.value.data : []);
      setNotifications(nRes.status === "fulfilled" && Array.isArray(nRes.value?.data) ? nRes.value.data : []);
      setLoading(false);
    };
    fetch();
  }, [uid]);

  if (loading) return <Loader />;

  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <h1 className="page-heading">Welcome, {user?.name || "Customer"} 👋</h1>

      <div className="dashboard-grid">
        <StatCard label="My Bookings" value={bookings.length} icon="📅" colorClass="orange" />
        <StatCard label="Completed" value={completed} icon="✅" colorClass="green" />
        <StatCard label="Pending" value={pending} icon="⏳" colorClass="orange" />
        <StatCard label="Cancelled" value={cancelled} icon="❌" colorClass="red" />
        <StatCard label="My Reviews" value={reviews.length} icon="⭐" />
        <StatCard label="Unread Notifications" value={unread} icon="🔔" colorClass="purple" />
      </div>

      {/* My Recent Bookings */}
      <div className="table-container" style={{ marginBottom: 24 }}>
        <div className="table-header"><h2>My Recent Bookings</h2></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">📅</div><p>No bookings yet</p></div></td></tr>
              ) : (
                bookings.slice(0, 5).map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{b.providerName || b.providerId || "—"}</td>
                    <td>{b.serviceDescription || b.serviceType || "—"}</td>
                    <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "—"}</td>
                    <td><span className={`badge badge-${(b.status || "").toLowerCase().replace("_", "-")}`}>{b.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Reviews */}
      <div className="table-container" style={{ marginBottom: 24 }}>
        <div className="table-header"><h2>My Reviews</h2></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Provider</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">⭐</div><p>No reviews yet</p></div></td></tr>
              ) : (
                reviews.slice(0, 5).map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.providerName || r.providerId || "—"}</td>
                    <td>{"⭐".repeat(Math.min(r.rating || 0, 5))}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="table-container">
          <div className="table-header"><h2>Recent Notifications</h2></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Message</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {notifications.slice(0, 5).map((n, i) => (
                  <tr key={n.id}>
                    <td>{i + 1}</td>
                    <td>{n.message || "—"}</td>
                    <td><span className={`badge ${n.read ? "badge-active" : "badge-pending"}`}>{n.read ? "Read" : "Unread"}</span></td>
                    <td>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : n.sentAt ? new Date(n.sentAt).toLocaleDateString() : "—"}</td>
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

// ─── PROVIDER DASHBOARD ───────────────────────────────────────────────────────
function ProviderDashboard({ uid }) {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const fetch = async () => {
      const [bRes, rRes, nRes] = await Promise.allSettled([
        getBookingsByProvider(uid),
        getReviewsByProvider(uid),
        getNotificationsByProvider(uid),
      ]);
      setBookings(bRes.status === "fulfilled" && Array.isArray(bRes.value?.data) ? bRes.value.data : []);
      setReviews(rRes.status === "fulfilled" && Array.isArray(rRes.value?.data) ? rRes.value.data : []);
      setNotifications(nRes.status === "fulfilled" && Array.isArray(nRes.value?.data) ? nRes.value.data : []);
      setLoading(false);
    };
    fetch();
  }, [uid]);

  if (loading) return <Loader />;

  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const inProgress = bookings.filter((b) => b.status === "IN_PROGRESS").length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const unread = notifications.filter((n) => !n.read).length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div>
      <h1 className="page-heading">Welcome, {user?.name || "Provider"} 👋</h1>

      <div className="dashboard-grid">
        <StatCard label="Total Bookings" value={bookings.length} icon="📅" colorClass="orange" />
        <StatCard label="Completed" value={completed} icon="✅" colorClass="green" />
        <StatCard label="In Progress" value={inProgress} icon="🔄" colorClass="teal" />
        <StatCard label="Pending" value={pending} icon="⏳" colorClass="orange" />
        <StatCard label="Total Reviews" value={reviews.length} icon="⭐" />
        <StatCard label="Avg Rating" value={avgRating} icon="🌟" colorClass="purple" />
        <StatCard label="Unread Notifications" value={unread} icon="🔔" colorClass="purple" />
      </div>

      {/* Incoming Bookings */}
      <div className="table-container" style={{ marginBottom: 24 }}>
        <div className="table-header"><h2>Recent Bookings</h2></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">📅</div><p>No bookings yet</p></div></td></tr>
              ) : (
                bookings.slice(0, 5).map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{b.customerName || b.customerId || "—"}</td>
                    <td>{b.serviceDescription || b.serviceType || "—"}</td>
                    <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "—"}</td>
                    <td><span className={`badge badge-${(b.status || "").toLowerCase().replace("_", "-")}`}>{b.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviews received */}
      <div className="table-container" style={{ marginBottom: 24 }}>
        <div className="table-header"><h2>Reviews Received</h2></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Customer</th><th>Rating</th><th>Comment</th></tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">⭐</div><p>No reviews yet</p></div></td></tr>
              ) : (
                reviews.slice(0, 5).map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.customerName || r.customerId || "—"}</td>
                    <td>{"⭐".repeat(Math.min(r.rating || 0, 5))}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="table-container">
          <div className="table-header"><h2>Recent Notifications</h2></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Message</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {notifications.slice(0, 5).map((n, i) => (
                  <tr key={n.id}>
                    <td>{i + 1}</td>
                    <td>{n.message || "—"}</td>
                    <td><span className={`badge ${n.read ? "badge-active" : "badge-pending"}`}>{n.read ? "Read" : "Unread"}</span></td>
                    <td>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : n.sentAt ? new Date(n.sentAt).toLocaleDateString() : "—"}</td>
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

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [sRes, bRes, rRes] = await Promise.allSettled([
        getDashboardStats(),
        getAdminBookings(),
        getAdminReviews(),
      ]);
      if (sRes.status === "fulfilled") setStats(sRes.value?.data || null);
      setBookings(bRes.status === "fulfilled" && Array.isArray(bRes.value?.data) ? bRes.value.data.slice(0, 5) : []);
      setReviews(rRes.status === "fulfilled" && Array.isArray(rRes.value?.data) ? rRes.value.data.slice(0, 5) : []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="page-heading">Admin Dashboard</h1>

      <div className="dashboard-grid">
        <StatCard label="Total Categories" value={stats?.totalCategories} icon="🏷️" />
        <StatCard label="Total Customers" value={stats?.totalCustomers} icon="👥" colorClass="teal" />
        <StatCard label="Total Providers" value={stats?.totalProviders} icon="🔧" colorClass="purple" />
        <StatCard label="Total Bookings" value={stats?.totalBookings} icon="📅" colorClass="orange" />
        <StatCard label="Total Reviews" value={stats?.totalReviews} icon="⭐" />
        <StatCard label="Pending Providers" value={stats?.pendingProviders} icon="⏳" colorClass="orange" />
        <StatCard label="Completed Bookings" value={stats?.completedBookings} icon="✅" colorClass="green" />
        <StatCard label="Cancelled Bookings" value={stats?.cancelledBookings} icon="❌" colorClass="red" />
      </div>

      <div className="dashboard-tables">
        <div className="table-container">
          <div className="table-header"><h2>Latest Bookings</h2></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Customer</th><th>Service</th><th>Status</th></tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={4}><div className="empty-state"><p>No bookings found</p></div></td></tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>{b.customerName || b.customerId || "—"}</td>
                      <td>{b.serviceDescription || b.serviceType || "—"}</td>
                      <td><span className={`badge badge-${(b.status || "").toLowerCase().replace("_", "-")}`}>{b.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header"><h2>Recent Reviews</h2></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Customer</th><th>Rating</th><th>Comment</th></tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr><td colSpan={4}><div className="empty-state"><p>No reviews found</p></div></td></tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{r.customerName || r.customerId || "—"}</td>
                      <td>{"⭐".repeat(Math.min(r.rating || 0, 5))}</td>
                      <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT DASHBOARD — picks the right one by role ─────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  const uid = user?.id || user?.customerId || user?.providerId;

  if (role === "CUSTOMER") return <CustomerDashboard uid={uid} />;
  if (role === "PROVIDER") return <ProviderDashboard uid={uid} />;
  return <AdminDashboard />;
}
