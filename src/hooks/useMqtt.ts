"use client";

import { useEffect } from 'react';
import { useSensorStore } from '@/store/sensorStore';
import client from '@/lib/mqttClient'; // Importa o nosso cliente centralizado

const useMqtt = () => {
  const addSensorData = useSensorStore(state => state.addSensorData);
  const setActuatorState = useSensorStore(state => state.setActuatorState);

  useEffect(() => {
    // Se o cliente não foi inicializado (ex: URL do broker em falta), não faz nada.
    if (!client) return;

    const handleMessage = (topic: string, message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        if (topic === 'aquasys/telemetry/sensors') {
          addSensorData(data);
        } else if (topic === 'aquasys/telemetry/actuators') {
          setActuatorState(data.atuador, data.estado);
        }
      } catch (e) { console.error('Erro ao processar JSON:', e); }
    };
    
    // Adiciona o "ouvinte" de mensagens
    client.on('message', handleMessage);

    // Garante que só subscrevemos se o cliente já estiver conectado.
    if (client.connected) {
      client.subscribe('aquasys/telemetry/sensors');
      client.subscribe('aquasys/telemetry/actuators');
    } else {
      // Se não estiver conectado, espera pelo evento 'connect' para subscrever.
      client.on('connect', () => {
        client.subscribe('aquasys/telemetry/sensors');
        client.subscribe('aquasys/telemetry/actuators');
      });
    }

    // Função de "limpeza": remove o "ouvinte" para evitar duplicatas
    return () => {
      if (client) {
        client.off('message', handleMessage);
      }
    };
  }, [addSensorData, setActuatorState]);

  const publishCommand = (topic: string, message: string): boolean => {
    if (client && client.connected) {
      client.publish(topic, message);
      return true;
    }
    return false;
  };

  return { publishCommand };
};

export default useMqtt;