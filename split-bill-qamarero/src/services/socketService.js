// socketService.js
let ws = null;
let updateCallback = () => {};

export const SocketService = {
  connect: (sessionId, tableId, callback) => {
    updateCallback = callback;
    ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "JOIN_TABLE", sessionId, tableId }));
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "UPDATE") {
        updateCallback({
          selections: data.selections,
          users: data.users,
          connected: true,
        });
      }
    };
  },

  updateQuantity: (itemId, sessionId, delta) => {
    if (!ws) return;
    ws.send(JSON.stringify({ type: "UPDATE_QTY", itemId, sessionId, delta }));
  },
};
