import { Activity, Users, AlertCircle } from 'lucide-react';

export const Estadisticas = ({ estadisticas, styles }) => {
  return (
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
          {estadisticas.promedio_peatones}
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
  );
};
