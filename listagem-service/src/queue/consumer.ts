console.log("RabbitMQ - consumer.ts inicializado");

import * as amqp from "amqplib";
import config from "../config/config";
import { salvarVeiculoEvento } from "../controllers/veiculoController";

const QUEUE = "veiculos";
const RABBITMQ_URL = config.msgBrokerUrl || "amqp://guest:guest@rabbitmq:5672";

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;
let isConnecting = false;

async function startConsumer() {
  console.log("RabbitMQ - Iniciando consumer...");
  if (isConnecting) return;
  isConnecting = true;

  try {
    console.log("RabbitMQ - Tentando conectar:", RABBITMQ_URL);

    connection = await amqp.connect(RABBITMQ_URL);
    console.log("RabbitMQ - Conexão estabelecida");

    connection.on("error", (err) => {
      console.error("RabbitMQ - Erro na conexão:", err.message);
      reconnect();
    });

    connection.on("close", () => {
      console.log("RabbitMQ - Conexão fechada pelo servidor");
      reconnect();
    });

    console.log("RabbitMQ - Criando canal...");
    channel = await connection.createChannel();
    
    await channel.assertQueue(QUEUE, { durable: true });
    console.log("RabbitMQ - Canal e fila prontos");

    channel.consume(QUEUE, async (msg: amqp.ConsumeMessage | null) => {
      if (!msg) return;

      try {
        console.log("RabbitMQ - Mensagem recebida:", msg.content.toString());
        const data = JSON.parse(msg.content.toString());
        
        await salvarVeiculoEvento(data);
        channel!.ack(msg);
        console.log("RabbitMQ - Mensagem processada com sucesso");
      } catch (err) {
        console.error("RabbitMQ - Erro no processamento:", err);
        channel!.nack(msg, false, false);
      }
    });

  } catch (err) {
    console.error("RabbitMQ - Falha crítica:", err);
    reconnect();
  } finally {
    isConnecting = false;
  }
}

function reconnect() {
  if (connection) {
    try {
      console.log("RabbitMQ - Encerrando conexão existente...");
      connection.close();
    } catch (err) {
      console.error("RabbitMQ - Erro ao fechar conexão:", err);
    } finally {
      connection = null;
      channel = null;
    }
  }

  console.log("RabbitMQ - Agendando reconexão em 5 segundos...");
  setTimeout(() => {
    console.log("RabbitMQ - Nova tentativa de conexão...");
    startConsumer();
  }, 5000);
}

export function consumeVehicleEvents() {
  console.log("RabbitMQ - Iniciando consumo de eventos");
  startConsumer();
}
