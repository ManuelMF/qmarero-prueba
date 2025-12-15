import React from "react";
import styles from "./PaymentModal.module.css";

export function ConfirmPaymentModal({
  isOpen,
  onClose,
  title,
  description,
  amount,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <h2>{title}</h2>
        <p>{description}</p>

        <p>
          <strong>{amount.toFixed(2)} €</strong>
        </p>

        <button className={styles.primaryButton} onClick={onConfirm}>
          Confirmar pago
        </button>
      </div>
    </div>
  );
}
