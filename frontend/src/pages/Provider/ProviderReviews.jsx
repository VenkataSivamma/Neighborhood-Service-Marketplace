import { useState, useEffect } from "react";
import { getReviewsByProvider } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import "../../styles/table.css";

const PAGE_SIZE = 8;

export default function ProviderReviews() {
  const { user } = useAuth();
  const uid = user?.id ?? user?.providerId ?? null;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    getReviewsByProvider(uid)
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uid]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "—";

  const paginated = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="page-heading">My Reviews</h1>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h3>Total Reviews</h3>
          <div className="stat-value">{reviews.length}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">🌟</div>
          <h3>Average Rating</h3>
          <div className="stat-value">{avgRating}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Reviews Received ({reviews.length})</h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Date</th></tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">⭐</div><p>No reviews yet</p></div></td></tr>
              ) : (
                paginated.map((r, i) => (
                  <tr key={r.id}>
                    <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td>{r.customerName || r.customerId || "—"}</td>
                    <td>{"⭐".repeat(Math.min(r.rating || 0, 5))} <span style={{ color: "#718096", fontSize: 12 }}>({r.rating})</span></td>
                    <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</td>
                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
