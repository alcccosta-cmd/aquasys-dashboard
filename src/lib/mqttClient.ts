// Em src/lib/mqttClient.ts
import mqtt from 'mqtt';

const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || '';
const options = {
  username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
};

// Criamos o cliente aqui, uma única vez.
const client = brokerUrl ? mqtt.connect(brokerUrl, options) : null;

if (client) {
  client.on('connect', () => {
    console.log('Cliente MQTT Centralizado: Conectado com sucesso!');
  });

  client.on('error', (err) => {
    console.error('Cliente MQTT Centralizado: Erro de conexão:', err);
    client.end();
  });
} else {
    console.error("Cliente MQTT Centralizado: URL do Broker não foi definida. O cliente não foi inicializado.");
}

export default client;