/**
 * Calcula el total que debe pagar un usuario específico.
 * El usuario paga el precio unitario por cada unidad.
 */
export const calculateUserTotal = (items, selections, userId) => {
  return items.reduce((total, item) => {
    const itemSelections = selections[item.id] || {};
    const myQty = itemSelections[userId] || 0;

    if (myQty === 0) return total;

    return total + myQty * item.unitPrice;
  }, 0);
};

/**
 * Determina el estado de un producto incluyendo lo que ya se ha pagado.
 * @param {Object} item - Datos del producto del mock.
 * @param {Object} selections - Estado de selecciones en tiempo real (Socket).
 * @param {Object} paidItems - Estado de productos ya pagados (Socket).
 * @param {string} userId - ID del usuario actual.
 */
export const getItemStatus = (item, selections, paidItems = {}, userId) => {
  const itemState = selections[item.id] || {};
  const paidQty = paidItems[item.id] || 0;

  const totalSelected = Object.values(itemState).reduce((a, b) => a + b, 0);
  const totalOccupied = totalSelected + paidQty;

  return {
    myQty: itemState[userId] || 0,
    paidQty,
    totalTaken: totalSelected,
    isFull: totalOccupied >= item.qty,
    participants: Object.keys(itemState),
  };
};
