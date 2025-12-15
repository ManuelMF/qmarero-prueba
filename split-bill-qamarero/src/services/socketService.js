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
  const myCurrentQty = currentItemState[userId] || 0;

  // Calcular cuántos han cogido los DEMÁS
  const othersQty = Object.entries(currentItemState)
    .filter(([uid]) => uid !== userId)
    .reduce((acc, [, qty]) => acc + qty, 0);

  // Cantidad total ya ocupada por otros
  const totalTakenByOthers = othersQty;

  // Calcular mi nueva cantidad deseada
  const newQty = myCurrentQty + delta;

  // VALIDACIONES:
  // 1. No puedo tener menos de 0
  if (newQty < 0) return;

  // 2. Si es un item compartido único (ej. Pizza), solo permitimos 0 o 1 (participar o no)
  if (itemConfig.qty === 1) {
    if (newQty > 1) return; // No puedes tener "2" de una pizza única, solo participas
  }

  // 3. La suma total (otros + yo) no puede superar la cantidad del pedido
  // Nota: Si es item compartido único (qty=1), la lógica de "stock" se ignora porque se divide el precio
  if (itemConfig.qty > 1) {
    if (totalTakenByOthers + newQty > itemConfig.qty) return; // No hay stock suficiente
  }

  // ACTUALIZAR ESTADO
  if (newQty === 0) {
    // Si llego a 0, borro mi entrada
    if (globalSelections[itemId]) {
      delete globalSelections[itemId][userId];
      if (Object.keys(globalSelections[itemId]).length === 0) {
        delete globalSelections[itemId];
      }
    }
  } else {
    // Actualizo o creo la entrada
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

  // CAMBIO IMPORTANTE: Ahora recibimos delta (+1 o -1)
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
