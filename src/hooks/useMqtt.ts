// src/hooks/useMqtt.ts
"use client";

import { useEffect } from 'react';
import { useSensorStore } from '@/store/sensorStore';
import client from '@/lib/mqttClient';

const useMqtt = () => {
  // Extrai as funções diretamente para evitar recriação de objeto
  const addSensorData = useSensorStore((state) => state.addSensorData);
  const setActuatorState = useSensorStore((state) => state.setActuatorState);

  useEffect(() => {
    if (!client) return;

    const handleMessage = (topic: string, message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        if (topic === 'aquasys/telemetry/sensors') {
          addSensorData(data);
        } else if (topic === 'aquasys/telemetry/actuators') {
          setActuatorState(data.atuador, data.estado);
        }
      } catch (e) {
        console.error('Erro ao processar a mensagem JSON:', e);
      }
    };

    client.on('message', handleMessage);
    
    // Subscrições com tratamento de erro
    const subscriptions = [
      { topic: 'aquasys/telemetry/sensors', name: 'sensores' },
      { topic: 'aquasys/telemetry/actuators', name: 'atuadores' }
    ];

    subscriptions.forEach(({ topic, name }) => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Erro ao subscrever no tópico de ${name}:`, err);
        } else {
          console.log(`Inscrito no tópico de ${name}!`);
        }
      });
    });

    // Limpeza completa (remove listeners e unsubscribe)
    return () => {
      if (client) {
        client.off('message', handleMessage);
        subscriptions.forEach(({ topic }) => {
          client.unsubscribe(topic);
        });
      }
    };
  }, [addSensorData, setActuatorState]); // Dependências estáveis

  const publishCommand = (topic: string, message: string) => {
    if (client && client.connected) {
      client.publish(topic, message);
      return true;
    }
    console.error('Cliente MQTT não está conectado.');
    return false;
  };

  return { publishCommand };
};

export default useMqtt;