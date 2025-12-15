import { ORDER_DATA, MOCK_USERS } from "../mocks/orderData";

// Estado global simulado
let globalSelections = {
  I8: { u2: 1 },
  I12: { u3: 1 },
};
let updateCallback = () => {};

// Lógica de validación de cantidad
const processQuantityChange = (itemId, userId, delta) => {
  const itemConfig = ORDER_DATA.items.find((i) => i.id === itemId);
  if (!itemConfig) return;

  const currentItemState = globalSelections[itemId] || {};
  const myCurrentQty = currentItemState[userId] || 0; // Calcular cuántos han cogido los DEMÁS

  const othersQty = Object.entries(currentItemState)
    .filter(([uid]) => uid !== userId)
    .reduce((acc, [, qty]) => acc + qty, 0); // Cantidad total ya ocupada por otros

  const totalTakenByOthers = othersQty; // Calcular mi nueva cantidad deseada

  const newQty = myCurrentQty + delta; // VALIDACIONES: // 1. No puedo tener menos de 0

  if (newQty < 0) return; // 2. La suma total (otros + yo) NO puede superar la cantidad del pedido (Stock)

  if (totalTakenByOthers + newQty > itemConfig.qty) {
    // Si la cantidad actual + lo que quiero añadir supera el stock total, lo ignoramos.
    return;
  } // ACTUALIZAR ESTADO

  if (newQty === 0) {
    // Si llego a 0, borro mi entrada
    if (globalSelections[itemId]) {
      // 1. Elimina la cantidad de ese usuario del ítem
      delete globalSelections[itemId][userId]; // 2. Si nadie tiene nada del ítem, elimina el ítem completo

      if (Object.keys(globalSelections[itemId]).length === 0) {
        delete globalSelections[itemId];
      }

      // ¡¡¡CORRECCIÓN CLAVE AQUÍ!!!
      // Ya que usamos 'delete' (mutación), forzamos una nueva referencia para React:
      globalSelections = { ...globalSelections };
    }
  } else {
    // Actualizo o creo la entrada (Esto ya es inmutable)
    globalSelections = {
      ...globalSelections,
      [itemId]: { ...currentItemState, [userId]: newQty },
    };
  }

  SocketService.emitUpdate();
};

export const SocketService = {
  connect: (callback) => {
    updateCallback = callback;
    setTimeout(() => {
      callback({
        selections: globalSelections,
        users: MOCK_USERS,
        connected: true,
      });
    }, 500);
  },

  updateQuantity: (itemId, userId, delta) => {
    processQuantityChange(itemId, userId, delta);
  },

  emitUpdate: () => {
    if (updateCallback) {
      updateCallback({
        selections: globalSelections,
        users: MOCK_USERS,
        connected: true,
      });
    }
  },
};
