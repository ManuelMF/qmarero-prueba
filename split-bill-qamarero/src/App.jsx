// src/App.jsx

import { useBillSession } from "./features/bill-splitter/hooks/useBillSession";
import { ProductCard } from "./features/bill-splitter/components/ProductCard";
import { OrderSummary } from "./features/bill-splitter/components/OrderSummary"; // <-- Nuevo
import { getItemStatus } from "./features/bill-splitter/utils/calculations";
import "./App.css";

function App() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("user") || "invitado";

  const {
    items,
    tableInfo,
    selections,
    otherUsers,
    isConnected,
    totalToPay,
    toggleItem,
    updateItemQty,
  } = useBillSession(userId);

  // Función de acción simulada
  const handleConfirmPayment = () => {
    alert(`👋 ¡${userId} ha confirmado el pago de ${totalToPay.toFixed(2)} €!`);
    // Aquí iría la llamada al Socket para notificar al servidor y a otros usuarios
  };

  if (!isConnected) return <div className="loading">Conectando...</div>;

  return (
    <main className="layout">
      <header className="header">
        <h1>{tableInfo.name}</h1>
        <p>Hola, {userId}</p>
      </header>

      <section className="list-container">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            currentUserId={userId}
            status={getItemStatus(item, selections, userId)}
            usersLookup={otherUsers}
            onToggle={() => toggleItem(item.id)}
            onUpdateQty={(delta) => updateItemQty(item.id, delta)}
          />
        ))}
      </section>

      {/* Nuevo Componente OrderSummary */}
      <OrderSummary
        totalToPay={totalToPay}
        onConfirmPayment={handleConfirmPayment}
      />
    </main>
  );
}

export default App;
