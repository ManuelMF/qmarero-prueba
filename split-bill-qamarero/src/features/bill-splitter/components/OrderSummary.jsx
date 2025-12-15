import styles from "./OrderSummary.module.css"; // Crear este archivo CSS

export function OrderSummary({ totalToPay, onConfirmPayment }) {
  return (
    <footer className={styles.footerSummary}>
      <div className={styles.totalRow}>
        <span className={styles.label}>Tu parte a pagar:</span>
        <strong className={styles.totalPrice}>{totalToPay.toFixed(2)} €</strong>
      </div>
      <button className={styles.payButton} onClick={onConfirmPayment}>
        Confirmar y Pagar
      </button>
    </footer>
  );
}
