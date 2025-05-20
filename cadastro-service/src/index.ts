import express from 'express';
import veiculosRouter from './routes/veiculos';
import marcasModelosRouter from './routes/marcasModelos';
import { connectDB } from './config/database';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger/swaggerOptions';

const app = express();
app.use(express.json());
app.use(veiculosRouter);
app.use(marcasModelosRouter);
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

connectDB();

app.listen(config.port, () => {
  console.log(`Cadastro-service rodando na porta ${config.port}`);
});
