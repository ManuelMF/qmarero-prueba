import styles from "./ProductCard.module.css";

export function ProductCard({
  item,
  status,
  onUpdateQty,
  usersLookup,
  currentUserId,
}) {
  const { name, unitPrice, qty } = item;
  // Eliminamos isShared de la desestructuración
  const { myQty, totalTaken, isFull, participants } = status;

  // Detectar si es múltiple (Cervezas) o único (Pizza)
  const isMultiUnit = qty > 1;

  // Manejador del clic en TODA la tarjeta
  const handleCardClick = () => {
    const remainingStock = qty - totalTaken;

    // 1. Si no tengo nada, intento añadir 1 (si hay stock disponible)
    if (myQty === 0 && remainingStock > 0) {
      onUpdateQty(1);
    }
    // 2. Si es Ítem Único (qty=1) Y ya lo tengo, el click en la tarjeta lo quita (Toggle)
    // Nota: El item único es el único donde la tarjeta funciona como toggle
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

  // --- RENDERING DE CONTROLES ---
  const renderControls = () => {
    // Si tengo cantidad > 0 Y es un ítem multi-unidad, muestro el Stepper
    if (myQty > 0 && isMultiUnit) {
      return (
        <div className={styles.stepper} onClick={(e) => e.stopPropagation()}>
          <button className={styles.stepperBtn} onClick={() => onUpdateQty(-1)}>
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
    }

    // Si no es un stepper, mostramos stock o nada
    else {
      // Si es multi-unidad y no tengo (pero hay stock), se muestra el stock restante
      if (isMultiUnit) {
        return (
          <div className={styles.stockLabel}>
            {isFull ? "" : `Quedan ${qty - totalTaken}`}
          </div>
        );
      }
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
          {/* Eliminamos el span.splitLabel que decía 'Compartido' */}
          {unitPrice.toFixed(2)} €
        </div>
      </div>

      <div className={styles.actions}>
        {renderControls()}

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
