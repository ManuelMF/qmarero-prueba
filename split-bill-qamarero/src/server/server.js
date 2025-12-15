// server.js
import { WebSocketServer } from "ws";
import { ORDER_DATA } from "../mocks/orderData.js";

const wss = new WebSocketServer({ port: 3001 });

let tables = {
  "MESA-18": {
    selections: {}, // { itemId: { sessionId: qty } }
    users: {}, // { sessionId: { name, color } }
  },
};

wss.on("connection", (ws) => {
  let sessionId = null;
  let tableId = null;

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "JOIN_TABLE":
        sessionId = data.sessionId;
        tableId = data.tableId;

        if (!tables[tableId]) {
          tables[tableId] = { selections: {}, users: {} };
        }

        // Registrar usuario
        tables[tableId].users[sessionId] = {
          id: sessionId,
          name: `Usuario ${sessionId.slice(0, 4)}`,
          color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        };

        // Enviar estado inicial al usuario
        ws.send(
          JSON.stringify({
            type: "UPDATE",
            selections: tables[tableId].selections,
            users: Object.values(tables[tableId].users),
          })
        );
        break;

      case "UPDATE_QTY":
        const { itemId, delta } = data;
        const itemConfig = ORDER_DATA.items.find((i) => i.id === itemId);
        if (!itemConfig) return;

        const currentItemState = tables[tableId].selections[itemId] || {};
        const myQty = currentItemState[sessionId] || 0;
        const othersQty =
          Object.values(currentItemState).reduce((a, b) => a + b, 0) - myQty;

        const newQty = myQty + delta;
        if (newQty < 0 || newQty + othersQty > itemConfig.qty) return;

        if (newQty === 0) {
          delete currentItemState[sessionId];
          if (Object.keys(currentItemState).length === 0) {
            delete tables[tableId].selections[itemId];
          }
        } else {
          tables[tableId].selections[itemId] = {
            ...currentItemState,
            [sessionId]: newQty,
          };
        }

        // Emitir a todos
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(
              JSON.stringify({
                type: "UPDATE",
                selections: tables[tableId].selections,
                users: Object.values(tables[tableId].users),
              })
            );
          }
        });
        break;
    }
  });
});
