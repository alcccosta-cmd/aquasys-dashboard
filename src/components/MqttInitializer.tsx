// src/components/MqttInitializer.tsx
"use client";
import useMqtt from '@/hooks/useMqtt';

export default function MqttInitializer() {
  useMqtt(); // Inicializa o cliente MQTT
  return null; // Não renderiza nada
}