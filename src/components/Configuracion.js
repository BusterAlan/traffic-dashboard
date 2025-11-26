import { Settings, Clock } from 'lucide-react';

export const Configuracion = ({ 
  config, 
  setConfig, 
  editandoConfig, 
  setEditandoConfig, 
  guardarConfiguracion,
  mqttConectado,
  styles 
}) => {
  return (
    <div style={{...styles.card, marginTop: '32px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
        <h3 style={{fontSize: '20px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Settings size={20} />
          Configuración de Tiempos
        </h3>
        <button 
          onClick={() => setEditandoConfig(!editandoConfig)}
          style={styles.button('primary')}
        >
          {editandoConfig ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div style={styles.configGrid}>
        <div>
          <label style={styles.label}>
            <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
            Verde Autos (ms)
          </label>
          <input 
            type="number"
            value={config.green_time}
            onChange={(e) => setConfig({...config, green_time: parseInt(e.target.value)})}
            disabled={!editandoConfig}
            style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
          />
        </div>

        <div>
          <label style={styles.label}>
            <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
            Amarillo Autos (ms)
          </label>
          <input 
            type="number"
            value={config.yellow_time}
            onChange={(e) => setConfig({...config, yellow_time: parseInt(e.target.value)})}
            disabled={!editandoConfig}
            style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
          />
        </div>

        <div>
          <label style={styles.label}>
            <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
            Rojo Autos (ms)
          </label>
          <input 
            type="number"
            value={config.red_time}
            onChange={(e) => setConfig({...config, red_time: parseInt(e.target.value)})}
            disabled={!editandoConfig}
            style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
          />
        </div>
      </div>

      {editandoConfig && (
        <div style={{marginTop: '24px'}}>
          <button 
            onClick={guardarConfiguracion}
            style={{...styles.button('success'), width: '100%'}}
            disabled={!mqttConectado}
          >
            💾 Guardar y Enviar a ESP32 vía MQTT
          </button>
          {!mqttConectado && (
            <div style={{...styles.tipBox, marginTop: '12px', color: '#f87171'}}>
              ⚠️ No hay conexión MQTT. Verifica el broker.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
