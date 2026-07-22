import { useState } from "react";
import { createCategory, updateCategory } from "../../services/categoryService";
import "../../styles/form.css";
import "../../styles/table.css";

export default function CategoryForm({ editItem, onClose, onSuccess }) {
  const [form, setForm] = useState({
    categoryName: editItem?.categoryName || editItem?.name || "",
    description: editItem?.description || "",
    active: editItem?.active ?? true,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.categoryName.trim()) e.categoryName = "Category name is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setServerError("");
    try {
      editItem
        ? await updateCategory(editItem.categoryId || editItem.id, form)
        : await createCategory(form);
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
          <h3>{editItem ? "Edit Category" : "Add Category"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && <div className="error-msg">{serverError}</div>}
            <div className="form-group">
              <label>Category Name *</label>
              <input
                value={form.categoryName}
                onChange={set("categoryName")}
                placeholder="e.g. Plumbing"
              />
              {errors.categoryName && <div className="form-error">{errors.categoryName}</div>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={set("description")}
                placeholder="All plumbing services"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={form.active ? "true" : "false"}
                onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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
