import express from 'express';
import veiculosRouter from './routes/veiculos';
import { connectDB } from './config/database';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger/swaggerOptions';
import { consumeVehicleEvents } from './queue/consumer'; // Importa o consumer

const app = express();
app.use(express.json());
app.use(veiculosRouter);

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

connectDB();

consumeVehicleEvents();

app.listen(config.port, () => {
  console.log(`Listagem-service rodando na porta ${config.port}`);
});
