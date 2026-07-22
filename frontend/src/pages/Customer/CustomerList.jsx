import { useState, useEffect } from "react";
import { getAllCustomers, deleteCustomer, getCustomersByCity } from "../../services/customerService";
import CustomerForm from "./CustomerForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast";
import "../../styles/table.css";

const PAGE_SIZE = 8;

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
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
      const res = await getAllCustomers();
      const data = Array.isArray(res.data) ? res.data : [];
      setCustomers(data);
      setFiltered(data);
    } catch {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = customers;
    if (nameSearch) data = data.filter((c) => (c.fullName || c.name || "").toLowerCase().includes(nameSearch.toLowerCase()));
    setFiltered(data);
    setPage(1);
  }, [nameSearch, customers]);

  const handleCitySearch = async () => {
    if (!citySearch.trim()) { load(); return; }
    try {
      setLoading(true);
      const res = await getCustomersByCity(citySearch.trim());
      const data = Array.isArray(res.data) ? res.data : [];
      setCustomers(data);
      setFiltered(data);
    } catch {
      setError("City search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmAction({
      message: "Delete this customer?",
      onConfirm: async () => {
        try {
          await deleteCustomer(id);
          setToast({ message: "Customer deleted.", type: "success" });
          load();
        } catch {
          setToast({ message: "Delete failed.", type: "error" });
        }
        setConfirmAction(null);
      },
    });
  };

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div>
      <h1 className="page-heading">Customers</h1>
      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>All Customers ({filtered.length})</h2>
          <div className="table-actions">
            <SearchBar value={nameSearch} onChange={setNameSearch} placeholder="Search by name..." />
            <SearchBar value={citySearch} onChange={setCitySearch} placeholder="Search by city..." />
            <button className="btn btn-info btn-sm" onClick={handleCitySearch}>Search City</button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setCitySearch(""); setNameSearch(""); load(); }}>Reset</button>
            <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowForm(true); }}>+ Add Customer</button>
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
                    <th>Phone</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">👥</div><p>No customers found</p></div></td></tr>
                  ) : (
                    paginated.map((c, i) => {
                      const cid = c.customerId || c.id;
                      return (
                      <tr key={cid}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td><strong>{c.fullName || c.name || "—"}</strong></td>
                        <td>{c.email || "—"}</td>
                        <td>{c.phoneNumber || c.phone || "—"}</td>
                        <td>{c.city || "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-info btn-sm" onClick={() => { setEditItem(c); setShowForm(true); }}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cid)}>Delete</button>
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

      {showForm && (
        <CustomerForm
          editItem={editItem}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); load(); setToast({ message: editItem ? "Customer updated." : "Customer created.", type: "success" }); }}
        />
      )}
      {confirmAction && <ConfirmDialog message={confirmAction.message} onConfirm={confirmAction.onConfirm} onCancel={() => setConfirmAction(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
