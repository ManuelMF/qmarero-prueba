import { useState, useEffect, useMemo } from "react";
import { ORDER_DATA } from "../../../mocks/orderData";
import { calculateUserTotal, getItemStatus } from "../utils/calculations";
import { SocketService } from "../../../services/socketService";
export function useBillSession(sessionId, tableId) {
  const [selections, setSelections] = useState({});
  const [otherUsers, setOtherUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!sessionId || !tableId) return; // seguridad

    const handleUpdate = (data) => {
      setSelections(data.selections);
      setOtherUsers(data.users);
      setIsConnected(data.connected);
    };

    SocketService.connect(sessionId, tableId, handleUpdate);

    // cleanup opcional
    return () => {
      // SocketService.disconnect(sessionId, tableId)
      // puedes implementar si quieres limpiar al salir
    };
  }, [sessionId, tableId]);

  const updateItemQty = (itemId, delta) => {
    SocketService.updateQuantity(itemId, sessionId, delta);
  };

  const totalToPay = useMemo(
    () => calculateUserTotal(ORDER_DATA.items, selections, sessionId),
    [selections, sessionId]
  );

  return {
    items: ORDER_DATA.items,
    tableInfo: ORDER_DATA.table,
    selections,
    otherUsers,
    isConnected,
    totalToPay,
    updateItemQty,
  };
}
