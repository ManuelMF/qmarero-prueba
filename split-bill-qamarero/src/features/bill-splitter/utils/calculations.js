/**
 * Calcula el total que debe pagar un usuario específico.
 * Regla: El usuario paga el precio unitario por cada unidad que reclama (myQty).
 */
export const calculateUserTotal = (items, selections, userId) => {
  return items.reduce((total, item) => {
    const itemSelections = selections[item.id] || {};
    const myQty = itemSelections[userId] || 0;

    if (myQty === 0) return total;

    // Lógica simplificada: Siempre paga por las unidades que ha reclamado
    return total + myQty * item.unitPrice;
  }, 0);
};

export const getItemStatus = (item, selections, userId) => {
  const itemState = selections[item.id] || {};
  const totalTaken = Object.values(itemState).reduce((a, b) => a + b, 0);

  return {
    myQty: itemState[userId] || 0,
    totalTaken,
    isFull: totalTaken >= item.qty,
    // Eliminamos 'isShared' y cualquier referencia a lógica de compartir
    participants: Object.keys(itemState),
  };
};
