/**
 * Calcula el total que debe pagar un usuario específico.
 */
export const calculateUserTotal = (items = [], selections = {}, userId) => {
  if (!items) return 0;
  return items.reduce((total, item) => {
    if (!item) return total;
    const itemSelections = selections[item.id] || {};
    const myQty = itemSelections[userId] || 0;

    return total + myQty * item.unitPrice;
  }, 0);
};

/**
 * Determina el estado de un producto.
 */
export const getItemStatus = (
  item,
  selections = {},
  paidItems = {},
  userId
) => {
  if (!item)
    return {
      myQty: 0,
      paidQty: 0,
      totalTaken: 0,
      isFull: false,
      participants: [],
    };

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

export const calculateRemainingTotal = (items = [], paidItems = {}) => {
  if (!items || !Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    if (!item) return total;

    const paidQty = paidItems[item.id] || 0;
    const remainingQty = Math.max(0, (item.qty || 0) - paidQty);
    const price = item.unitPrice || 0;

    return total + remainingQty * price;
  }, 0);
};
