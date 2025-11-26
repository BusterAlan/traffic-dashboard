# 📋 Estructura del Proyecto - Traffic Dashboard

## 🏗️ Organización Modular

El proyecto ha sido refactorizado para una mejor mantenibilidad y escalabilidad.

```
src/
├── components/          # Componentes React reutilizables
│   ├── Header.js              # Encabezado con estado de conexión
│   ├── DebugPanel.js          # Panel de debug/info
│   ├── Semaforos.js           # Semáforo de autos y peatones
│   ├── PeatonesControl.js     # Control de peatones
│   ├── Estadisticas.js        # Tarjetas de estadísticas
│   └── Configuracion.js       # Panel de configuración
├── config/              # Configuraciones centralizadas
│   └── mqtt.config.js         # Configuración MQTT
├── hooks/               # Custom hooks React
│   └── useMQTT.js             # Hook para conexión MQTT
├── services/            # Lógica de negocio y servicios
│   └── mqtt.service.js        # Servicio MQTT singleton
├── styles/              # Estilos y temas
│   └── theme.js               # Temas y estilos centralizados
├── utils/               # Utilidades y helpers
│   └── mqtt.utils.js          # Funciones auxiliares MQTT
├── App.js               # Componente principal
└── index.js             # Punto de entrada
```

## 📦 Descripción de Carpetas

### `components/`
Componentes React presentacionales que no contienen lógica de negocio compleja.
- **Header**: Muestra el título y estado de conexiones (MQTT, ESP32)
- **DebugPanel**: Panel informativo para debugging
- **Semaforos**: Componentes visuales de semáforos
- **PeatonesControl**: Botones y contador de peatones
- **Estadisticas**: Tarjetas de métricas
- **Configuracion**: Formulario de configuración

### `config/`
Archivos de configuración que contienen constantes y valores por defecto.
- **mqtt.config.js**: URLs, credenciales y opciones MQTT

### `hooks/`
Custom hooks para lógica reutilizable de React.
- **useMQTT.js**: Hook que maneja:
  - Conexión MQTT
  - Heartbeat del ESP32
  - Publicación de configuración

### `services/`
Servicios que encapsulan la lógica de negocio (patrones como Singleton).
- **mqtt.service.js**: Clase singleton que gestiona:
  - Conexión con reintentos
  - Publicación y suscripción
  - Callbacks de eventos
  - Logging

### `styles/`
Estilos centralizados para fácil mantenimiento.
- **theme.js**: Función que retorna todos los estilos de la aplicación

### `utils/`
Funciones auxiliares y utilidades puras.
- **mqtt.utils.js**: 
  - `convertirEstadoESP32()`: Mapea formato ESP32 → Dashboard
  - `validateMQTTConfig()`: Valida configuración
  - `logWithTimestamp()`: Logging con timestamp

## 🔄 Flujo de Datos

```
MQTT Broker
    ↓
mqttService (Singleton)
    ↓
Hook useMQTT
    ↓
App.js (Estado)
    ↓
Componentes (Presentación)
```

## 🎯 Ventajas de esta Estructura

✅ **Separación de responsabilidades**: Cada archivo tiene un único propósito
✅ **Reutilización**: Componentes y hooks reutilizables
✅ **Testing**: Fácil de testear servicios y utilidades
✅ **Escalabilidad**: Simple agregar nuevos componentes
✅ **Mantenibilidad**: Cambios centralizados (config, estilos)
✅ **Singleton MQTT**: Una sola instancia de conexión

## 💡 Cómo Agregar Nuevas Funcionalidades

### Agregar un nuevo componente
1. Crear archivo en `components/`
2. Recibir props (estado, handlers, styles)
3. Importar en `App.js`

### Agregar una nueva utilidad
1. Crear función en `utils/mqtt.utils.js` o nuevo archivo
2. Exportar e importar en donde sea necesario

### Cambiar estilos
1. Modificar `styles/theme.js`
2. Los cambios se reflejan globalmente

### Agregar nueva configuración
1. Extender `config/mqtt.config.js`
2. Importar en los servicios necesarios

## 📡 Ejemplo de Integración

```javascript
// En un componente
const { mqttConectado, esp32Conectado } = useMQTT();

// En el servicio
mqttService.publish(MQTT_CONFIG.topics.config, payload);

// En un utility
const converted = convertirEstadoESP32(esp32Data);
```

## 🚀 Próximas Mejoras Recomendadas

- [ ] Context API para estado global
- [ ] Componentes de carga (Skeleton, Spinner)
- [ ] Tests unitarios para servicios
- [ ] Logger persistente
- [ ] Modo offline con caché
- [ ] Gráficos mejorados con Recharts
- [ ] Historial de eventos en localStorage
