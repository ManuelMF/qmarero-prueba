import React from "react";
import styles from "./PaymentModal.module.css";

export function PaymentModal({ isOpen, onClose, onSelectItems, onPayAll }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>¿Cómo quieres participar?</h2>

        <p className={styles.subtitle}>
          Elige cómo quieres gestionar esta cuenta
        </p>

        <div className={styles.options}>
          {/* MODO 1: Seleccionar productos */}
          <button className={styles.primaryButton} onClick={onSelectItems}>
            Seleccionar productos a pagar
          </button>

          {/* MODO 2: Pagar todo */}
          <button className={styles.secondaryButton} onClick={onPayAll}>
            Hacerme cargo de toda la cuenta
          </button>
        </div>

        <button className={styles.laterButton} onClick={onClose}>
          Decidir más tarde
        </button>
      </div>
    </div>
  );
}
