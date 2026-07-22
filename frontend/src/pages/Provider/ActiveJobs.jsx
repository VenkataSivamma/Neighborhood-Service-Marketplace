import { useState, useEffect } from "react";
import { getBookingsByProvider, inProgressBooking, completeBooking } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import "../../styles/table.css";

const PAGE_SIZE = 8;

const STATUS_BADGE = {
  ACCEPTED: { label: "Accepted", cls: "badge-accepted" },
  IN_PROGRESS: { label: "In Progress", cls: "badge-in-progress" },
};

export default function ActiveJobs() {
  const { user } = useAuth();
  const uid = user?.id || user?.providerId || null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);

  const load = async () => {
    if (!uid) { setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const res = await getBookingsByProvider(uid);
      const all = Array.isArray(res.data) ? res.data : [];
      setJobs(all.filter((b) => b.status === "ACCEPTED" || b.status === "IN_PROGRESS"));
    } catch {
      setError("Failed to load active jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [uid]);

  const doAction = (label, fn, id) => {
    setConfirmAction({
      message: `Mark this job as "${label}"?`,
      onConfirm: async () => {
        try {
          await fn(id);
          setToast({ message: `Job marked as ${label}.`, type: "success" });
          load();
        } catch {
          setToast({ message: "Action failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  const paginated = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="page-heading">Active Jobs</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>Active Jobs ({jobs.length})</h2>
          <button className="btn btn-secondary btn-sm" onClick={load}>🔄 Refresh</button>
        </div>
        {loading ? <Loader /> : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>#</th><th>Customer</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">🔨</div><p>No active jobs</p></div></td></tr>
                  ) : (
                    paginated.map((b, i) => {
                      const bid = b.bookingId || b.id;
                      return (
                      <tr key={bid}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td>{b.customerName || b.customerId || "—"}</td>
                        <td>{b.serviceDescription || "—"}</td>
                        <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "—"}</td>
                        <td>
                          <span className={`badge ${STATUS_BADGE[b.status]?.cls || ""}`}>
                            {STATUS_BADGE[b.status]?.label || b.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {b.status === "ACCEPTED" && (
                              <button className="btn btn-info btn-sm" onClick={() => doAction("In Progress", inProgressBooking, bid)}>▶ Start</button>
                            )}
                            {b.status === "IN_PROGRESS" && (
                              <button className="btn btn-success btn-sm" onClick={() => doAction("Completed", completeBooking, bid)}>✅ Complete</button>
                            )}
                          </div>
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

      {confirmAction && <ConfirmDialog message={confirmAction.message} onConfirm={confirmAction.onConfirm} onCancel={() => setConfirmAction(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
