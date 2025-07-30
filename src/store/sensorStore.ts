// Em src/store/sensorStore.ts
import { create } from 'zustand';

// A "forma" dos nossos dados, agora com os novos campos calibrados
export interface SensorData {
  timestamp: number;
  temp_agua?: number;
  temp_amb?: number;
  umidade?: number;
  tds_raw?: number;
  ph_raw?: number;
  ph_value?: number;   // <-- NOVO
  tds_ec?: number;     // <-- NOVO
  tds_ppm?: number;    // <-- NOVO
  distancia_cm?: number;
}

interface ActuatorStates {
  [key: string]: 'ON' | 'OFF';
}

interface AppState {
  latestData: SensorData;
  dataHistory: SensorData[];
  actuatorStates: ActuatorStates;
  addSensorData: (newData: Omit<SensorData, 'timestamp'>) => void;
  setActuatorState: (atuador: string, estado: 'ON' | 'OFF') => void;
}

const MAX_HISTORY_LENGTH = 100;

export const useSensorStore = create<AppState>((set) => ({
  latestData: { timestamp: 0 },
  dataHistory: [],
  actuatorStates: {},
  
  addSensorData: (newData) => set((state) => {
    const newEntry: SensorData = { ...newData, timestamp: Date.now() };
    const newHistory = [newEntry, ...state.dataHistory];
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory.pop();
    }
    return {
      latestData: newEntry,
      dataHistory: newHistory,
    };
  }),

  setActuatorState: (atuador, estado) => set((state) => ({
    actuatorStates: {
      ...state.actuatorStates,
      [atuador]: estado,
    },
  })),
}));