import { Wifi, Activity } from 'lucide-react';

export const Header = ({ mqttConectado, esp32Conectado, styles }) => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>
          🚦 Control de Semáforos ESP32
        </h1>
        <p style={styles.subtitle}>Sistema de gestión y monitoreo en tiempo real vía MQTT</p>
      </div>
      <div style={styles.statusContainer}>
        <div style={styles.statusBadge(mqttConectado)}>
          <Wifi size={20} />
          <span>{mqttConectado ? 'MQTT Conectado' : 'MQTT Desconectado'}</span>
        </div>
        <div style={styles.statusBadge(esp32Conectado)}>
          <Activity size={20} />
          <span>{esp32Conectado ? 'ESP32 Online' : 'ESP32 Offline'}</span>
        </div>
      </div>
    </div>
  );
};
