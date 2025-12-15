import styles from "./ProductCard.module.css";

export function ProductCard({
  item,
  status,
  onUpdateQty,
  usersLookup,
  currentUserId,
}) {
  const { name, unitPrice, qty } = item;
  const { myQty, totalTaken, isFull, isShared, participants } = status;

  // Detectar si es múltiple (Cervezas) o único (Pizza)
  const isMultiUnit = qty > 1;

  const handleCardClick = () => {
    // Si no tengo nada, al hacer click sumo 1 (si hay stock)
    if (myQty === 0 && !isFull) {
      onUpdateQty(1);
    }
    // Si es item único y ya lo tengo, al hacer click en la tarjeta lo quito (efecto toggle)
    else if (!isMultiUnit && myQty > 0) {
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

  // Determinar el contenido a mostrar en el control
  const renderControl = () => {
    // --- ESCENARIO A: YA LO TENGO SELECCIONADO ---
    if (myQty > 0) {
      if (isMultiUnit) {
        // Opción 1: Es Multi-Unidad (Stepper)
        return (
          <div className={styles.stepper} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.stepperBtn}
              onClick={() => onUpdateQty(-1)}
            >
              −
            </button>
            <span className={styles.qtyValue}>{myQty}</span>
            <button
              className={`${styles.stepperBtn} ${styles.addBtn}`}
              disabled={qty - totalTaken <= 0}
              onClick={() => onUpdateQty(1)}
            >
              +
            </button>
          </div>
        );
      } else {
        // Opción 2: Es Unidad Única (Botón de Liberar)
        return (
          <button
            className={styles.singleSelectedBtn}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateQty(-1);
            }}
          >
            <span className={styles.checkIcon}>✓</span>
            {isShared ? "Liberar Parte" : "Liberar"}
          </button>
        );
      }
    }

    // --- ESCENARIO B: NO LO TENGO SELECCIONADO ---
    else {
      // Mostrar stock si es multi-unidad o está agotado
      const stockText = isMultiUnit ? `Quedan ${qty - totalTaken}` : "";

      return (
        <div className={styles.stockLabel}>
          {isFull ? "Agotado" : stockText}
        </div>
      );
    }
  };

  return (
    <div
      className={`${styles.card} ${myQty > 0 ? styles.active : ""} ${
        isFull && myQty === 0 ? styles.disabled : ""
      }`}
      onClick={handleCardClick}
    >
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.price}>
          {isShared && <span className={styles.splitLabel}>Compartido</span>}
          {unitPrice.toFixed(2)} €
        </div>
      </div>

      <div className={styles.actions}>
        {renderControl()}

        {/* AVATARES */}
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
