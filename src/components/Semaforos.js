export const SemaforoAutos = ({ estado, styles }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        🚗 Semáforo de Autos
      </h3>
      <div style={styles.semaforoContainer}>
        <div style={styles.semaforoBox}>
          <div style={styles.luz('rojo', estado.semaforo_autos === 'ROJO')} />
          <div style={styles.luz('amarillo', estado.semaforo_autos === 'AMARILLO')} />
          <div style={styles.luz('verde', estado.semaforo_autos === 'VERDE')} />
        </div>
      </div>
      <div style={{textAlign: 'center'}}>
        <span style={styles.estadoBadge(estado.semaforo_autos)}>
          {estado.semaforo_autos}
        </span>
      </div>
      <div style={styles.infoText}>
        Actualizando en tiempo real desde ESP32
      </div>
    </div>
  );
};

export const SemaforoPeatones = ({ estado, styles }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        🚶 Semáforo de Peatones
      </h3>
      <div style={styles.semaforoContainer}>
        <div style={styles.semaforoBox}>
          <div style={styles.luz('rojo', estado.semaforo_peatones === 'ROJO')} />
          <div style={styles.luz('verde-peatones', estado.semaforo_peatones === 'VERDE')} />
        </div>
      </div>
      <div style={{textAlign: 'center'}}>
        <span style={styles.estadoBadge(estado.semaforo_peatones)}>
          {estado.semaforo_peatones}
        </span>
      </div>
      <div style={styles.infoText}>
        Actualizando en tiempo real desde ESP32
      </div>
    </div>
  );
};
