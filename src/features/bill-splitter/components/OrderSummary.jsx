import { useState, useMemo } from "react";
import styles from "./OrderSummary.module.css";
import { PaymentModal } from "./PaymentModal";
import { ConfirmPaymentModal } from "./ConfirmPaymentModal";

export function OrderSummary({
  totalToPay,
  items,
  onPaymentSuccess,
  confirmPayment,
}) {
  const [mode, setMode] = useState(null);
  const [isModeModalOpen, setIsModeModalOpen] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("idle");

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
    const finalAmount = mode === "all" ? grandTotal : totalToPay;

    setPaymentStatus("processing");

    // Simulación de pasarela de pago (2 segundos)
    setTimeout(() => {
      setPaymentStatus("success");

      if (confirmPayment) {
        confirmPayment();
      }

      setTimeout(() => {
        setIsConfirmModalOpen(false);
        setPaymentStatus("idle");

        if (onPaymentSuccess) {
          onPaymentSuccess(finalAmount);
        }
      }, 1500);
    }, 2000);
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
          disabled={
            (totalToPay === 0 && mode === "select") || totalToPay === null
          }
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
        onClose={() => paymentStatus === "idle" && setIsConfirmModalOpen(false)}
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
        status={paymentStatus}
      />
    </>
  );
}
