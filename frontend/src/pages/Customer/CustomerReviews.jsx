import { useState, useEffect } from "react";
import { getReviewsByCustomer, createReview, updateReview, deleteReview } from "../../services/reviewService";
import { getBookingsByCustomer } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import "../../styles/table.css";
import "../../styles/form.css";

const PAGE_SIZE = 8;
const STARS = [1, 2, 3, 4, 5];

function ReviewModal({ booking, existingReview, customerId, onClose, onSuccess }) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setSubmitting(true);
    setError("");
    try {
      if (existingReview) {
        await updateReview(existingReview.id, { rating, comment });
      } else {
        await createReview({
          customerId: Number(customerId),
          providerId: Number(booking.providerId),
          bookingId: Number(booking.id),
          rating,
          comment,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{existingReview ? "Edit Review" : "Write a Review"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-msg">{error}</div>}
            <div className="form-group">
              <label>Provider</label>
              <input value={booking?.providerName || booking?.providerId || "—"} disabled />
            </div>
            <div className="form-group">
              <label>Rating *</label>
              <div style={{ display: "flex", gap: 8, fontSize: 28 }}>
                {STARS.map((s) => (
                  <span
                    key={s}
                    style={{ cursor: "pointer", color: s <= rating ? "#f6ad55" : "#e2e8f0" }}
                    onClick={() => setRating(s)}
                  >★</span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Comment *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience..."
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : existingReview ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const { user } = useAuth();
  const uid = user?.id ?? user?.customerId ?? null;

  const [reviews, setReviews] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [reviewModal, setReviewModal] = useState(null); // { booking, existingReview }
  const [page, setPage] = useState(1);

  const load = async () => {
    if (!uid) { setLoading(false); return; }
    setLoading(true);
    try {
      const [rRes, bRes] = await Promise.allSettled([
        getReviewsByCustomer(uid),
        getBookingsByCustomer(uid),
      ]);
      const reviewData = rRes.status === "fulfilled" && Array.isArray(rRes.value?.data) ? rRes.value.data : [];
      const bookingData = bRes.status === "fulfilled" && Array.isArray(bRes.value?.data) ? bRes.value.data : [];
      setReviews(reviewData);
      setCompletedBookings(bookingData.filter((b) => b.status === "COMPLETED"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [uid]);

  const handleDelete = (id) => {
    setConfirmAction({
      message: "Delete this review?",
      onConfirm: async () => {
        try {
          await deleteReview(id);
          setToast({ message: "Review deleted.", type: "success" });
          load();
        } catch {
          setToast({ message: "Delete failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  // Find bookings that don't have a review yet
  const reviewedBookingIds = new Set(reviews.map((r) => r.bookingId));
  const unreviewedBookings = completedBookings.filter((b) => !reviewedBookingIds.has(b.id));

  const paginated = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="page-heading">My Reviews</h1>

      {/* Completed bookings awaiting review */}
      {unreviewedBookings.length > 0 && (
        <div className="table-container" style={{ marginBottom: 24 }}>
          <div className="table-header">
            <h2>Completed Services — Awaiting Review ({unreviewedBookings.length})</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Provider</th><th>Service</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {unreviewedBookings.map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{b.providerName || b.providerId || "—"}</td>
                    <td>{b.serviceDescription || "—"}</td>
                    <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "—"}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => setReviewModal({ booking: b, existingReview: null })}>
                        ✍️ Write Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* My submitted reviews */}
      <div className="table-container">
        <div className="table-header">
          <h2>My Reviews ({reviews.length})</h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Provider</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">⭐</div><p>No reviews yet</p></div></td></tr>
              ) : (
                paginated.map((r, i) => {
                  const booking = completedBookings.find((b) => b.id === r.bookingId);
                  return (
                    <tr key={r.id}>
                      <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td>{r.providerName || r.providerId || "—"}</td>
                      <td>{"⭐".repeat(Math.min(r.rating || 0, 5))} <span style={{ color: "#718096", fontSize: 12 }}>({r.rating})</span></td>
                      <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</td>
                      <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-info btn-sm" onClick={() => setReviewModal({ booking: booking || { providerId: r.providerId, providerName: r.providerName }, existingReview: r })}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
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
      </div>

      {reviewModal && (
        <ReviewModal
          booking={reviewModal.booking}
          existingReview={reviewModal.existingReview}
          customerId={uid}
          onClose={() => setReviewModal(null)}
          onSuccess={() => { setReviewModal(null); load(); setToast({ message: "Review saved.", type: "success" }); }}
        />
      )}
      {confirmAction && <ConfirmDialog message={confirmAction.message} onConfirm={confirmAction.onConfirm} onCancel={() => setConfirmAction(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
