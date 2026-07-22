import { useState, useEffect } from "react";
import {
  getAllBookings, deleteBooking, acceptBooking, rejectBooking,
  inProgressBooking, completeBooking, cancelBooking,
  getBookingsByCustomer, getBookingsByProvider,
} from "../../services/bookingService";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import "../../styles/table.css";

const PAGE_SIZE = 8;

export default function BookingList() {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  const uid = user?.id || user?.customerId || user?.providerId || null;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);

  const load = async (currentRole, currentUid) => {
    try {
      setLoading(true);
      setError("");
      let res;
      if (currentRole === "CUSTOMER") res = await getBookingsByCustomer(currentUid);
      else if (currentRole === "PROVIDER") res = await getBookingsByProvider(currentUid);
      else res = await getAllBookings();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Failed to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!role) return;
    if ((role === "CUSTOMER" || role === "PROVIDER") && uid == null) {
      setError("User session missing ID. Please log out and log in again.");
      return;
    }
    load(role, uid);
  }, [role, uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const doAction = (label, fn, id) => {
    setConfirmAction({
      message: `Mark booking as "${label}"?`,
      onConfirm: async () => {
        try {
          await fn(id);
          setToast({ message: `Booking marked as ${label}.`, type: "success" });
          load(role, uid);
        } catch {
          setToast({ message: "Action failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  const handleDelete = (id) => {
    setConfirmAction({
      message: "Delete this booking?",
      onConfirm: async () => {
        try {
          await deleteBooking(id);
          setToast({ message: "Booking deleted.", type: "success" });
          load(role, uid);
        } catch {
          setToast({ message: "Delete failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  const paginated = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(bookings.length / PAGE_SIZE);

  const heading =
    role === "CUSTOMER" ? "My Booking Requests" :
    role === "PROVIDER" ? "Incoming Requests" :
    "All Bookings";

  // Column count for empty state colspan
  const colCount = role === "ADMIN" ? 7 : 6;

  return (
    <div>
      <h1 className="page-heading">Bookings</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>{heading} ({bookings.length})</h2>
          <div className="table-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => load(role, uid)}>🔄 Refresh</button>
          </div>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    {role !== "CUSTOMER" && <th>Customer</th>}
                    {role !== "PROVIDER" && <th>Provider</th>}
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={colCount}>
                        <div className="empty-state">
                          <div className="empty-icon">📅</div>
                          <p>{role === "PROVIDER" ? "No incoming requests" : "No bookings found"}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((b, i) => {
                      const bid = b.bookingId || b.id;
                      return (
                      <tr key={bid}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        {role !== "CUSTOMER" && <td>{b.customerName || b.customerId || "—"}</td>}
                        {role !== "PROVIDER" && <td>{b.providerName || b.providerId || "—"}</td>}
                        <td>{b.serviceDescription || b.serviceName || b.serviceType || "—"}</td>
                        <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "—"}</td>
                        <td>
                          <span className={`badge badge-${(b.status || "").toLowerCase().replace("_", "-")}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {role === "PROVIDER" && b.status === "PENDING" && (
                              <>
                                <button className="btn btn-success btn-sm" onClick={() => doAction("Accepted", acceptBooking, bid)}>Accept</button>
                                <button className="btn btn-danger btn-sm" onClick={() => doAction("Rejected", rejectBooking, bid)}>Reject</button>
                              </>
                            )}
                            {role === "PROVIDER" && b.status === "ACCEPTED" && (
                              <button className="btn btn-info btn-sm" onClick={() => doAction("In Progress", inProgressBooking, bid)}>Start</button>
                            )}
                            {role === "PROVIDER" && b.status === "IN_PROGRESS" && (
                              <button className="btn btn-primary btn-sm" onClick={() => doAction("Completed", completeBooking, bid)}>Complete</button>
                            )}
                            {role === "CUSTOMER" && (b.status === "PENDING" || b.status === "ACCEPTED") && (
                              <button className="btn btn-warning btn-sm" onClick={() => doAction("Cancelled", cancelBooking, bid)}>Cancel</button>
                            )}
                            {role === "ADMIN" && (
                              <>
                                <button className="btn btn-success btn-sm" onClick={() => doAction("Accepted", acceptBooking, bid)}>Accept</button>
                                <button className="btn btn-danger btn-sm" onClick={() => doAction("Rejected", rejectBooking, bid)}>Reject</button>
                                <button className="btn btn-info btn-sm" onClick={() => doAction("In Progress", inProgressBooking, bid)}>In Progress</button>
                                <button className="btn btn-primary btn-sm" onClick={() => doAction("Completed", completeBooking, bid)}>Complete</button>
                                <button className="btn btn-warning btn-sm" onClick={() => doAction("Cancelled", cancelBooking, bid)}>Cancel</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bid)}>Delete</button>
                              </>
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
