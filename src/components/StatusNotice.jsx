import styles from "./AuthForm.module.css";

export default function StatusNotice({ title, message, spinner }) {
  return (
    <div style={{ textAlign: "center" }}>
      {spinner}
      <h2 className={styles.heading} style={{ fontWeight: 700, fontSize: 24, color: "#000", margin: "24px 0 0 0" }}>
        {title}
      </h2>
      <p className="text-black" style={{ color: "#64748b", margin: "16px 0 0 0", fontSize: 16 }}>{message}</p>
    </div>
  );
}