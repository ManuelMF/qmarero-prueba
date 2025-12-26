import styles from "./SuccessScreen.module.css";

export function SuccessScreen({ amount }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>✓</div>
      <h1>¡Pago Completado!</h1>
      <p>
        Se han procesado correctamente <strong>{amount.toFixed(2)} €</strong>.
      </p>
      <p className={styles.subtext}>
        El restaurante ha recibido la confirmación. ¡Gracias por tu visita!
      </p>

      <button
        className={styles.button}
        onClick={() => window.location.reload()}
      >
        Volver al inicio
      </button>
    </div>
  );
}
