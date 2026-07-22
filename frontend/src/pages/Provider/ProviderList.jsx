import { useState, useEffect } from "react";
import {
  getAllProviders, deleteProvider, approveProvider, rejectProvider, suspendProvider,
  getProvidersByCategory, getProvidersByCity,
} from "../../services/providerService";
import ProviderForm from "./ProviderForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import "../../styles/table.css";

const PAGE_SIZE = 8;

export default function ProviderList() {
  const [providers, setProviders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [catSearch, setCatSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
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
      const res = await getAllProviders();
      const data = Array.isArray(res.data) ? res.data : [];
      setProviders(data);
      setFiltered(data);
    } catch {
      setError("Failed to load providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = providers;
    if (nameSearch) data = data.filter((p) => (p.fullName || p.name || p.businessName || "").toLowerCase().includes(nameSearch.toLowerCase()));
    setFiltered(data);
    setPage(1);
  }, [nameSearch, providers]);

  const searchByCategory = async () => {
    if (!catSearch.trim()) { load(); return; }
    try {
      setLoading(true);
      const res = await getProvidersByCategory(catSearch.trim());
      const data = Array.isArray(res.data) ? res.data : [];
      setProviders(data); setFiltered(data);
    } catch { setError("Category search failed."); }
    finally { setLoading(false); }
  };

  const searchByCity = async () => {
    if (!citySearch.trim()) { load(); return; }
    try {
      setLoading(true);
      const res = await getProvidersByCity(citySearch.trim());
      const data = Array.isArray(res.data) ? res.data : [];
      setProviders(data); setFiltered(data);
    } catch { setError("City search failed."); }
    finally { setLoading(false); }
  };

  const doAction = (label, fn, id) => {
    setConfirmAction({
      message: `${label} this provider?`,
      onConfirm: async () => {
        try {
          await fn(id);
          setToast({ message: `Provider ${label.toLowerCase()}d.`, type: "success" });
          load();
        } catch { setToast({ message: "Action failed.", type: "error" }); }
        setConfirmAction(null);
      },
    });
  };

  const handleDelete = (id) => {
    setConfirmAction({
      message: "Delete this provider?",
      onConfirm: async () => {
        try {
          await deleteProvider(id);
          setToast({ message: "Provider deleted.", type: "success" });
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
      <h1 className="page-heading">Providers</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>All Providers ({filtered.length})</h2>
          <div className="table-actions">
            <SearchBar value={nameSearch} onChange={setNameSearch} placeholder="Search by name..." />
            <SearchBar value={catSearch} onChange={setCatSearch} placeholder="Category..." />
            <button className="btn btn-info btn-sm" onClick={searchByCategory}>Search</button>
            <SearchBar value={citySearch} onChange={setCitySearch} placeholder="City..." />
            <button className="btn btn-info btn-sm" onClick={searchByCity}>Search</button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setCatSearch(""); setCitySearch(""); setNameSearch(""); load(); }}>Reset</button>
            <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowForm(true); }}>+ Add Provider</button>
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
                    <th>Email</th>
                    <th>Category</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">🔧</div><p>No providers found</p></div></td></tr>
                  ) : (
                    paginated.map((p, i) => (
                      <tr key={p.id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td><strong>{p.fullName || p.name || p.businessName || "—"}</strong></td>
                        <td>{p.email || "—"}</td>
                        <td>{p.category || p.categoryName || "—"}</td>
                        <td>{p.city || "—"}</td>
                        <td><span className={`badge badge-${p.status?.toLowerCase()}`}>{p.status || "—"}</span></td>
                        <td>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <button className="btn btn-success btn-sm" onClick={() => doAction("Approve", approveProvider, p.id)}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => doAction("Reject", rejectProvider, p.id)}>Reject</button>
                            <button className="btn btn-warning btn-sm" onClick={() => doAction("Suspend", suspendProvider, p.id)}>Suspend</button>
                            <button className="btn btn-info btn-sm" onClick={() => { setEditItem(p); setShowForm(true); }}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                          </div>
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

      {showForm && (
        <ProviderForm
          editItem={editItem}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); load(); setToast({ message: editItem ? "Provider updated." : "Provider created.", type: "success" }); }}
        />
      )}
      {confirmAction && <ConfirmDialog message={confirmAction.message} onConfirm={confirmAction.onConfirm} onCancel={() => setConfirmAction(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
