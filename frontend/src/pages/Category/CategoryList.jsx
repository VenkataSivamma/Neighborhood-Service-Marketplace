import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllCategories, deleteCategory, enableCategory, disableCategory,
} from "../../services/categoryService";
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

// ── Main CategoryList ─────────────────────────────────────────────────────────
export default function CategoryList() {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  const isAdminOnly = role !== "PROVIDER";

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

  if (role === "CUSTOMER") return <Navigate to="/dashboard" replace />;

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
                      const isActive = cat.active === true || cat.active === "true" || cat.active === 1 || (cat.status || "").toUpperCase() === "ACTIVE";
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
