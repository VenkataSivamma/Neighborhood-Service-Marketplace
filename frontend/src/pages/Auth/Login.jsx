import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer, loginProvider, loginAdmin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("CUSTOMER"); // CUSTOMER | PROVIDER | ADMIN
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setServerError("");
    try {
      const res = role === "ADMIN"
        ? await loginAdmin({ email: form.email, password: form.password })
        : role === "CUSTOMER"
        ? await loginCustomer({ email: form.email, password: form.password })
        : await loginProvider({ email: form.email, password: form.password });

      const data = res.data;
      const token = data.token || "";
      const email = data.email || form.email;
      const resolvedId = data.id ?? null;

      // Normalize role: backend returns "ROLE_CUSTOMER", strip prefix
      const rawRole = (data.role || role).toUpperCase();
      const normalizedRole = rawRole.includes("PROVIDER") ? "PROVIDER"
        : rawRole.includes("CUSTOMER") ? "CUSTOMER"
        : rawRole.includes("ADMIN") ? "ADMIN"
        : role;

      login({
        id: resolvedId,
        token,
        email,
        name: data.fullName || data.name || email,
        role: normalizedRole,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data;
      setServerError(typeof msg === "string" ? msg : "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏘️</div>
          <h1>Welcome Back</h1>
          <p>Neighbourhood Service Marketplace</p>
        </div>

        <div className="auth-body">
          {/* Role tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${role === "CUSTOMER" ? "active" : ""}`}
              onClick={() => { setRole("CUSTOMER"); setServerError(""); setErrors({}); }}
            >
              👤 Customer
            </button>
            <button
              type="button"
              className={`auth-tab ${role === "PROVIDER" ? "active" : ""}`}
              onClick={() => { setRole("PROVIDER"); setServerError(""); setErrors({}); }}
            >
              🔧 Provider
            </button>
            <button
              type="button"
              className={`auth-tab ${role === "ADMIN" ? "active" : ""}`}
              onClick={() => { setRole("ADMIN"); setServerError(""); setErrors({}); }}
            >
              🛡️ Admin
            </button>
          </div>

          {serverError && (
            <div className="auth-server-error">
              <span>⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder={role === "ADMIN" ? "admin@marketplace.com" : role === "CUSTOMER" ? "john@gmail.com" : "ravi@gmail.com"}
                  className={errors.email ? "input-error" : ""}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Enter your password"
                  className={errors.password ? "input-error" : ""}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Signing in..." : `Sign In as ${role === "CUSTOMER" ? "Customer" : role === "PROVIDER" ? "Provider" : "Admin"}`}
            </button>
          </form>

          <div className="auth-divider">
            Don&apos;t have an account?
            <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
