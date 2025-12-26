import { useState, useEffect, useMemo } from "react";
import { ORDER_DATA } from "../../../mocks/orderData";
import { calculateUserTotal } from "../utils/calculations";
import { SocketService } from "../../../services/socketService";

export function useBillSession(sessionId, tableId) {
  const [selections, setSelections] = useState({});
  const [otherUsers, setOtherUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [paidItems, setPaidItems] = useState({});

  useEffect(() => {
    if (!sessionId || !tableId) return;

    const handleUpdate = (data) => {
      setSelections(data.selections);
      setPaidItems(data.paid || {});
      setOtherUsers(data.users);
      setIsConnected(data.connected);
    };

    SocketService.connect(sessionId, tableId, handleUpdate);

    return () => {};
  }, [sessionId, tableId]);

  const updateItemQty = (itemId, delta) => {
    SocketService.updateQuantity(itemId, sessionId, delta);
  };

  const confirmPayment = () => {
    SocketService.confirmPayment(sessionId, tableId);
  };

  const totalToPay = useMemo(
    () => calculateUserTotal(ORDER_DATA.items, selections, sessionId),
    [selections, sessionId]
  );

  return {
    items: ORDER_DATA.items,
    tableInfo: ORDER_DATA.table,
    selections,
    paidItems,
    otherUsers,
    isConnected,
    totalToPay,
    updateItemQty,
    confirmPayment,
  };
}
