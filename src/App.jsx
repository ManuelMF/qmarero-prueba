import { useEffect, useState } from "react";
import { useBillSession } from "./features/bill-splitter/hooks/useBillSession";
import { ProductCard } from "./features/bill-splitter/components/ProductCard";
import { OrderSummary } from "./features/bill-splitter/components/OrderSummary";
import { SuccessScreen } from "./features/bill-splitter/components/SuccessScreen";
import { getItemStatus } from "./features/bill-splitter/utils/calculations";
import { ORDER_DATA } from "./mocks/orderData.js";
import "./App.css";

function App() {
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("sessionId") || null;
  });

  const [isPaid, setIsPaid] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      const newId = crypto.randomUUID();
      setSessionId(newId);
      localStorage.setItem("sessionId", newId);
    }
  }, [sessionId]);

  const tableId = ORDER_DATA.table.id;

  const {
    items,
    tableInfo,
    selections,
    paidItems,
    otherUsers,
    isConnected,
    totalToPay,
    updateItemQty,
    confirmPayment,
  } = useBillSession(sessionId, tableId);

  const handlePaymentComplete = (amount) => {
    setPaidAmount(amount);
    setIsPaid(true);
  };

  if (!sessionId) {
    return <div className="loading">Generando sesión...</div>;
  }

  if (!isConnected) {
    return <div className="loading">Conectando con la mesa...</div>;
  }

  if (isPaid) {
    return <SuccessScreen amount={paidAmount} />;
  }

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
            status={getItemStatus(item, selections, paidItems, sessionId)}
            usersLookup={otherUsers}
            onUpdateQty={(delta) => updateItemQty(item.id, delta)}
          />
        ))}
      </section>

      <OrderSummary
        totalToPay={totalToPay}
        items={items}
        paidItems={paidItems}
        onPaymentSuccess={handlePaymentComplete}
        confirmPayment={confirmPayment}
      />
    </main>
  );
}

export default App;
