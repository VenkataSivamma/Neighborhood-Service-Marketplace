import "../styles/form.css";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <h3>⚠️ Confirm Action</h3>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: "#4a5568" }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
