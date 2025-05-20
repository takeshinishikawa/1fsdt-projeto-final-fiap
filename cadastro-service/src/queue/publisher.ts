import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import config from '../config/config';
import { IVeiculo } from '../models/Veiculos';

const QUEUE = 'veiculos';
const RABBITMQ_URL = config.msgBrokerUrl || 'amqp://guest:guest@rabbitmq:5672';

let connection: Connection | null = null;
let channel: Channel | null = null;
let isConnected = false;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    console.log('RabbitMQ - Conectado');

    connection.on('error', (err) => {
      console.error('RabbitMQ - Erro na conexão:', err.message);
      isConnected = false;
      reconnect();
    });

    connection.on('close', () => {
      console.log('RabbitMQ - Conexão fechada. Reconectando...');
      isConnected = false;
      reconnect();
    });

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    isConnected = true;
    console.log('RabbitMQ - Canal e fila prontos');
  } catch (err) {
    console.error('RabbitMQ - Falha na conexão inicial:', err);
    isConnected = false;
    reconnect();
  }
}

function reconnect() {
  if (connection) {
    connection.close().catch(() => {});
  }
  setTimeout(() => {
    console.log('RabbitMQ - Tentando reconexão ...');
    connectRabbitMQ();
  }, 5000);
}

connectRabbitMQ();

export async function publishVehicleEvent(vehicle: IVeiculo) {
  if (!isConnected || !channel) {
    throw new Error('RabbitMQ não está pronto');
  }
  try {
    channel.sendToQueue(
      QUEUE,
      Buffer.from(JSON.stringify(vehicle)),
      { persistent: true }
    );
    console.log(`RabbitMQ - ✅ Veículo publicado | Placa: ${vehicle.placa}`);
  } catch (err) {
    console.error(`RabbitMQ - ❌ Falha ao publicar veículo ${vehicle.placa}:`, err);
    throw err;
  }
}
