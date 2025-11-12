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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              🚦 Control de Semáforos ESP32
            </h1>
            <p className="text-slate-400">Sistema de gestión y monitoreo en tiempo real</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            esp32Conectado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <Wifi className="w-5 h-5" />
            <span className="font-semibold">
              {esp32Conectado ? 'ESP32 Conectado' : 'ESP32 Desconectado'}
            </span>
          </div>
        </div>

        {/* Estado Actual - Semáforos Animados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Semáforo de Autos (3 luces) */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🚗 Semáforo de Autos
            </h3>
            <div className="flex justify-center items-center">
              <div className="bg-slate-900 rounded-2xl p-6 border-4 border-slate-700">
                {/* Luz Roja */}
                <div className={`w-20 h-20 rounded-full mb-4 transition-all duration-500 ${
                  estado.semaforo_autos === 'ROJO' 
                    ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' 
                    : 'bg-red-950'
                }`} />
                
                {/* Luz Amarilla */}
                <div className={`w-20 h-20 rounded-full mb-4 transition-all duration-500 ${
                  estado.semaforo_autos === 'AMARILLO' 
                    ? 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)]' 
                    : 'bg-yellow-950'
                }`} />
                
                {/* Luz Verde */}
                <div className={`w-20 h-20 rounded-full transition-all duration-500 ${
                  estado.semaforo_autos === 'VERDE' 
                    ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8)]' 
                    : 'bg-green-950'
                }`} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                estado.semaforo_autos === 'ROJO' ? 'bg-red-500/20 text-red-400' : 
                estado.semaforo_autos === 'AMARILLO' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {estado.semaforo_autos}
              </span>
            </div>
            <div className="mt-3 text-center text-sm text-slate-400">
              Tiempo: {estado.semaforo_autos === 'VERDE' ? config.tiempo_verde_autos : 
                       estado.semaforo_autos === 'AMARILLO' ? config.tiempo_amarillo_autos :
                       config.tiempo_rojo_autos}s
            </div>
          </div>

          {/* Semáforo de Peatones (2 luces) */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🚶 Semáforo de Peatones
            </h3>
            <div className="flex justify-center items-center">
              <div className="bg-slate-900 rounded-2xl p-6 border-4 border-slate-700">
                {/* Luz Roja */}
                <div className={`w-24 h-24 rounded-full mb-6 transition-all duration-500 ${
                  estado.semaforo_peatones === 'ROJO' 
                    ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' 
                    : 'bg-red-950'
                }`} />
                
                {/* Luz Verde */}
                <div className={`w-24 h-24 rounded-full transition-all duration-500 ${
                  estado.semaforo_peatones === 'VERDE' 
                    ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8)]' 
                    : 'bg-green-950'
                }`} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                estado.semaforo_peatones === 'ROJO' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {estado.semaforo_peatones}
              </span>
            </div>
            <div className="mt-3 text-center text-sm text-slate-400">
              Tiempo: {estado.semaforo_peatones === 'VERDE' ? config.tiempo_verde_peatones : 
                       config.tiempo_rojo_peatones}s (Máx: {config.tiempo_maximo_peatones}s)
            </div>
          </div>
        </div>

        {/* Control de Peatones */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Peatones Esperando
          </h3>
          
          <div className="flex items-center gap-6 mb-4">
            <div className="text-6xl font-bold text-blue-400">
              {estado.peatones_esperando}
            </div>
            <div className="flex-1">
              {estado.peatones_esperando >= config.umbral_peatones && (
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-yellow-400 font-semibold">
                      ¡Activación automática!
                    </div>
                    <div className="text-sm text-yellow-300">
                      Umbral alcanzado ({config.umbral_peatones}+ peatones)
                    </div>
                  </div>
                </div>
              )}
              {estado.peatones_esperando > 0 && estado.peatones_esperando < config.umbral_peatones && (
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
                  <div className="text-blue-400">
                    Faltan {config.umbral_peatones - estado.peatones_esperando} peatones para activación automática
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => actualizarPeatones(estado.peatones_esperando + 1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              + Agregar Peatón
            </button>
            <button 
              onClick={() => actualizarPeatones(Math.max(0, estado.peatones_esperando - 1))}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
            >
              - Quitar Peatón
            </button>
            <button 
              onClick={() => actualizarPeatones(0)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Reset
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">
              💡 <strong>Tip:</strong> En producción, el ESP32 detectará automáticamente a los peatones con sensores
            </div>
          </div>
        </div>

        {/* Estadísticas del Día */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400">Cruces Hoy</span>
            </div>
            <div className="text-3xl font-bold">{estadisticas.total_cruces || 0}</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-slate-400">Total Peatones</span>
            </div>
            <div className="text-3xl font-bold">{estadisticas.total_peatones || 0}</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400">Promedio</span>
            </div>
            <div className="text-3xl font-bold">
              {estadisticas.promedio_peatones ? estadisticas.promedio_peatones.toFixed(1) : 0}
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-400">Auto-activaciones</span>
            </div>
            <div className="text-3xl font-bold">{estadisticas.activaciones_automaticas || 0}</div>
          </div>
        </div>

        {/* Histograma */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Historial de Cruces</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setPeriodo('24h')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  periodo === '24h' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                24 Horas
              </button>
              <button 
                onClick={() => setPeriodo('7d')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  periodo === '7d' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                7 Días
              </button>
              <button 
                onClick={() => setPeriodo('30d')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  periodo === '30d' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
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
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Legend />
              <Bar dataKey="total_peatones" fill="#3b82f6" name="Peatones" />
              <Bar dataKey="total_cruces" fill="#10b981" name="Cruces" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Configuración */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración de Tiempos
            </h3>
            <button 
              onClick={() => setEditandoConfig(!editandoConfig)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              {editandoConfig ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Verde Autos (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_verde_autos}
                onChange={(e) => setConfig({...config, tiempo_verde_autos: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Amarillo Autos (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_amarillo_autos}
                onChange={(e) => setConfig({...config, tiempo_amarillo_autos: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Rojo Autos (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_rojo_autos}
                onChange={(e) => setConfig({...config, tiempo_rojo_autos: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Verde Peatones (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_verde_peatones}
                onChange={(e) => setConfig({...config, tiempo_verde_peatones: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Rojo Peatones (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_rojo_peatones}
                onChange={(e) => setConfig({...config, tiempo_rojo_peatones: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Tiempo Máximo Peatones (seg)
              </label>
              <input 
                type="number"
                value={config.tiempo_maximo_peatones}
                onChange={(e) => setConfig({...config, tiempo_maximo_peatones: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Umbral de Peatones
              </label>
              <input 
                type="number"
                value={config.umbral_peatones}
                onChange={(e) => setConfig({...config, umbral_peatones: parseInt(e.target.value)})}
                disabled={!editandoConfig}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 disabled:opacity-50"
              />
            </div>
          </div>

          {editandoConfig && (
            <div className="mt-6">
              <button 
                onClick={guardarConfiguracion}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
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
