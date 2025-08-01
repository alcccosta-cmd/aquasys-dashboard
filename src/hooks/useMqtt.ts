"use client";

import { useEffect, useCallback } from 'react';
import { useSensorStore } from '@/store/sensorStore';
import client from '@/lib/mqttClient'; // Importa o nosso cliente centralizado

const useMqtt = () => {
  const addSensorData = useSensorStore(state => state.addSensorData);
  const setActuatorState = useSensorStore(state => state.setActuatorState);

  useEffect(() => {
    // Se o cliente não foi inicializado, não faz nada
    if (!client) return;
    
    // Referência segura para o cliente
    const mqttClient = client;

    const handleMessage = (topic: string, message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        if (topic === 'aquasys/telemetry/sensors') {
          addSensorData(data);
        } else if (topic === 'aquasys/telemetry/actuators') {
          setActuatorState(data.atuador, data.estado);
        }
      } catch (e) { 
        console.error('Erro ao processar JSON:', e); 
      }
    };
    
    // Adiciona o "ouvinte" de mensagens
    mqttClient.on('message', handleMessage);

    // Função para realizar as inscrições
    const subscribeTopics = () => {
      mqttClient.subscribe('aquasys/telemetry/sensors');
      mqttClient.subscribe('aquasys/telemetry/actuators');
    };

    // Subscreve aos tópicos conforme estado de conexão
    if (mqttClient.connected) {
      subscribeTopics();
    } else {
      const connectHandler = () => {
        subscribeTopics();
        mqttClient.off('connect', connectHandler);
      };
      mqttClient.on('connect', connectHandler);
    }

    // Função de limpeza
    return () => {
      mqttClient.off('message', handleMessage);
    };
  }, [addSensorData, setActuatorState]);

  const publishCommand = useCallback((topic: string, message: string): boolean => {
    if (client && client.connected) {
      client.publish(topic, message);
      return true;
    }
    return false;
  }, []);

  return { publishCommand };
};

export default useMqtt;