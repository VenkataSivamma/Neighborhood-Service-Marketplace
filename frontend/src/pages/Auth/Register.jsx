import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer, registerProvider } from "../../services/authService";
import "../../styles/auth.css";

const CUSTOMER_INIT = { fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "", city: "" };
const PROVIDER_INIT = { fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "", city: "", category: "" };

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [form, setForm] = useState(CUSTOMER_INIT);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const switchRole = (r) => {
    setRole(r);
    setForm(r === "CUSTOMER" ? CUSTOMER_INIT : PROVIDER_INIT);
    setErrors({});
    setServerError("");
    setSuccessMsg("");
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (role === "PROVIDER" && !form.category.trim()) e.category = "Category is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setServerError("");
    setSuccessMsg("");
    try {
      // Remove confirmPassword — backend doesn't need it
      const { confirmPassword, ...payload } = form;
      role === "CUSTOMER"
        ? await registerCustomer(payload)
        : await registerProvider(payload);
      setSuccessMsg("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data;
      setServerError(typeof msg === "string" ? msg : "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏘️</div>
          <h1>Create Account</h1>
          <p>Neighbourhood Service Marketplace</p>
        </div>

        <div className="auth-body">
          {/* Role tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${role === "CUSTOMER" ? "active" : ""}`}
              onClick={() => switchRole("CUSTOMER")}
            >
              👤 Customer
            </button>
            <button
              type="button"
              className={`auth-tab ${role === "PROVIDER" ? "active" : ""}`}
              onClick={() => switchRole("PROVIDER")}
            >
              🔧 Provider
            </button>
          </div>

          {serverError && <div className="auth-server-error"><span>⚠️</span> {serverError}</div>}
          {successMsg && <div className="auth-server-success"><span>✅</span> {successMsg}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row-auth">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="auth-input-wrap">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={set("fullName")}
                    placeholder="John Doe"
                    className={errors.fullName ? "input-error" : ""}
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && <div className="field-error">{errors.fullName}</div>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <div className="auth-input-wrap">
                  <span className="input-icon">📞</span>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={set("phoneNumber")}
                    placeholder="9876543210"
                    className={errors.phoneNumber ? "input-error" : ""}
                    autoComplete="tel"
                  />
                </div>
                {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
              </div>
            </div>

            <div className="form-row-auth">
              <div className="form-group">
                <label>Email Address *</label>
                <div className="auth-input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder={role === "CUSTOMER" ? "john@gmail.com" : "ravi@gmail.com"}
                    className={errors.email ? "input-error" : ""}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label>City *</label>
                <div className="auth-input-wrap">
                  <span className="input-icon">🏙️</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={set("city")}
                    placeholder="Chennai"
                    className={errors.city ? "input-error" : ""}
                  />
                </div>
                {errors.city && <div className="field-error">{errors.city}</div>}
              </div>
            </div>

            {/* Provider-only field */}
            {role === "PROVIDER" && (
              <div className="form-group">
                <label>Service Category *</label>
                <div className="auth-input-wrap">
                  <span className="input-icon">🔧</span>
                  <input
                    type="text"
                    value={form.category}
                    onChange={set("category")}
                    placeholder="e.g. Plumbing, Electrical"
                    className={errors.category ? "input-error" : ""}
                  />
                </div>
                {errors.category && <div className="field-error">{errors.category}</div>}
              </div>
            )}

            <div className="form-row-auth">
              <div className="form-group">
                <label>Password *</label>
                <div className="auth-input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Min. 6 characters"
                    className={errors.password ? "input-error" : ""}
                    autoComplete="new-password"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="auth-input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    placeholder="Repeat password"
                    className={errors.confirmPassword ? "input-error" : ""}
                    autoComplete="new-password"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Creating Account..." : `Register as ${role === "CUSTOMER" ? "Customer" : "Provider"}`}
            </button>
          </form>

          <div className="auth-divider">
            Already have an account?
            <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
