import { useState } from "react";
import extractContextualVars from "../utils/extractContextualVars.js";

export default function FormulaForm({ onSave, variables }) {
  const [name, setName] = useState("");
  const [expr, setExpr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const n = name.trim().toUpperCase();
    if (!n) return alert("Formula name is required.");
    if (!/^[A-Z_][A-Z0-9_]*$/.test(n)) return alert("Invalid formula name (use uppercase & underscores).");
    if (!expr.trim()) return alert("Formula expression is required.");

    // Validate: all non-contextual identifiers must be defined in variables or be numeric
    // Collect identifiers from expression
    // contextual placeholders are {{#name}} and are allowed
    const placeholders = new Set(extractContextualVars(expr));
    // find plain identifiers (words) that are not numbers and not inside placeholders
    const idRx = /\b([A-Za-z_][A-Za-z0-9_]*)\b/g;
    let m, ids = new Set();
    while ((m = idRx.exec(expr)) !== null) {
      const id = m[1];
      // skip contextual names and numeric words
      if (placeholders.has(id)) continue;
      if (/^\d+$/.test(id)) continue;
      // if token is part of operator name (shouldn't be) we still treat as identifier
      ids.add(id.toUpperCase());
    }
    // verify ids exist in variables list
    const defined = new Set(variables.map(v => v.name));
    for (let id of ids) {
      if (!defined.has(id)) return alert(`Undefined variable used in expression: ${id}`);
    }

    onSave({ name: n, expr: expr.trim() });
    setName(""); setExpr("");
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={{ display: "flex", gap: 8 }}>
        <input placeholder="Formula name (e.g. NET_SALARY)" value={name} onChange={e=>setName(e.target.value)} style={styles.input}/>
        <input placeholder="Expression (e.g. GROSS - DEDUCTIONS or (GROSS/30) * {{#num_of_days}})" value={expr} onChange={e=>setExpr(e.target.value)} style={{...styles.input, flex:1}}/>
        <button type="submit" style={styles.btn}>Save</button>
      </div>
    </form>
  );
}

const styles = {
  form: { margin: "8px 0 0 0" },
  input: { padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd" },
  btn: { padding: "8px 12px", borderRadius:6, background:"#0ea5e9", color:"#fff", border:"none", cursor:"pointer" }
};
