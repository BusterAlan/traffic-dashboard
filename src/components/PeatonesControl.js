import { Users, AlertCircle } from 'lucide-react';

export const PeatonesControl = ({ estado, actualizarPeatones, styles }) => {
  return (
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
          {estado.peatones_esperando >= 3 && (
            <div style={styles.alert('warning')}>
              <AlertCircle size={20} />
              <div>
                <div style={styles.alertText('warning')}>
                  ¡Activación automática!
                </div>
                <div style={{fontSize: '12px', marginTop: '4px'}}>
                  Umbral alcanzado (3+ peatones)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button 
          onClick={() => actualizarPeatones(estado.peatones_esperando + 1)}
          style={styles.button('primary')}
        >
          + Agregar Peatón
        </button>
        <button 
          onClick={() => actualizarPeatones(Math.max(0, estado.peatones_esperando - 1))}
          style={styles.button('secondary')}
        >
          - Quitar Peatón
        </button>
        <button 
          onClick={() => actualizarPeatones(0)}
          style={styles.button('danger')}
        >
          Reset
        </button>
      </div>
      
      <div style={styles.tipBox}>
        💡 <strong>Modo Demo:</strong> En producción, el ESP32 detectará automáticamente a los peatones con sensores
      </div>
    </div>
  );
};
