import { config } from "dotenv";
config();

export default {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/veiculos',
  port: process.env.PORT || 3001,
  msgBrokerUrl: process.env.MESSAGE_BROKER_URL || 'amqp://guest:guest@rabbitmq:5672'
};
