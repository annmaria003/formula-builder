import extractContextualVars from "../utils/extractContextualVars.js";

export default function FormulaCard({ formula, onExecute, onDelete }) {
  const placeholders = extractContextualVars(formula.expr);
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <strong>{formula.name}</strong>
        <div style={{ color:"#666", fontSize:13 }}>{placeholders.length ? `Context: ${placeholders.join(", ")}` : "No context"}</div>
      </div>
      <div style={styles.expr}>{formula.expr}</div>
      <div style={styles.actions}>
        <button style={styles.exec} onClick={()=>onExecute(formula)}>Execute</button>
        <button style={styles.del} onClick={()=>onDelete(formula.name)}>Delete</button>
      </div>
    </div>
  );
}

const styles = {
  card: { padding:12, borderRadius:8, background:"#fff", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", marginBottom:10 },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  expr: { color:"#111", fontSize:15, marginBottom:10 },
  actions: { display:"flex", gap:8 },
  exec: { background:"#10b981", color:"#fff", border:"none", padding:"8px 10px", borderRadius:6, cursor:"pointer" },
  del: { background:"#fff", border:"1px solid #eee", padding:"8px 10px", borderRadius:6, cursor:"pointer" }
};
