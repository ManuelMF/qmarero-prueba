import styles from "./PaymentModal.module.css";

export function ConfirmPaymentModal({
  isOpen,
  onClose,
  title,
  description,
  amount,
  onConfirm,
  status = "idle",
}) {
  if (!isOpen) return null;

  const renderContent = () => {
    if (status === "processing") {
      return (
        <div className={styles.statusContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.statusText}>
            Conectando con la pasarela de pago...
          </p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className={styles.statusContainer}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.statusText}>¡Pago realizado con éxito!</p>
        </div>
      );
    }

    return (
      <>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.amountDisplay}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            Total a pagar
          </span>
          <strong className={styles.amountValue}>{amount.toFixed(2)} €</strong>
        </div>

        <button className={styles.primaryButton} onClick={onConfirm}>
          Confirmar y pagar ahora
        </button>
      </>
    );
  };

  return (
    <div
      className={styles.overlay}
      onClick={status === "idle" ? onClose : undefined}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
}
