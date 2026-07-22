import { useState, useEffect } from "react";
import { getBookingsByProvider, acceptBooking, rejectBooking } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import "../../styles/table.css";

const PAGE_SIZE = 8;

export default function BookingRequests() {
  const { user } = useAuth();
  const uid = user?.id || user?.providerId || null;

  const [bookings, setBookings] = useState([]);
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
      console.log("booking sample:", all[0]);
      setBookings(all.filter((b) => b.status === "PENDING"));
    } catch {
      setError("Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [uid]);

  const doAction = (label, fn, id) => {
    setConfirmAction({
      message: `${label} this booking request?`,
      onConfirm: async () => {
        try {
          await fn(id);
          setToast({ message: `Booking ${label.toLowerCase()}ed.`, type: "success" });
          load();
        } catch {
          setToast({ message: "Action failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  const paginated = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(bookings.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="page-heading">Booking Requests</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>Pending Requests ({bookings.length})</h2>
          <button className="btn btn-secondary btn-sm" onClick={load}>🔄 Refresh</button>
        </div>
        {loading ? <Loader /> : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>#</th><th>Customer</th><th>Service</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">📋</div><p>No pending requests</p></div></td></tr>
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
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-success btn-sm" onClick={() => doAction("Accept", acceptBooking, bid)}>✅ Accept</button>
                            <button className="btn btn-danger btn-sm" onClick={() => doAction("Reject", rejectBooking, bid)}>❌ Reject</button>
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
