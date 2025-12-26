import styles from "./ProductCard.module.css";

export function ProductCard({
  item,
  status,
  onUpdateQty,
  usersLookup,
  currentUserId,
}) {
  const { name, unitPrice, qty } = item;
  const { myQty, totalTaken, isFull, participants, paidQty } = status;

  const isMultiUnit = qty > 1;
  const isFullyPaid = paidQty >= qty;

  const handleCardClick = () => {
    if (isFullyPaid) return;

    const remainingStock = qty - (totalTaken + paidQty);

    if (myQty === 0 && remainingStock > 0) {
      onUpdateQty(1);
    } else if (!isMultiUnit && myQty > 0) {
      onUpdateQty(-1);
    }
  };

  const activeAvatars = participants.map((uid) => {
    const user = usersLookup.find((u) => u.id === uid) || {
      name: uid,
      color: "#999",
    };
    return { ...user, uid };
  });

  const renderControls = () => {
    if (isFullyPaid) {
      return (
        <div className={styles.paidBadge}>
          <span className={styles.checkIcon}>✓</span> Pagado
        </div>
      );
    }

    if (myQty > 0 && isMultiUnit) {
      return (
        <div className={styles.stepper} onClick={(e) => e.stopPropagation()}>
          <button className={styles.stepperBtn} onClick={() => onUpdateQty(-1)}>
            −
          </button>
          <span className={styles.qtyValue}>{myQty}</span>
          <button
            className={`${styles.stepperBtn} ${styles.addBtn}`}
            disabled={qty - (totalTaken + paidQty) <= 0}
            onClick={() => onUpdateQty(1)}
          >
            +
          </button>
        </div>
      );
    } else {
      if (isMultiUnit) {
        return (
          <div className={styles.stockLabel}>
            {isFull ? "Completo" : `Quedan ${qty - (totalTaken + paidQty)}`}
          </div>
        );
      }
    }
  };

  return (
    <div
      className={`
        ${styles.card} 
        ${myQty > 0 ? styles.active : ""} 
        ${(isFull && myQty === 0) || isFullyPaid ? styles.disabled : ""}
        ${isFullyPaid ? styles.cardPaid : ""}
      `}
      onClick={handleCardClick}
    >
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.price}>{unitPrice.toFixed(2)} €</div>
      </div>

      <div className={styles.actions}>
        {renderControls()}

        <div className={styles.avatarsRow}>
          {activeAvatars.map((u, index) => (
            <div
              key={`${u.uid}-${index}`}
              className={styles.avatarBubble}
              style={{
                backgroundColor: u.uid === currentUserId ? "#7048E8" : u.color,
              }}
              title={u.name}
            >
              {u.uid === currentUserId ? "Yo" : u.name.charAt(0)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
