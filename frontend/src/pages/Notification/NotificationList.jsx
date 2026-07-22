import { useState, useEffect } from "react";
import { getNotificationsByCustomer, getNotificationsByProvider, getAllNotifications, deleteNotification } from "../../services/notificationService";
import NotificationForm from "./NotificationForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import "../../styles/table.css";

const PAGE_SIZE = 8;

export default function NotificationList() {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);

  const load = async () => {
    const uid = user?.id || user?.customerId || user?.providerId;
    const role = (user?.role || "").toUpperCase();
    try {
      setLoading(true);
      setError("");
      let res;
      if (role === "ADMIN") res = await getAllNotifications();
      else if (role === "PROVIDER") {
        if (!uid) { setLoading(false); return; }
        res = await getNotificationsByProvider(uid);
      } else {
        if (!uid) { setLoading(false); return; }
        res = await getNotificationsByCustomer(uid);
      }
      const data = Array.isArray(res.data) ? res.data : [];
      setNotifications(data);
      setFiltered(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data;
      setError(typeof msg === "string" ? msg : "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.id, user?.customerId, user?.providerId, user?.role]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(notifications.filter((n) => (n.message || "").toLowerCase().includes(q)));
    setPage(1);
  }, [search, notifications]);

  const handleDelete = (id) => {
    setConfirmAction({
      message: "Delete this notification?",
      onConfirm: async () => {
        try {
          await deleteNotification(id);
          setToast({ message: "Notification deleted.", type: "success" });
          load();
        } catch {
          setToast({ message: "Delete failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="page-heading">Notifications</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>My Notifications ({filtered.length})</h2>
          <div className="table-actions">
            <SearchBar value={search} onChange={setSearch} placeholder="Search message..." />
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(""); load(); }}>Refresh</button>
            {role === "ADMIN" && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Send Notification</button>
            )}
          </div>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Message</th>
                    <th>Read</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <div className="empty-icon">🔔</div>
                          <p>No notifications found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((n, i) => {
                      const nid = n.notificationId || n.id;
                      return (
                      <tr key={nid}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td>{n.message || "—"}</td>
                        <td>
                          <span className={`badge ${n.read ? "badge-active" : "badge-pending"}`}>
                            {n.read ? "Read" : "Unread"}
                          </span>
                        </td>
                        <td>
                          {n.createdAt ? new Date(n.createdAt).toLocaleString()
                            : n.sentAt ? new Date(n.sentAt).toLocaleString() : "—"}
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(nid)}>Delete</button>
                        </td>
                      </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {showForm && (
        <NotificationForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            load();
            setToast({ message: "Notification sent.", type: "success" });
          }}
        />
      )}
      {confirmAction && (
        <ConfirmDialog
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
