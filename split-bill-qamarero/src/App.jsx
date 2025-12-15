// src/App.jsx

import { useBillSession } from "./features/bill-splitter/hooks/useBillSession";
import { ProductCard } from "./features/bill-splitter/components/ProductCard";
import { OrderSummary } from "./features/bill-splitter/components/OrderSummary"; // <-- Nuevo
import { getItemStatus } from "./features/bill-splitter/utils/calculations";
import { useState } from "react";
import "./App.css";
import { ORDER_DATA } from "./mocks/orderData";
function App() {
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const tableId = ORDER_DATA.table.id;

  const {
    items,
    tableInfo,
    selections,
    otherUsers,
    isConnected,
    totalToPay,
    toggleItem,
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
        <p>Hola, Usuario {sessionId.slice(0, 4)}</p>
      </header>

      <section className="list-container">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            currentUserId={sessionId}
            status={getItemStatus(item, selections, sessionId)}
            usersLookup={otherUsers}
            onToggle={() => toggleItem(item.id)}
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
