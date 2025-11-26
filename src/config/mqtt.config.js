// Configuración MQTT centralizada
export const MQTT_CONFIG = {
  broker: process.env.REACT_APP_MQTT_BROKER || 'shinkansen.proxy.rlwy.net',
  port: parseInt(process.env.REACT_APP_MQTT_PORT) || 47186,
  username: process.env.REACT_APP_MQTT_USER || 'admin',
  password: process.env.REACT_APP_MQTT_PASSWORD || 'gfu24ozu4t323aapj7b1pqb04yh4a66l',
  topics: {
    state: process.env.REACT_APP_MQTT_TOPIC_STATE || 'trafficlight/state',
    status: process.env.REACT_APP_MQTT_TOPIC_STATUS || 'trafficlight/status',
    config: process.env.REACT_APP_MQTT_TOPIC_CONFIG || 'trafficlight/config/set'
  }
};

export const MQTT_OPTIONS = {
  reconnectPeriod: 5000,
  clean: true,
  keepalive: 60,
  rejectUnauthorized: false,
  protocolVersion: 4,
  connectTimeout: 10000
};

export const BROKER_URLS = [
  `ws://${MQTT_CONFIG.broker}:${MQTT_CONFIG.port}/mqtt`,
  `ws://${MQTT_CONFIG.broker}:${MQTT_CONFIG.port}`,
  `wss://${MQTT_CONFIG.broker}:${MQTT_CONFIG.port}/mqtt`,
  `wss://${MQTT_CONFIG.broker}:${MQTT_CONFIG.port}`
];
