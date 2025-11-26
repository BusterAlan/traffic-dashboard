import { useEffect, useRef, useState } from 'react';
import mqttService from '../services/mqtt.service';
import { MQTT_CONFIG } from '../config/mqtt.config';

export const useMQTT = () => {
  const [mqttConectado, setMqttConectado] = useState(false);
  const [esp32Conectado, setEsp32Conectado] = useState(false);
  const heartbeatTimeoutRef = useRef(null);

  useEffect(() => {
    const handleConnect = () => {
      setMqttConectado(true);
      // Suscribirse a topics
      mqttService.subscribe([
        MQTT_CONFIG.topics.state,
        MQTT_CONFIG.topics.status
      ]);
    };

    const handleDisconnect = () => {
      setMqttConectado(false);
      setEsp32Conectado(false);
    };

    const handleError = () => {
      setMqttConectado(false);
      setEsp32Conectado(false);
    };

    // Conectar al broker
    mqttService.connect({
      onConnect: handleConnect,
      onDisconnect: handleDisconnect,
      onError: handleError
    });

    // Cleanup
    return () => {
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
      mqttService.disconnect();
    };
  }, []);

  // Manejar heartbeat
  const handleHeartbeat = () => {
    setEsp32Conectado(true);
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
    heartbeatTimeoutRef.current = setTimeout(() => {
      setEsp32Conectado(false);
    }, 45000);
  };

  // Publicar configuración
  const publicarConfiguracion = (config) => {
    const payload = {
      green_time: config.green_time,
      yellow_time: config.yellow_time,
      red_time: config.red_time
    };
    return mqttService.publish(MQTT_CONFIG.topics.config, payload);
  };

  return {
    mqttConectado,
    esp32Conectado,
    handleHeartbeat,
    publicarConfiguracion,
    mqttService
  };
};
