import { WebSocketServer } from "ws";
import { ORDER_DATA } from "../mocks/orderData.js";

const wss = new WebSocketServer({ port: 3001 });

let tables = {
  "MESA-18": {
    selections: {},
    users: {},
    paid: {},
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
          tables[tableId] = { selections: {}, users: {}, paid: {} };
        }

        tables[tableId].users[sessionId] = {
          id: sessionId,
          name: `Usuario ${sessionId.slice(0, 4)}`,
          color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        };

        broadcastTableUpdate(tableId);
        break;

      case "UPDATE_QTY": {
        const { itemId, delta } = data;
        const itemConfig = ORDER_DATA.items.find((i) => i.id === itemId);
        if (!itemConfig) return;

        const currentItemState = tables[tableId].selections[itemId] || {};
        const myQty = currentItemState[sessionId] || 0;
        const currentPaid = tables[tableId].paid[itemId] || 0;
        const totalSelected = Object.values(currentItemState).reduce(
          (a, b) => a + b,
          0
        );

        const newQty = myQty + delta;

        if (
          newQty < 0 ||
          newQty + (totalSelected - myQty) + currentPaid > itemConfig.qty
        )
          return;

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

        broadcastTableUpdate(tableId);
        break;
      }

      case "CONFIRM_PAYMENT": {
        const { mode } = data;
        const table = tables[tableId];
        if (!table) return;

        if (mode === "all") {
          ORDER_DATA.items.forEach((item) => {
            table.paid[item.id] = item.qty;
            delete table.selections[item.id];
          });
        } else {
          Object.entries(table.selections).forEach(([itemId, usersMap]) => {
            const userQty = usersMap[sessionId] || 0;
            if (userQty > 0) {
              table.paid[itemId] = (table.paid[itemId] || 0) + userQty;
              delete usersMap[sessionId];
            }
            if (Object.keys(usersMap).length === 0)
              delete table.selections[itemId];
          });
        }

        broadcastTableUpdate(tableId);
        break;
      }
    }
  });
});

function broadcastTableUpdate(tableId) {
  if (!tables[tableId]) return;

  const message = JSON.stringify({
    type: "UPDATE",
    selections: tables[tableId].selections,
    paid: tables[tableId].paid,
    users: Object.values(tables[tableId].users),
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}
