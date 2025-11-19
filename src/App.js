import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Users, Clock, Activity, Settings, Wifi } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function TrafficDashboard() {
  const [estado, setEstado] = useState({
    peatones_esperando: 0,
    semaforo_autos: 'VERDE',
    semaforo_peatones: 'ROJO'
  });
  
  const [config, setConfig] = useState({
    tiempo_verde_autos: 30,
    tiempo_amarillo_autos: 3,
    tiempo_rojo_autos: 30,
    tiempo_verde_peatones: 20,
    tiempo_rojo_peatones: 40,
    tiempo_maximo_peatones: 90,
    umbral_peatones: 3
  });
  
  const [historial, setHistorial] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [periodo, setPeriodo] = useState('24h');
  const [editandoConfig, setEditandoConfig] = useState(false);
  const [esp32Conectado, setEsp32Conectado] = useState(true);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 2000);
    return () => clearInterval(interval);
  }, [periodo]);

  const cargarDatos = async () => {
    try {
      const [estadoRes, configRes, historialRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/estado`),
        fetch(`${API_URL}/config`),
        fetch(`${API_URL}/historial?periodo=${periodo}`),
        fetch(`${API_URL}/estadisticas`)
      ]);
      
      setEstado(await estadoRes.json());
      setConfig(await configRes.json());
      setHistorial(await historialRes.json());
      setEstadisticas(await statsRes.json());
      setEsp32Conectado(true);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setEsp32Conectado(false);
    }
  };

  const actualizarPeatones = async (cantidad) => {
    try {
      await fetch(`${API_URL}/peatones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_peatones: cantidad })
      });
      cargarDatos();
    } catch (err) {
      console.error('Error actualizando peatones:', err);
    }
  };

  const guardarConfiguracion = async () => {
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      setEditandoConfig(false);
      alert('✅ Configuración guardada y enviada al ESP32');
    } catch (err) {
      console.error('Error guardando configuración:', err);
      alert('❌ Error al guardar configuración');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: 'white',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '16px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '14px'
    },
    statusBadge: (connected) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      backgroundColor: connected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
      color: connected ? '#4ade80' : '#f87171'
    }),
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    grid4: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    },
    card: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #334155',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    semaforoContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    semaforoBox: {
      backgroundColor: '#0f172a',
      borderRadius: '16px',
      padding: '24px',
      border: '4px solid #334155'
    },
    luz: (color, activa) => ({
      width: color === 'amarillo' ? '80px' : '96px',
      height: color === 'amarillo' ? '80px' : '96px',
      borderRadius: '50%',
      marginBottom: color === 'verde-peatones' ? '0' : '24px',
      transition: 'all 0.5s ease',
      backgroundColor: activa ? 
        (color === 'rojo' ? '#ef4444' : color === 'amarillo' ? '#facc15' : '#22c55e') :
        (color === 'rojo' ? '#450a0a' : color === 'amarillo' ? '#422006' : '#052e16'),
      boxShadow: activa ? 
        (color === 'rojo' ? '0 0 30px rgba(239, 68, 68, 0.8)' : 
         color === 'amarillo' ? '0 0 30px rgba(250, 204, 21, 0.8)' : 
         '0 0 30px rgba(34, 197, 94, 0.8)') : 'none'
    }),
    estadoBadge: (estado) => ({
      textAlign: 'center',
      marginTop: '16px',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '24px',
      fontWeight: 'bold',
      display: 'inline-block',
      backgroundColor: estado === 'ROJO' ? 'rgba(239, 68, 68, 0.2)' : 
                       estado === 'AMARILLO' ? 'rgba(250, 204, 21, 0.2)' :
                       'rgba(34, 197, 94, 0.2)',
      color: estado === 'ROJO' ? '#f87171' : 
             estado === 'AMARILLO' ? '#fbbf24' :
             '#4ade80'
    }),
    infoText: {
      textAlign: 'center',
      marginTop: '12px',
      fontSize: '14px',
      color: '#94a3b8'
    },
    peatonesDisplay: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    },
    peatonesNumero: {
      fontSize: '72px',
      fontWeight: 'bold',
      color: '#3b82f6'
    },
    alert: (type) => ({
      backgroundColor: type === 'warning' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(59, 130, 246, 0.2)',
      border: `1px solid ${type === 'warning' ? '#facc15' : '#3b82f6'}`,
      borderRadius: '8px',
      padding: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1,
      animation: type === 'warning' ? 'pulse 2s infinite' : 'none'
    }),
    alertText: (type) => ({
      color: type === 'warning' ? '#fbbf24' : '#60a5fa',
      fontWeight: '600'
    }),
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    button: (variant) => ({
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
      backgroundColor: variant === 'primary' ? '#3b82f6' :
                       variant === 'secondary' ? '#475569' :
                       variant === 'danger' ? '#dc2626' :
                       variant === 'success' ? '#16a34a' : '#3b82f6',
      color: 'white'
    }),
    statCard: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #334155'
    },
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '36px',
      fontWeight: 'bold'
    },
    periodButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    periodButton: (active) => ({
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
      fontSize: '14px',
      backgroundColor: active ? '#3b82f6' : '#475569',
      color: 'white'
    }),
    input: {
      width: '100%',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '8px 12px',
      color: 'white',
      fontSize: '14px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      color: '#94a3b8',
      marginBottom: '8px'
    },
    configGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px'
    },
    tipBox: {
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#0f172a',
      borderRadius: '8px',
      border: '1px solid #334155',
      fontSize: '14px',
      color: '#94a3b8'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              🚦 Control de Semáforos ESP32
            </h1>
            <p style={styles.subtitle}>Sistema de gestión y monitoreo en tiempo real</p>
          </div>
          <div style={styles.statusBadge(esp32Conectado)}>
            <Wifi size={20} />
            <span>{esp32Conectado ? 'ESP32 Conectado' : 'ESP32 Desconectado'}</span>
          </div>
        </div>

        {/* Semáforos */}
        <div style={styles.grid2}>
          {/* Semáforo de Autos */}
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
              Tiempo: {estado.semaforo_autos === 'VERDE' ? config.tiempo_verde_autos : 
                       estado.semaforo_autos === 'AMARILLO' ? config.tiempo_amarillo_autos :
                       config.tiempo_rojo_autos}s
            </div>
          </div>

          {/* Semáforo de Peatones */}
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
              Tiempo: {estado.semaforo_peatones === 'VERDE' ? config.tiempo_verde_peatones : 
                       config.tiempo_rojo_peatones}s (Máx: {config.tiempo_maximo_peatones}s)
            </div>
          </div>
        </div>

        {/* Control de Peatones */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <Users size={20} />
            Peatones Esperando
          </h3>
          
          <div style={styles.peatonesDisplay}>
            <div style={styles.peatonesNumero}>
              {estado.peatones_esperando}
            </div>
            <div style={{flex: 1}}>
              {estado.peatones_esperando >= config.umbral_peatones && (
                <div style={styles.alert('warning')}>
                  <AlertCircle size={20} />
                  <div>
                    <div style={styles.alertText('warning')}>
                      ¡Activación automática!
                    </div>
                    <div style={{fontSize: '12px', marginTop: '4px'}}>
                      Umbral alcanzado ({config.umbral_peatones}+ peatones)
                    </div>
                  </div>
                </div>
              )}
              {estado.peatones_esperando > 0 && estado.peatones_esperando < config.umbral_peatones && (
                <div style={styles.alert('info')}>
                  <div style={styles.alertText('info')}>
                    Faltan {config.umbral_peatones - estado.peatones_esperando} peatones para activación automática
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button 
              onClick={() => actualizarPeatones(estado.peatones_esperando + 1)}
              style={styles.button('primary')}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              + Agregar Peatón
            </button>
            <button 
              onClick={() => actualizarPeatones(Math.max(0, estado.peatones_esperando - 1))}
              style={styles.button('secondary')}
              onMouseOver={(e) => e.target.style.backgroundColor = '#334155'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#475569'}
            >
              - Quitar Peatón
            </button>
            <button 
              onClick={() => actualizarPeatones(0)}
              style={styles.button('danger')}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Reset
            </button>
          </div>
          
          <div style={styles.tipBox}>
            💡 <strong>Tip:</strong> En producción, el ESP32 detectará automáticamente a los peatones con sensores
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{...styles.grid4, marginTop: '32px'}}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <Activity size={20} color="#3b82f6" />
              <span style={{color: '#94a3b8', fontSize: '14px'}}>Cruces Hoy</span>
            </div>
            <div style={styles.statValue}>{estadisticas.total_cruces || 0}</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <Users size={20} color="#22c55e" />
              <span style={{color: '#94a3b8', fontSize: '14px'}}>Total Peatones</span>
            </div>
            <div style={styles.statValue}>{estadisticas.total_peatones || 0}</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <Users size={20} color="#a855f7" />
              <span style={{color: '#94a3b8', fontSize: '14px'}}>Promedio</span>
            </div>
            <div style={styles.statValue}>
              {estadisticas.promedio_peatones ? estadisticas.promedio_peatones.toFixed(1) : 0}
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <AlertCircle size={20} color="#facc15" />
              <span style={{color: '#94a3b8', fontSize: '14px'}}>Auto-activaciones</span>
            </div>
            <div style={styles.statValue}>{estadisticas.activaciones_automaticas || 0}</div>
          </div>
        </div>

        {/* Histograma */}
        <div style={{...styles.card, marginTop: '32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
            <h3 style={{fontSize: '20px', fontWeight: '600', margin: 0}}>Historial de Cruces</h3>
            <div style={styles.periodButtons}>
              <button 
                onClick={() => setPeriodo('24h')}
                style={styles.periodButton(periodo === '24h')}
              >
                24 Horas
              </button>
              <button 
                onClick={() => setPeriodo('7d')}
                style={styles.periodButton(periodo === '7d')}
              >
                7 Días
              </button>
              <button 
                onClick={() => setPeriodo('30d')}
                style={styles.periodButton(periodo === '30d')}
              >
                30 Días
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historial}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="periodo" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="total_peatones" fill="#3b82f6" name="Peatones" />
              <Bar dataKey="total_cruces" fill="#10b981" name="Cruces" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Configuración */}
        <div style={{...styles.card, marginTop: '32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
            <h3 style={{fontSize: '20px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Settings size={20} />
              Configuración de Tiempos
            </h3>
            <button 
              onClick={() => setEditandoConfig(!editandoConfig)}
              style={styles.button('primary')}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              {editandoConfig ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <div style={styles.configGrid}>
            <div>
              <label style={styles.label}>
                <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
                Verde Autos (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_verde_autos}
                onChange={(e) => setConfig({...config, tiempo_verde_autos: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
              />
            </div>

            <div>
              <label style={styles.label}>
                <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
                Amarillo Autos (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_amarillo_autos}
                onChange={(e) => setConfig({...config, tiempo_amarillo_autos: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
              />
            </div>

            <div>
              <label style={styles.label}>
                <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
                Rojo Autos (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_rojo_autos}
                onChange={(e) => setConfig({...config, tiempo_rojo_autos: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
              />
            </div>

            <div>
              <label style={styles.label}>
                <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
                Verde Peatones (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_verde_peatones}
                onChange={(e) => setConfig({...config, tiempo_verde_peatones: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
              />
            </div>

            <div>
              <label style={styles.label}>
                <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
                Rojo Peatones (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_rojo_peatones}
                onChange={(e) => setConfig({...config, tiempo_rojo_peatones: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
              />
            </div>

            <div>
              <label style={styles.label}>
                <Clock size={16} style={{display: 'inline', marginRight: '4px'}} />
                Tiempo Máximo Peatones (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_maximo_peatones}
                onChange={(e) => setConfig({...config, tiempo_maximo_peatones: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                style={{...styles.input, opacity: editandoConfig ? 1 : 0.5}}
              />
            </div>

            <div>
              <label style={styles.label}>
                <Users size={16} style={{display: 'inline', marginRight: '4px'}} />
                Umbral de Peatones
              </label>
              <input 
                type="number"
                value={config.umbral_peatones}
                onChange={(e) => setConfig({...config, umbral_peatones: parseInt(e.target.value)})}
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
                onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
              >
                💾 Guardar y Enviar a ESP32
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
