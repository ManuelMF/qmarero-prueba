import { useEffect, useState, useMemo } from "react";
import { useBillSession } from "./features/bill-splitter/hooks/useBillSession";
import { ProductCard } from "./features/bill-splitter/components/ProductCard";
import { OrderSummary } from "./features/bill-splitter/components/OrderSummary";
import { getItemStatus } from "./features/bill-splitter/utils/calculations";
import { ORDER_DATA } from "./mocks/orderData.js";
import "./App.css";

function App() {
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("sessionId") || null;
  });

  useEffect(() => {
    if (!sessionId) {
      const newId = crypto.randomUUID();
      setSessionId(newId);
      localStorage.setItem("sessionId", newId);
    }
  }, [sessionId]);

  if (!sessionId) return <div className="loading">Generando sesión...</div>;

  const tableId = ORDER_DATA.table.id;

  const {
    items,
    tableInfo,
    selections,
    otherUsers,
    isConnected,
    totalToPay,
    updateItemQty,
  } = useBillSession(sessionId, tableId);

  const handleConfirmPayment = () => {
    alert(`¡Se ha confirmado el pago de ${totalToPay.toFixed(2)} €!`);
  };

  if (!isConnected) return <div className="loading">Conectando...</div>;

  return (
    <main className="layout">
      <header className="header">
        <h1>{tableInfo.name}</h1>
        <p>Selecciona los productos a pagar</p>
      </header>

      <section className="list-container">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            currentUserId={sessionId}
            status={getItemStatus(item, selections, sessionId)}
            usersLookup={otherUsers}
            onUpdateQty={(delta) => updateItemQty(item.id, delta)}
          />
        ))}
      </section>

      <OrderSummary
        totalToPay={totalToPay}
        items={items}
        onConfirmPayment={handleConfirmPayment}
      />
    </main>
  );
}

export default App;
