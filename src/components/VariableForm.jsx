import { useState } from "react";

export default function VariableForm({ onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("CONSTANT");
  const [expr, setExpr] = useState("");

  function reset() {
    setName("");
    setType("CONSTANT");
    setExpr("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = name.trim().toUpperCase();

    if (!trimmed) return alert("Variable name is required.");

    if (!/^[A-Z_][A-Z0-9_]*$/.test(trimmed)) {
      return alert(
        "Invalid name. Use uppercase letters, numbers, and underscores only."
      );
    }

    if (type === "CONSTANT") {
      if (expr.trim() === "" || Number.isNaN(Number(expr))) {
        return alert("Constant variables must have a numeric value.");
      }
    }

    if (type === "DYNAMIC") {
      if (expr.trim() === "") {
        return alert("Dynamic variables must have an expression.");
      }
    }

    onAdd({ name: trimmed, type, expr: expr.trim() });
    reset();
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <label style={styles.label}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g. BASIC"
          style={styles.input}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.select}
        >
          <option value="CONSTANT">CONSTANT</option>
          <option value="DYNAMIC">DYNAMIC</option>
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>
          {type === "CONSTANT" ? "Value" : "Expression"}
        </label>
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder={type === "CONSTANT" ? "10000" : "BASIC + DA"}
          style={styles.input}
        />
      </div>

      <div style={{ textAlign: "right" }}>
        <button type="submit" style={styles.button}>
          Add Variable
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "1fr 180px",
    alignItems: "center",
  },
  row: { display: "contents" },
  label: { fontSize: 13, marginBottom: 4 },
  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  select: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  button: {
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};