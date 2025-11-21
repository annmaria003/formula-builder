import { useState } from "react";
import VariableForm from "./components/VariableForm.jsx";
import VariablesTable from "./components/VariablesTable.jsx";
import FormulaForm from "./components/FormulaForm.jsx";
import FormulaCard from "./components/FormulaCard.jsx";
import Modal from "./components/Modal.jsx";
import extractContextualVars from "./utils/extractContextualVars.js";
import resolveVariables from "./utils/resolveVariables.js";
import evaluateExpression from "./utils/evaluateExpression.js";

export default function App() {
  const [variables, setVariables] = useState([
    { name: "BASIC", type: "CONSTANT", expr: "10000" },
    { name: "DA", type: "CONSTANT", expr: "2000" },
    { name: "HRA", type: "CONSTANT", expr: "3000" },
    { name: "GROSS", type: "DYNAMIC", expr: "BASIC + DA + HRA" },
    { name: "PF", type: "CONSTANT", expr: "1200" },
    { name: "TAX", type: "CONSTANT", expr: "500" },
    { name: "DEDUCTIONS", type: "DYNAMIC", expr: "PF + TAX" },
  ]);
  const [formulas, setFormulas] = useState([
    { name: "NET_SALARY", expr: "GROSS - DEDUCTIONS" },
    { name: "MONTHLY_SALARY", expr: "(GROSS / 30) * {{#num_of_days}}" },
    { name: "BONUS", expr: "GROSS * {{#bonus_percentage}} / 100" },
  ]);

  // Modal state for contextual inputs
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState([]); // [{name, value}]
  const [executingFormula, setExecutingFormula] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // Variables CRUD
  function handleAddVariable(v) {
    if (variables.some(x=>x.name === v.name)) return alert("Variable already exists");
    setVariables(s => [...s, v]);
  }
  function handleDeleteVariable(name) {
    if (!confirm("Delete variable " + name + "?")) return;
    setVariables(s => s.filter(v => v.name !== name));
  }
  function handleEditVariable(varObj) {
    const newExpr = prompt("Edit expression/value for " + varObj.name, varObj.expr);
    if (newExpr === null) return;
    setVariables(vs => vs.map(x => x.name === varObj.name ? { ...x, expr: newExpr.trim() } : x));
  }

  // Formulas CRUD
  function handleSaveFormula(form) {
    if (formulas.some(f => f.name === form.name)) return alert("Formula name already exists.");
    setFormulas(s => [...s, form]);
  }
  function handleDeleteFormula(name) {
    if (!confirm("Delete formula " + name + "?")) return;
    setFormulas(s => s.filter(f => f.name !== name));
  }

  // Execute formula -> flows: prompt for contextual, then evaluate
  function handleExecuteFormula(formula) {
    const placeholders = extractContextualVars(formula.expr);
    if (placeholders.length) {
      setModalFields(placeholders.map(p => ({ name: p, value: "" })));
      setExecutingFormula(formula);
      setModalOpen(true);
      return;
    }
    // no placeholders -> compute immediately
    try {
      const res = evaluateFormulaWithVariables(formula.expr, {});
      setLastResult({ formula: formula.name, value: res });
      alert(`${formula.name} = ${res}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  function onModalSubmit() {
    // build map of contextual values
    const ctx = {};
    for (let f of modalFields) {
      if (f.value === "") { alert("Please fill " + f.name); return; }
      if (isNaN(Number(f.value))) { alert(`${f.name} must be numeric`); return; }
      ctx[f.name] = Number(f.value);
    }
    setModalOpen(false);
    try {
      const res = evaluateFormulaWithVariables(executingFormula.expr, ctx);
      setLastResult({ formula: executingFormula.name, value: res });
      alert(`${executingFormula.name} = ${res}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setExecutingFormula(null);
  }

  function evaluateFormulaWithVariables(expr, contextualMap) {
    // 1) Replace contextual placeholders
    let substituted = expr.replace(/\{\{\s*#([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g, (_, name) => {
      if (!(name in contextualMap)) throw new Error(`Missing contextual value: ${name}`);
      return String(contextualMap[name]);
    });

    // 2) Resolve dynamic variables recursively, get numeric map
    const resolved = resolveVariables(variables); // Map name->number

    // 3) Replace variable identifiers in substituted expression with their numbers
    // Replace whole identifiers (uppercase)
    substituted = substituted.replace(/\b([A-Z_][A-Z0-9_]*)\b/g, (_, id) => {
      if (!resolved.has(id)) throw new Error(`Undefined variable in expression: ${id}`);
      return String(resolved.get(id));
    });

    // 4) Evaluate final expression
    const value = evaluateExpression(substituted);
    return value;
  }

  return (
    <div style={{ padding:20, fontFamily:"Inter, Arial, sans-serif", maxWidth:1100, margin:"0 auto" }}>
      <h1>Formula Builder</h1>
      <p style={{ color:"#555" }}>Single page app — variables, formulas, runtime context, PEMDAS evaluation.</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:16, marginTop:12 }}>

        {/* Left column: Variables + Formulas list */}
        <div>
          <div style={styles.card}>
            <h3>Variables</h3>
            <VariableForm onAdd={handleAddVariable} />
            <div style={{ height:12 }} />
            <VariablesTable variables={variables} onDelete={handleDeleteVariable} onEdit={handleEditVariable} />
          </div>

          <div style={{ height: 16 }} />

          <div style={styles.card}>
            <h3>Formulas</h3>
            <FormulaForm onSave={handleSaveFormula} variables={variables} />
            <div style={{ marginTop:12 }}>
              {formulas.map(f => (
                <FormulaCard key={f.name} formula={f} onExecute={handleExecuteFormula} onDelete={handleDeleteFormula} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Live info + result */}
        <div>
          <div style={styles.card}>
            <h3>Live Preview / Result</h3>
            <div style={{ color:"#444", minHeight:80 }}>
              {lastResult ? (
                <div>
                  <div style={{ fontSize:13, color:"#666" }}>Last executed</div>
                  <div style={{ fontSize:18, fontWeight:700 }}>{lastResult.formula} = {String(lastResult.value)}</div>
                </div>
              ) : (
                <div style={{ color:"#777" }}>Execute a formula to see the result here.</div>
              )}
            </div>
            <div style={{ height:12 }} />
            <div style={{ color:"#666", fontSize:13 }}>
              Example variables and formulas from assignment included by default.
            </div>
          </div>
        </div>

      </div>

      <Modal open={modalOpen} title="Provide contextual values" onClose={()=>setModalOpen(false)}>
        <div style={{ display:"grid", gap:10 }}>
          {modalFields.map((f, idx) => (
            <div key={f.name} style={{ display:"flex", gap:8, alignItems:"center" }}>
              <label style={{ minWidth:130 }}>{f.name}</label>
              <input value={f.value} onChange={(e)=> {
                const val = e.target.value;
                setModalFields(prev => {
                  const next = [...prev];
                  next[idx] = { ...next[idx], value: val };
                  return next;
                });
              }} style={{ padding:"8px 10px", flex:1, borderRadius:6, border:"1px solid #ddd" }} />
            </div>
          ))}
          <div style={{ textAlign:"right" }}>
            <button onClick={onModalSubmit} style={{ padding:"8px 12px", borderRadius:6, background:"#10b981", color:"#fff", border:"none" }}>Execute</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

const styles = {
  card: { padding: 14, borderRadius: 8, background:"#fff", boxShadow:"0 6px 24px rgba(12,12,12,0.06)", marginBottom:12 }
};
