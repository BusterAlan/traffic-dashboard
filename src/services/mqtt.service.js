import mqtt from 'mqtt';
import { MQTT_CONFIG, MQTT_OPTIONS, BROKER_URLS } from '../config/mqtt.config';
import { logWithTimestamp } from '../utils/mqtt.utils';

class MQTTService {
  constructor() {
    this.client = null;
    this.currentUrlIndex = 0;
    this.callbacks = {
      onConnect: null,
      onDisconnect: null,
      onMessage: null,
      onError: null
    };
  }

  // Conectar con reintentos automáticos
  connect(callbacks = {}) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    this.currentUrlIndex = 0;
    this._connectWithRetry();
  }

  _connectWithRetry = () => {
    const brokerUrl = BROKER_URLS[this.currentUrlIndex];
    logWithTimestamp(`Intento ${this.currentUrlIndex + 1}: Conectando a ${brokerUrl}`, 'mqtt');

    this.client = mqtt.connect(brokerUrl, {
      username: MQTT_CONFIG.username,
      password: MQTT_CONFIG.password,
      clientId: `dashboard_${Math.random().toString(16).slice(2, 8)}`,
      ...MQTT_OPTIONS
    });

    this.client.on('connect', () => {
      logWithTimestamp(`CONECTADO al broker en: ${brokerUrl}`, 'success');
      if (this.callbacks.onConnect) this.callbacks.onConnect();
    });

    this.client.on('message', (topic, message) => {
      const payload = message.toString();
      logWithTimestamp(`Mensaje en [${topic}]: ${payload}`, 'mqtt');
      if (this.callbacks.onMessage) this.callbacks.onMessage(topic, payload);
    });

    this.client.on('error', (err) => {
      logWithTimestamp(`Error en intento ${this.currentUrlIndex + 1}: ${err.message}`, 'error');
      if (this.currentUrlIndex < BROKER_URLS.length - 1) {
        this.currentUrlIndex++;
        logWithTimestamp(`Esperando 3 segundos antes de intentar la siguiente URL...`, 'warning');
        setTimeout(this._connectWithRetry, 3000);
      } else {
        logWithTimestamp(`Todas las URLs fallaron. Verifica la configuración del broker.`, 'error');
        if (this.callbacks.onError) this.callbacks.onError(err);
      }
    });

    this.client.on('offline', () => {
      logWithTimestamp(`Cliente MQTT offline`, 'warning');
    });

    this.client.on('close', () => {
      logWithTimestamp(`Desconectado del broker MQTT`, 'warning');
      if (this.callbacks.onDisconnect) this.callbacks.onDisconnect();
    });

    this.client.on('reconnect', () => {
      logWithTimestamp(`Intentando reconectar...`, 'warning');
    });
  };

  // Suscribirse a topics
  subscribe(topics) {
    if (!this.client) {
      logWithTimestamp(`No hay conexión MQTT`, 'error');
      return;
    }

    const topicList = Array.isArray(topics) ? topics : [topics];
    this.client.subscribe(topicList, (err) => {
      if (err) {
        logWithTimestamp(`Error suscribiendo a topics: ${err}`, 'error');
      } else {
        logWithTimestamp(`Suscrito a: ${topicList.join(', ')}`, 'success');
      }
    });
  }

  // Publicar mensaje
  publish(topic, payload, options = {}) {
    if (!this.client || !this.client.connected) {
      logWithTimestamp(`No hay conexión MQTT. No se pudo publicar en ${topic}`, 'error');
      return false;
    }

    this.client.publish(topic, JSON.stringify(payload), { qos: 1, ...options }, (err) => {
      if (err) {
        logWithTimestamp(`Error publicando en ${topic}: ${err}`, 'error');
      } else {
        logWithTimestamp(`Publicado en ${topic}: ${JSON.stringify(payload)}`, 'success');
      }
    });

    return true;
  }

  // Desconectar
  disconnect() {
    if (this.client) {
      this.client.end();
      logWithTimestamp(`Conexión MQTT cerrada`, 'info');
    }
  }

  // Obtener estado de conexión
  isConnected() {
    return this.client && this.client.connected;
  }
}

export default new MQTTService();
