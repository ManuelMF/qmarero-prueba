/**
 * Calcula el total que debe pagar un usuario específico.
 * Regla:
 * - Si el ítem tiene qty > 1, se cobra por unidad entera.
 * - Si el ítem tiene qty === 1 (compartido), se divide entre los participantes.
 */
export const calculateUserTotal = (items, selections, userId) => {
  return items.reduce((total, item) => {
    const itemSelections = selections[item.id] || {};
    const myQty = itemSelections[userId] || 0;

    // Cuántas personas han seleccionado este ítem
    const totalSelectors = Object.values(itemSelections).reduce(
      (a, b) => a + b,
      0
    );

    if (myQty === 0) return total;

    // Lógica de negocio
    if (item.qty === 1 && totalSelectors > 0) {
      // Caso plato compartido (ej: Jamón)
      return total + item.unitPrice / totalSelectors;
    } else {
      // Caso unidades individuales (ej: Cañas)
      return total + myQty * item.unitPrice;
    }
  }, 0);
};

export const getItemStatus = (item, selections, userId) => {
  const itemState = selections[item.id] || {};
  const totalTaken = Object.values(itemState).reduce((a, b) => a + b, 0);

  return {
    myQty: itemState[userId] || 0,
    totalTaken,
    isFull: totalTaken >= item.qty,
    isShared: item.qty === 1 && totalTaken > 1,
    participants: Object.keys(itemState), // IDs de quienes participan
  };
};
