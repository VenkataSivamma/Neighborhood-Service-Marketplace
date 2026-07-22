import { useState } from "react";
import { createNotification } from "../../services/notificationService";
import { sendNotificationToCustomers, sendNotificationToProviders } from "../../services/adminService";
import "../../styles/form.css";
import "../../styles/table.css";

export default function NotificationForm({ onClose, onSuccess }) {
  const [recipientType, setRecipientType] = useState("CUSTOMER"); // CUSTOMER | PROVIDER | ALL_CUSTOMERS | ALL_PROVIDERS
  const [form, setForm] = useState({ customerId: "", providerId: "", message: "", read: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.message.trim()) e.message = "Message is required.";
    if (recipientType === "CUSTOMER" && !String(form.customerId).trim()) e.customerId = "Customer ID is required.";
    if (recipientType === "PROVIDER" && !String(form.providerId).trim()) e.providerId = "Provider ID is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setServerError("");
    try {
      if (recipientType === "ALL_CUSTOMERS") {
        // POST /admin/notifications/customers
        await sendNotificationToCustomers({ message: form.message, read: false });
      } else if (recipientType === "ALL_PROVIDERS") {
        // POST /admin/notifications/providers
        await sendNotificationToProviders({ message: form.message, read: false });
      } else if (recipientType === "CUSTOMER") {
        // POST /notifications  { customerId, providerId: null, message, read }
        await createNotification({
          customerId: Number(form.customerId),
          providerId: null,
          message: form.message,
          read: false,
        });
      } else {
        // PROVIDER
        await createNotification({
          customerId: null,
          providerId: Number(form.providerId),
          message: form.message,
          read: false,
        });
      }
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
          <h3>Send Notification</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && <div className="error-msg">{serverError}</div>}

            <div className="form-group">
              <label>Send To</label>
              <select value={recipientType} onChange={(e) => { setRecipientType(e.target.value); setErrors({}); }}>
                <option value="CUSTOMER">Individual Customer</option>
                <option value="PROVIDER">Individual Provider</option>
                <option value="ALL_CUSTOMERS">All Customers</option>
                <option value="ALL_PROVIDERS">All Providers</option>
              </select>
            </div>

            {recipientType === "CUSTOMER" && (
              <div className="form-group">
                <label>Customer ID *</label>
                <input
                  type="number"
                  value={form.customerId}
                  onChange={set("customerId")}
                  placeholder="1"
                />
                {errors.customerId && <div className="form-error">{errors.customerId}</div>}
              </div>
            )}

            {recipientType === "PROVIDER" && (
              <div className="form-group">
                <label>Provider ID *</label>
                <input
                  type="number"
                  value={form.providerId}
                  onChange={set("providerId")}
                  placeholder="1"
                />
                {errors.providerId && <div className="form-error">{errors.providerId}</div>}
              </div>
            )}

            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={form.message}
                onChange={set("message")}
                placeholder="Your booking has been confirmed"
                rows={4}
              />
              {errors.message && <div className="form-error">{errors.message}</div>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
