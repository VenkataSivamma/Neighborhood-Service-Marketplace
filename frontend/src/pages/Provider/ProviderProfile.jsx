import { useState, useEffect } from "react";
import { getProviderById, updateProvider } from "../../services/providerService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import Toast from "../../components/Toast";
import "../../styles/form.css";

export default function ProviderProfile() {
  const { user, login } = useAuth();
  const uid = user?.id ?? user?.providerId ?? null;

  const [form, setForm] = useState({ fullName: "", email: "", phoneNumber: "", city: "", category: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    getProviderById(uid)
      .then((res) => {
        const d = res.data;
        setForm({
          fullName: d.fullName || d.name || "",
          email: d.email || "",
          phoneNumber: d.phoneNumber || d.phone || "",
          city: d.city || "",
          category: d.category || d.categoryName || "",
        });
      })
      .catch(() => setToast({ message: "Failed to load profile.", type: "error" }))
      .finally(() => setLoading(false));
  }, [uid]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setPass = (field) => (e) => setPasswordForm({ ...passwordForm, [field]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Name is required.";
    if (!form.phoneNumber.trim()) errs.phoneNumber = "Phone is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.category.trim()) errs.category = "Category is required.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await updateProvider(uid, form);
      login({ ...user, name: form.fullName });
      setToast({ message: "Profile updated successfully.", type: "success" });
      setErrors({});
    } catch {
      setToast({ message: "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.newPassword) errs.newPassword = "Password is required.";
    else if (passwordForm.newPassword.length < 6) errs.newPassword = "Minimum 6 characters.";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await updateProvider(uid, { ...form, password: passwordForm.newPassword });
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      setToast({ message: "Password changed successfully.", type: "success" });
      setErrors({});
    } catch {
      setToast({ message: "Failed to change password.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="page-heading">My Profile</h1>

      <div className="table-container" style={{ marginBottom: 24 }}>
        <div className="table-header"><h2>Profile Information</h2></div>
        <div style={{ padding: "24px" }}>
          <form onSubmit={handleProfileSave}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.fullName} onChange={set("fullName")} placeholder="Your name" />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={form.email} disabled style={{ background: "#f7fafc" }} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="9876543210" />
                {errors.phoneNumber && <div className="form-error">{errors.phoneNumber}</div>}
              </div>
              <div className="form-group">
                <label>City *</label>
                <input value={form.city} onChange={set("city")} placeholder="Chennai" />
                {errors.city && <div className="form-error">{errors.city}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Service Category *</label>
              <input value={form.category} onChange={set("category")} placeholder="e.g. Plumbing" />
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header"><h2>Change Password</h2></div>
        <div style={{ padding: "24px" }}>
          <form onSubmit={handlePasswordSave}>
            <div className="form-row">
              <div className="form-group">
                <label>New Password *</label>
                <input type="password" value={passwordForm.newPassword} onChange={setPass("newPassword")} placeholder="Min. 6 characters" />
                {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={setPass("confirmPassword")} placeholder="Repeat password" />
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
