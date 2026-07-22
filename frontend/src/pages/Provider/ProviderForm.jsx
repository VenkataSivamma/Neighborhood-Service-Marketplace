import { useState } from "react";
import { createProvider, updateProvider } from "../../services/providerService";
import "../../styles/form.css";
import "../../styles/table.css";

const INIT = (item) => ({
  fullName: item?.fullName || item?.name || "",
  email: item?.email || "",
  phoneNumber: item?.phoneNumber || item?.phone || "",
  city: item?.city || "",
  category: item?.category || item?.categoryName || "",
  password: "",
  status: item?.status || "PENDING",
});

export default function ProviderForm({ editItem, onClose, onSuccess }) {
  const [form, setForm] = useState(INIT(editItem));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.category.trim()) e.category = "Category is required.";
    if (!editItem && !form.password.trim()) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setServerError("");
    try {
      const payload = { ...form };
      if (editItem && !payload.password) delete payload.password;
      editItem
        ? await updateProvider(editItem.id, payload)
        : await createProvider(payload);
      onSuccess();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{editItem ? "Edit Provider" : "Add Provider"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && <div className="error-msg">{serverError}</div>}
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.fullName} onChange={set("fullName")} placeholder="Ravi Kumar" />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="ravi@gmail.com" />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="9123456789" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={form.city} onChange={set("city")} placeholder="Bangalore" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <input value={form.category} onChange={set("category")} placeholder="Plumbing" />
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={set("status")}>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{editItem ? "New Password (leave blank to keep)" : "Password *"}</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="Password" />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : editItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
