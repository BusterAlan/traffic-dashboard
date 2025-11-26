// Convertir estado del ESP32 al formato del dashboard
export const convertirEstadoESP32 = (payloadESP32) => {
  let semaforo_autos = 'VERDE';
  let semaforo_peatones = 'ROJO';
  
  const state = payloadESP32.state || '';

  if (state.includes('RED_VEHICLE_GREEN_PEDESTRIAN')) {
    semaforo_autos = 'ROJO';
    semaforo_peatones = 'VERDE';
  }
  
  if (state.includes('RED_VEHICLE')) {
    semaforo_autos = 'ROJO';
  } else if (state.includes('YELLOW_VEHICLE')) {
    semaforo_autos = 'AMARILLO';
  } else if (state.includes('GREEN_VEHICLE')) {
    semaforo_autos = 'VERDE';
  }
  
  if (state.includes('GREEN_PEDESTRIAN')) {
    semaforo_peatones = 'VERDE';
  } else if (state.includes('RED_PEDESTRIAN')) {
    semaforo_peatones = 'ROJO';
  }
  
  return {
    peatones_esperando: payloadESP32.pedestrians_waiting || 0,
    semaforo_autos,
    semaforo_peatones,
    mode: payloadESP32.mode || 'AUTO',
    time_remaining_ms: payloadESP32.time_remaining_ms || 0,
    timestamp: payloadESP32.timestamp || 0
  };
};

// Validar configuración MQTT
export const validateMQTTConfig = (config) => {
  return {
    isValid: !!(config.broker && config.port && config.username && config.password),
    errors: {
      broker: !config.broker ? 'Broker no configurado' : null,
      port: !config.port ? 'Puerto no configurado' : null,
      username: !config.username ? 'Usuario no configurado' : null,
      password: !config.password ? 'Contraseña no configurada' : null
    }
  };
};

// Formatear logs con timestamp
export const logWithTimestamp = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString('es-ES');
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    mqtt: '📡'
  };
  
  console.log(`${icons[type]} [${timestamp}] ${message}`);
};
