import { useState, useEffect } from "react";
import { getAllProviders, getProvidersByCategory, getProvidersByCity } from "../../services/providerService";
import { getAllCategories } from "../../services/categoryService";
import { createBooking } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import "../../styles/table.css";
import "../../styles/form.css";

const PAGE_SIZE = 8;

function BookingModal({ provider, customerId, onClose, onSuccess }) {
  const [form, setForm] = useState({ serviceDescription: "", bookingDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) { setError("Session error: please log out and log in again."); return; }
    if (!form.bookingDate) { setError("Please select a date & time."); return; }
    setSubmitting(true);
    setError("");
    try {
      await createBooking({
        customerId: Number(customerId),
        providerId: Number(provider.providerId || provider.id),
        serviceDescription: form.serviceDescription,
        bookingDate: form.bookingDate.length === 16 ? form.bookingDate + ":00" : form.bookingDate,
        paymentMethod: "CASH_ON_DELIVERY",
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Book — {provider.fullName || provider.name}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-msg">{error}</div>}
            <div className="form-group">
              <label>Provider</label>
              <input value={provider.fullName || provider.name || "—"} disabled />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input value={provider.category || provider.categoryName || "—"} disabled />
            </div>
            <div className="form-group">
              <label>City</label>
              <input value={provider.city || "—"} disabled />
            </div>
            <div className="form-group">
              <label>Describe the work needed</label>
              <input
                value={form.serviceDescription}
                onChange={(e) => setForm({ ...form, serviceDescription: e.target.value })}
                placeholder="e.g. Fix kitchen sink, paint living room..."
              />
            </div>
            <div className="form-group">
              <label>Preferred Date &amp; Time *</label>
              <input
                type="datetime-local"
                value={form.bookingDate}
                onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <input value="Cash on Delivery" disabled />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Booking Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SearchServices() {
  const { user } = useAuth();
  const uid = user?.id || user?.customerId || null;

  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [bookingProvider, setBookingProvider] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getAllCategories()
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.content) ? raw.content : [];
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  const load = async (cat = "", cty = "") => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (cat) res = await getProvidersByCategory(cat);
      else if (cty) res = await getProvidersByCity(cty);
      else res = await getAllProviders();
      const all = Array.isArray(res.data) ? res.data : [];
      setProviders(all.filter((p) => (p.status || "").toUpperCase() === "APPROVED"));
      setPage(1);
    } catch {
      setError("Failed to load providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => load(category, city);
  const handleReset = () => { setCategory(""); setCity(""); setNameSearch(""); load(); };

  const displayed = nameSearch
    ? providers.filter((p) => (p.fullName || p.name || "").toLowerCase().includes(nameSearch.toLowerCase()))
    : providers;

  const paginated = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(displayed.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="page-heading">Search Services</h1>
      {error && <div className="error-msg">{error}</div>}

      {/* Search filters */}
      <div className="table-container" style={{ marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="form-group" style={{ margin: 0, minWidth: 180 }}>
            <label style={{ fontSize: 13, marginBottom: 4, display: "block" }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 14, width: "100%" }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.categoryId || c.id} value={c.categoryName || c.name}>
                  {c.categoryName || c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, minWidth: 160 }}>
            <label style={{ fontSize: 13, marginBottom: 4, display: "block" }}>City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Chennai"
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 14 }}
            />
          </div>
          <div className="form-group" style={{ margin: 0, minWidth: 160 }}>
            <label style={{ fontSize: 13, marginBottom: 4, display: "block" }}>Provider Name</label>
            <input
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search by name..."
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 14 }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} style={{ alignSelf: "flex-end" }}>🔍 Search</button>
          <button className="btn btn-secondary" onClick={handleReset} style={{ alignSelf: "flex-end" }}>Reset</button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Available Providers ({displayed.length})</h2>
        </div>
        {loading ? <Loader /> : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>City</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">🔧</div><p>No providers found</p></div></td></tr>
                  ) : (
                    paginated.map((p, i) => (
                      <tr key={p.providerId || p.id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td><strong>{p.fullName || p.name || "—"}</strong></td>
                        <td>{p.category || p.categoryName || "—"}</td>
                        <td>{p.city || "—"}</td>
                        <td>
                          <button className="btn btn-primary btn-sm" onClick={() => setBookingProvider(p)}>
                            Book
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {bookingProvider && (
        <BookingModal
          provider={bookingProvider}
          customerId={uid}
          onClose={() => setBookingProvider(null)}
          onSuccess={() => {
            setBookingProvider(null);
            setToast({ message: "Booking request sent! Waiting for provider to accept.", type: "success" });
          }}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
