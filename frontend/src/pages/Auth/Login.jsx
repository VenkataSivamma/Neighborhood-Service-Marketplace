import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer, loginProvider } from "../../services/authService";
import { getAllCustomers } from "../../services/customerService";
import { getAllProviders } from "../../services/providerService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("CUSTOMER"); // CUSTOMER | PROVIDER
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
      const res = role === "CUSTOMER"
        ? await loginCustomer({ email: form.email, password: form.password })
        : await loginProvider({ email: form.email, password: form.password });

      const data = res.data;

      // Normalize role — use the tab the user selected as source of truth
      // Backend may return "ROLE_CUSTOMER", "customer", null, etc.
      const normalizedRole = role; // "CUSTOMER" or "PROVIDER" from the tab

      const token = data.token || data.accessToken || data.jwtToken || "";
      const email = data.email || form.email;

      // Backend doesn't return ID — fetch it by matching email from the list
      let resolvedId = null;
      try {
        // Token must be in localStorage before the next API call fires
        localStorage.setItem("auth_user", JSON.stringify({ token, role: normalizedRole, email }));
        if (normalizedRole === "CUSTOMER") {
          const listRes = await getAllCustomers();
          const match = (listRes.data || []).find((c) => c.email === email);
          resolvedId = match?.id ?? match?.customerId ?? null;
        } else {
          const listRes = await getAllProviders();
          const match = (listRes.data || []).find((p) => p.email === email);
          resolvedId = match?.id ?? match?.providerId ?? null;
        }
      } catch {
        // If lookup fails, proceed without ID — pages will show appropriate errors
      }

      login({
        id: resolvedId,
        token,
        email,
        name: data.fullName || data.name || data.username || form.email,
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
                  placeholder={role === "CUSTOMER" ? "john@gmail.com" : "ravi@gmail.com"}
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
              {submitting ? "Signing in..." : `Sign In as ${role === "CUSTOMER" ? "Customer" : "Provider"}`}
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
