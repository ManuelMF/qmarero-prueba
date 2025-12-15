import React, { useState, useEffect, useMemo } from "react";
import styles from "./OrderSummary.module.css";
import { PaymentModal } from "./PaymentModal"; // Importar el nuevo modal
import { ConfirmPaymentModal } from "./ConfirmPaymentModal"; // Importar el nuevo modal

export function OrderSummary({ totalToPay, items }) {
  const [mode, setMode] = useState(null); // null | select | all
  const [isModeModalOpen, setIsModeModalOpen] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  }, [items]);

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleSelectItemsMode = () => {
    setMode("select");
    setIsModeModalOpen(false);
  };

  const handlePayAllMode = () => {
    setMode("all");
    setIsModeModalOpen(false);
    openConfirmModal();
  };

  const handleConfirmPayment = () => {
    if (mode === "all") {
      alert(`Pago TOTAL de ${grandTotal.toFixed(2)} € confirmado`);
    } else {
      alert(`Pago de MIS productos: ${totalToPay.toFixed(2)} € confirmado`);
    }

    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <div className={styles.footerSummary}>
        <div className={styles.totalRow}>
          <span className={styles.label}>Tu Total Estimado</span>
          <span className={styles.totalPrice}>{totalToPay.toFixed(2)} €</span>
        </div>

        <button
          className={styles.payButton}
          disabled={totalToPay === 0 && mode === "select"}
          onClick={openConfirmModal}
        >
          Pagar
        </button>
      </div>

      <PaymentModal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        onSelectItems={handleSelectItemsMode}
        onPayAll={handlePayAllMode}
      />

      <ConfirmPaymentModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={
          mode === "all"
            ? "Confirmar pago de la cuenta"
            : "Confirmar pago de tus productos"
        }
        description={
          mode === "all"
            ? "Vas a hacerte cargo del total de la cuenta."
            : "Vas a pagar únicamente los productos que has seleccionado."
        }
        amount={mode === "all" ? grandTotal : totalToPay}
        onConfirm={handleConfirmPayment}
      />
    </>
  );
}
