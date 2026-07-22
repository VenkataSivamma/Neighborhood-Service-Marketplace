import { useState } from "react";
import { createBooking, updateBooking } from "../../services/bookingService";
import "../../styles/form.css";
import "../../styles/table.css";

const toDatetimeLocal = (val) => {
  if (!val) return "";
  // If already has T, strip seconds for input[datetime-local]
  const s = val.includes("T") ? val.substring(0, 16) : val;
  return s;
};

const INIT = (item) => ({
  customerId: item?.customerId || "",
  providerId: item?.providerId || "",
  serviceDescription: item?.serviceDescription || item?.serviceType || item?.serviceName || "",
  bookingDate: toDatetimeLocal(item?.bookingDate),
});

export default function BookingForm({ editItem, onClose, onSuccess }) {
  const [form, setForm] = useState(INIT(editItem));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!String(form.customerId).trim()) e.customerId = "Customer ID is required.";
    if (!String(form.providerId).trim()) e.providerId = "Provider ID is required.";
    if (!form.bookingDate) e.bookingDate = "Booking date & time is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setServerError("");
    try {
      // Backend expects: "2025-08-01T10:00:00"
      const payload = {
        ...form,
        customerId: Number(form.customerId),
        providerId: Number(form.providerId),
        bookingDate: form.bookingDate.length === 16
          ? form.bookingDate + ":00"
          : form.bookingDate,
      };
      editItem
        ? await updateBooking(editItem.id, payload)
        : await createBooking(payload);
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
          <h3>{editItem ? "Edit Booking" : "Add Booking"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && <div className="error-msg">{serverError}</div>}
            <div className="form-row">
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
            </div>
            <div className="form-group">
              <label>Service Description</label>
              <input
                value={form.serviceDescription}
                onChange={set("serviceDescription")}
                placeholder="Fix kitchen sink"
              />
            </div>
            <div className="form-group">
              <label>Booking Date &amp; Time *</label>
              <input
                type="datetime-local"
                value={form.bookingDate}
                onChange={set("bookingDate")}
              />
              {errors.bookingDate && <div className="form-error">{errors.bookingDate}</div>}
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
