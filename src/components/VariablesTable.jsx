export default function VariablesTable({ variables, onDelete, onEdit }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Name</th>
          <th style={styles.th}>Type</th>
          <th style={styles.th}>Value / Expression</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {variables.length === 0 && (
          <tr>
            <td colSpan="4" style={styles.empty}>
              No variables yet — add one.
            </td>
          </tr>
        )}

        {variables.map((v) => (
          <tr key={v.name}>
            <td style={styles.td}>{v.name}</td>

            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: v.type === "CONSTANT" ? "#d1fae5" : "#e0f2fe",
                }}
              >
                {v.type}
              </span>
            </td>

            <td style={styles.td}>{v.expr}</td>

            <td style={styles.td}>
              <button style={styles.btn} onClick={() => onEdit(v)}>
                Edit
              </button>

              <button
                style={{ ...styles.btn, marginLeft: 6 }}
                onClick={() => onDelete(v.name)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
  },
  th: {
    textAlign: "left",
    padding: "10px 6px",
    borderBottom: "2px solid #eee",
    color: "#444",
    fontSize: 14,
  },
  td: {
    padding: "10px 6px",
    borderBottom: "1px solid #f3f3f3",
    fontSize: 14,
  },
  empty: {
    padding: 20,
    textAlign: "center",
    color: "#777",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },
  btn: {
    padding: "6px 10px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
  },
};
