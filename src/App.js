import { useState, useEffect } from 'react';
import { MQTT_CONFIG } from './config/mqtt.config';
import { convertirEstadoESP32 } from './utils/mqtt.utils';
import { useMQTT } from './hooks/useMQTT';
import { createStyles } from './styles/theme';
import mqttService from './services/mqtt.service';

// Componentes
import { Header } from './components/Header';
import { DebugPanel } from './components/DebugPanel';
import { SemaforoAutos, SemaforoPeatones } from './components/Semaforos';
import { PeatonesControl } from './components/PeatonesControl';
import { Estadisticas } from './components/Estadisticas';
import { Configuracion } from './components/Configuracion';

export default function TrafficDashboard() {
  // Estado del semáforo
  const [estado, setEstado] = useState({
    peatones_esperando: 0,
    semaforo_autos: 'VERDE',
    semaforo_peatones: 'ROJO'
  });
  
  // Configuración de tiempos
  const [config, setConfig] = useState({
    green_time: 30000,
    yellow_time: 3000,
    red_time: 30000
  });
  
  // Estadísticas
  const [estadisticas, setEstadisticas] = useState({
    total_cruces: 0,
    total_peatones: 0,
    promedio_peatones: 0,
    activaciones_automaticas: 0
  });
  
  // UI State
  const [editandoConfig, setEditandoConfig] = useState(false);
  
  // Hook MQTT personalizado
  const { mqttConectado, esp32Conectado, handleHeartbeat, publicarConfiguracion } = useMQTT();
  
  // Estilos
  const styles = createStyles();

  // Configurar listeners de MQTT
  useEffect(() => {
    const handleMessage = (topic, payload) => {
      try {
        const data = JSON.parse(payload);
        
        if (topic === MQTT_CONFIG.topics.state) {
          const estadoConvertido = convertirEstadoESP32(data);
          setEstado(estadoConvertido);
        } 
        else if (topic === MQTT_CONFIG.topics.status) {
          handleHeartbeat();
        }
      } catch (err) {
        console.error('Error procesando mensaje MQTT:', err);
      }
    };

    mqttService.callbacks.onMessage = handleMessage;
    
    return () => {
      mqttService.callbacks.onMessage = null;
    };
  }, [handleHeartbeat]);

  // Actualizar peatones
  const actualizarPeatones = (cantidad) => {
    setEstado(prev => ({
      ...prev,
      peatones_esperando: cantidad
    }));
  };

  // Guardar configuración
  const guardarConfiguracion = () => {
    const exito = publicarConfiguracion(config);
    if (exito) {
      setEditandoConfig(false);
      alert('✅ Configuración enviada al ESP32');
    } else {
      alert('❌ Error: No hay conexión MQTT');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        
        {/* Header */}
        <Header 
          mqttConectado={mqttConectado} 
          esp32Conectado={esp32Conectado} 
          styles={styles} 
        />

        {/* Semáforos */}
        <div style={styles.grid2}>
          <SemaforoAutos estado={estado} styles={styles} />
          <SemaforoPeatones estado={estado} styles={styles} />
        </div>

        {/* Control de Peatones */}
        <PeatonesControl 
          estado={estado} 
          actualizarPeatones={actualizarPeatones} 
          styles={styles} 
        />

        {/* Estadísticas */}
        <Estadisticas estadisticas={estadisticas} styles={styles} />

        {/* Configuración */}
        <Configuracion 
          config={config}
          setConfig={setConfig}
          editandoConfig={editandoConfig}
          setEditandoConfig={setEditandoConfig}
          guardarConfiguracion={guardarConfiguracion}
          mqttConectado={mqttConectado}
          styles={styles}
        />

        {/* Debug Panel */}
        <br></br>
        <DebugPanel 
          mqttConectado={mqttConectado}
          esp32Conectado={esp32Conectado}
          styles={styles}
          config={MQTT_CONFIG}
        />
      </div>
    </div>
  );
}
