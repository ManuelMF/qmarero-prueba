import { useState, useEffect, useMemo } from "react";
import { ORDER_DATA } from "../../../mocks/orderData";
import { calculateUserTotal } from "../utils/calculations";
import { SocketService } from "../../../services/socketService";

export function useBillSession(userId) {
  const [selections, setSelections] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    const handleUpdate = (data) => {
      setSelections(data.selections);
      setOtherUsers(data.users);
      setIsConnected(data.connected);
    };
    SocketService.connect(handleUpdate);
  }, [userId]);

  // CAMBIO: Función para añadir o quitar
  const updateItemQty = (itemId, delta) => {
    SocketService.updateQuantity(itemId, userId, delta);
  };

  const totalToPay = useMemo(
    () => calculateUserTotal(ORDER_DATA.items, selections, userId),
    [selections, userId]
  );

  return {
    items: ORDER_DATA.items,
    tableInfo: ORDER_DATA.table,
    selections,
    otherUsers,
    isConnected,
    totalToPay,
    updateItemQty, // Exponemos la nueva función
  };
}
