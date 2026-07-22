import { useState, useEffect } from "react";
import { getAllReviews, deleteReview, getReviewsByCustomer, getReviewsByProvider } from "../../services/reviewService";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import "../../styles/table.css";

const PAGE_SIZE = 8;

export default function ReviewList() {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  const uid = user?.id ?? user?.customerId ?? user?.providerId ?? null;
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [customerFilter, setCustomerFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "CUSTOMER" && uid) res = await getReviewsByCustomer(uid);
      else if (role === "PROVIDER" && uid) res = await getReviewsByProvider(uid);
      else res = await getAllReviews();
      const data = Array.isArray(res.data) ? res.data : [];
      setReviews(data); setFiltered(data);
    } catch { setError("Failed to load reviews."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filterByCustomer = async () => {
    if (!customerFilter.trim()) { load(); return; }
    try {
      setLoading(true);
      const res = await getReviewsByCustomer(customerFilter.trim());
      const data = Array.isArray(res.data) ? res.data : [];
      setReviews(data); setFiltered(data);
    } catch { setError("Customer filter failed."); }
    finally { setLoading(false); }
  };

  const filterByProvider = async () => {
    if (!providerFilter.trim()) { load(); return; }
    try {
      setLoading(true);
      const res = await getReviewsByProvider(providerFilter.trim());
      const data = Array.isArray(res.data) ? res.data : [];
      setReviews(data); setFiltered(data);
    } catch { setError("Provider filter failed."); }
    finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    setConfirmAction({
      message: "Delete this review?",
      onConfirm: async () => {
        try {
          await deleteReview(id);
          setToast({ message: "Review deleted.", type: "success" });
          load();
        } catch { setToast({ message: "Delete failed.", type: "error" }); }
        setConfirmAction(null);
      },
    });
  };

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="page-heading">Reviews</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>{role === "CUSTOMER" ? "My Reviews" : role === "PROVIDER" ? "Reviews About Me" : "All Reviews"} ({filtered.length})</h2>
          <div className="table-actions">
            {role === "ADMIN" && (
              <>
                <SearchBar value={customerFilter} onChange={setCustomerFilter} placeholder="Customer ID..." />
                <button className="btn btn-info btn-sm" onClick={filterByCustomer}>Filter</button>
                <SearchBar value={providerFilter} onChange={setProviderFilter} placeholder="Provider ID..." />
                <button className="btn btn-info btn-sm" onClick={filterByProvider}>Filter</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setCustomerFilter(""); setProviderFilter(""); load(); }}>Reset</button>
              </>
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
                    <th>Customer</th>
                    <th>Provider</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">⭐</div><p>No reviews found</p></div></td></tr>
                  ) : (
                    paginated.map((r, i) => {
                      const rid = r.reviewId || r.id;
                      return (
                      <tr key={rid}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td>{r.customerName || r.customerId || "—"}</td>
                        <td>{r.providerName || r.providerId || "—"}</td>
                        <td>{"⭐".repeat(Math.min(r.rating || 0, 5))} <span style={{ color: "#718096", fontSize: 12 }}>({r.rating})</span></td>
                        <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</td>
                        <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                        <td>
                          {role === "ADMIN" && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rid)}>Delete</button>
                          )}
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
