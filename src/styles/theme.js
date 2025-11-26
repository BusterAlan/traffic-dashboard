// Estilos centralizados para la aplicación
export const createStyles = () => {
  return {
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
    statusContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
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
    },
    debugPanel: {
      marginBottom: '32px',
      backgroundColor: '#0f172a',
      borderColor: '#475569'
    }
  };
};
