export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      className="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "8px 14px",
        border: "1px solid #cbd5e0",
        borderRadius: "7px",
        fontSize: "14px",
        outline: "none",
        width: "220px",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#1a3c6e")}
      onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
    />
  );
}
