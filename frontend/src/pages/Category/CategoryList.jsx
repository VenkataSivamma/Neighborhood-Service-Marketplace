import { useState, useEffect } from "react";
import {
  getAllCategories, deleteCategory, enableCategory, disableCategory,
} from "../../services/categoryService";
import { getProvidersByCategory } from "../../services/providerService";
import { createBooking } from "../../services/bookingService";
import CategoryForm from "./CategoryForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import "../../styles/table.css";
import "../../styles/form.css";

const PAGE_SIZE = 8;

// ── Booking request modal for customer ───────────────────────────────────────
function BookingRequestModal({ provider, customerId, onClose, onSuccess }) {
  const [form, setForm] = useState({ serviceDescription: "", bookingDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookingDate) { setError("Please select a date & time."); return; }
    setSubmitting(true);
    setError("");
    try {
      await createBooking({
        customerId: Number(customerId),
        providerId: Number(provider.id),
        serviceDescription: form.serviceDescription,
        bookingDate: form.bookingDate.length === 16 ? form.bookingDate + ":00" : form.bookingDate,
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
          <h3>Request Service from {provider.fullName || provider.name}</h3>
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
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Provider list for a selected category ────────────────────────────────────
function ProviderPickerView({ categoryName, customerId, onBack, onRequestSent }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getProvidersByCategory(categoryName)
      .then((res) => setProviders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <div>
      <h1 className="page-heading">Categories</h1>
      <div className="table-container">
        <div className="table-header">
          <h2>Providers — {categoryName}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back to Categories</button>
        </div>
        {loading ? <Loader /> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-icon">👷</div>
                        <p>No providers available in this category</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  providers.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td><strong>{p.fullName || p.name || "—"}</strong></td>
                      <td>{p.email || "—"}</td>
                      <td>{p.city || "—"}</td>
                      <td>
                        <span className={`badge badge-${(p.status || "").toLowerCase()}`}>
                          {p.status || "—"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={p.status !== "APPROVED"}
                          title={p.status !== "APPROVED" ? "Provider not available" : "Send booking request"}
                          onClick={() => setSelectedProvider(p)}
                        >
                          Request
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedProvider && (
        <BookingRequestModal
          provider={selectedProvider}
          customerId={customerId}
          onClose={() => setSelectedProvider(null)}
          onSuccess={() => {
            setSelectedProvider(null);
            setToast({ message: "Booking request sent! Waiting for provider to accept.", type: "success" });
            onRequestSent?.();
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Category icons map ───────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  plumbing: "🔧", electrical: "⚡", cleaning: "🧹", painting: "🎨",
  carpentry: "🪚", gardening: "🌿", moving: "📦", security: "🔒",
  cooking: "🍳", tutoring: "📚", default: "🏷️",
};
function getCategoryIcon(name = "") {
  const key = name.toLowerCase();
  return Object.entries(CATEGORY_ICONS).find(([k]) => key.includes(k))?.[1] || CATEGORY_ICONS.default;
}

// ── Category picker modal ─────────────────────────────────────────────────────
function CategoryPickerModal({ onSelect, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllCategories()
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.content) ? raw.content
          : Array.isArray(raw?.data) ? raw.data
          : [];
        setCategories(list);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load categories."))
      .finally(() => setLoading(false));
  }, []);

  const active = categories.filter((c) => c.active === true);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏷️ Choose a Category</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: "20px 24px" }}>
          {loading && <Loader />}
          {error && <div className="error-msg">{error}</div>}
          {!loading && !error && active.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <p>No active categories found</p>
            </div>
          )}
          {!loading && active.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
              {active.map((cat) => (
                <button
                  key={cat.categoryId}
                  onClick={() => onSelect(cat)}
                  style={{
                    background: "#f7fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "16px 10px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1a3c6e"; e.currentTarget.style.background = "#ebf0fa"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f7fafc"; }}
                >
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{getCategoryIcon(cat.categoryName || cat.name)}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1a3c6e" }}>{cat.categoryName || cat.name}</div>
                  {cat.description && (
                    <div style={{ fontSize: 11, color: "#718096", marginTop: 4, lineHeight: 1.4 }}>
                      {cat.description.length > 45 ? cat.description.slice(0, 45) + "…" : cat.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Customer-only view ────────────────────────────────────────────────────────
function CustomerCategoryView({ uid }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (selectedCategory) {
    return (
      <ProviderPickerView
        categoryName={selectedCategory.categoryName || selectedCategory.name}
        customerId={uid}
        onBack={() => setSelectedCategory(null)}
        onRequestSent={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <div>
      <h1 className="page-heading">Categories</h1>
      <div className="table-container">
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏘️</div>
          <h2 style={{ color: "#1a3c6e", marginBottom: 8, fontSize: 20 }}>Find a Service Provider</h2>
          <p style={{ color: "#718096", marginBottom: 28, fontSize: 14 }}>
            Browse available categories and send a booking request to a provider near you.
          </p>
          <button
            className="btn btn-primary"
            style={{ padding: "10px 28px", fontSize: 15 }}
            onClick={() => setShowPicker(true)}
          >
            🏷️ Choose a Category
          </button>
        </div>
      </div>

      {showPicker && (
        <CategoryPickerModal
          onSelect={(cat) => { setSelectedCategory(cat); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// ── Main CategoryList ─────────────────────────────────────────────────────────
export default function CategoryList() {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  const isAdminOnly = role !== "CUSTOMER" && role !== "PROVIDER";
  const uid = user?.id || user?.customerId || user?.providerId;

  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
      setFiltered(data);
    } catch {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(categories.filter((c) => (c.categoryName || c.name || "").toLowerCase().includes(q)));
    setPage(1);
  }, [search, categories]);

  const handleDelete = (categoryId) => {
    setConfirmAction({
      message: "Are you sure you want to delete this category?",
      onConfirm: async () => {
        try {
          await deleteCategory(categoryId);
          setToast({ message: "Category deleted.", type: "success" });
          load();
        } catch {
          setToast({ message: "Delete failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  const handleToggle = (cat) => {
    const isActive = cat.active === true;
    setConfirmAction({
      message: `${isActive ? "Disable" : "Enable"} this category?`,
      onConfirm: async () => {
        try {
          isActive ? await disableCategory(cat.categoryId) : await enableCategory(cat.categoryId);
          setToast({ message: `Category ${isActive ? "disabled" : "enabled"}.`, type: "success" });
          load();
        } catch {
          setToast({ message: "Action failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  if (role === "CUSTOMER") return <CustomerCategoryView uid={uid} />;

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="page-heading">Categories</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>All Categories ({filtered.length})</h2>
          <div className="table-actions">
            <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
            {isAdminOnly && (
              <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowForm(true); }}>
                + Add Category
              </button>
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
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    {isAdminOnly && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={isAdminOnly ? 5 : 4}>
                        <div className="empty-state">
                          <div className="empty-icon">🏷️</div>
                          <p>No categories found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((cat, i) => {
                      const isActive = cat.active === true;
                      return (
                        <tr key={cat.categoryId}>
                          <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                          <td><strong>{cat.categoryName || cat.name}</strong></td>
                          <td>{cat.description || "—"}</td>
                          <td>
                            <span className={`badge ${isActive ? "badge-active" : "badge-inactive"}`}>
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          {isAdminOnly && (
                            <td>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                <button className="btn btn-info btn-sm" onClick={(e) => { e.stopPropagation(); setEditItem(cat); setShowForm(true); }}>Edit</button>
                                <button className={`btn btn-sm ${isActive ? "btn-warning" : "btn-success"}`} onClick={(e) => { e.stopPropagation(); handleToggle(cat); }}>
                                  {isActive ? "Disable" : "Enable"}
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(cat.categoryId); }}>Delete</button>
                              </div>
                            </td>
                          )}
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

      {isAdminOnly && showForm && (
        <CategoryForm
          editItem={editItem}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            load();
            setToast({ message: editItem ? "Category updated." : "Category created.", type: "success" });
          }}
        />
      )}

      {isAdminOnly && confirmAction && (
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
