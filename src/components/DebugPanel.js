export const DebugPanel = ({ mqttConectado, esp32Conectado, styles, config: MQTT_CONFIG }) => {
  return (
    <div style={{...styles.card, ...styles.debugPanel}}>
      <h3 style={{...styles.cardTitle, marginBottom: '12px'}}>🔍 Debug Info</h3>
      <div style={{fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace', lineHeight: '1.6'}}>
        <div>🔗 Broker: <span style={{color: '#3b82f6'}}>{MQTT_CONFIG.broker}:{MQTT_CONFIG.port}</span></div>
        <div>👤 Usuario: <span style={{color: '#3b82f6'}}>{MQTT_CONFIG.username}</span></div>
        <div>🔐 Password: <span style={{color: MQTT_CONFIG.password ? '#22c55e' : '#ef4444'}}>{MQTT_CONFIG.password ? '✓ Configurada' : '✗ Falta'}</span></div>
        <div style={{marginTop: '8px'}}>
          📡 Topics:
          <div style={{marginLeft: '12px'}}>
            <div>state: <span style={{color: '#3b82f6'}}>{MQTT_CONFIG.topics.state}</span></div>
            <div>status: <span style={{color: '#3b82f6'}}>{MQTT_CONFIG.topics.status}</span></div>
            <div>config: <span style={{color: '#3b82f6'}}>{MQTT_CONFIG.topics.config}</span></div>
          </div>
        </div>
        <div style={{marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #334155'}}>
          📊 Estado:
          <div style={{marginLeft: '12px'}}>
            <div>MQTT: <span style={{color: mqttConectado ? '#22c55e' : '#ef4444'}}>{mqttConectado ? '✓ Conectado' : '✗ Desconectado'}</span></div>
            <div>ESP32: <span style={{color: esp32Conectado ? '#22c55e' : '#ef4444'}}>{esp32Conectado ? '✓ Online' : '✗ Offline'}</span></div>
          </div>
        </div>
      </div>
      <div style={{marginTop: '12px', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic'}}>
        ℹ️ Abre la consola del navegador (F12 → Console) para ver logs detallados de la conexión
      </div>
    </div>
  );
};
