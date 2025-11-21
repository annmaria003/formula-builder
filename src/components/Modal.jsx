export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <strong>{title}</strong>
          <button onClick={onClose} style={styles.close}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
  },
  dialog: {
    width: 520, background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.15)"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  close: { background: "transparent", border: "none", cursor: "pointer", fontSize: 16 },
  body: { marginTop: 8 }
};
