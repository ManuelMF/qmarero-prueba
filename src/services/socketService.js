let ws = null;
let updateCallback = () => {};

export const SocketService = {
  connect: (sessionId, tableId, callback) => {
    updateCallback = callback;

    // Evitar duplicar conexiones
    if (
      ws &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("WebSocket Conectado");
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "JOIN_TABLE", sessionId, tableId }));
      }
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "UPDATE") {
        updateCallback({
          selections: data.selections,
          paid: data.paid,
          users: data.users,
          connected: true,
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Desconectado");
      updateCallback({ connected: false });
    };

    ws.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };
  },

  updateQuantity: (itemId, sessionId, delta) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "UPDATE_QTY", itemId, sessionId, delta }));
    } else {
      console.warn("No se pudo actualizar cantidad: Socket no está listo");
    }
  },

  confirmPayment: (sessionId, tableId, mode) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({ type: "CONFIRM_PAYMENT", sessionId, tableId, mode })
      );
    } else {
      console.error("No se pudo confirmar pago: Conexión perdida");
    }
  },
};
