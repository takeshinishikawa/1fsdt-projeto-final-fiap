import { Router } from 'express';
import { cadastrarVeiculo } from '../controllers/veiculoController';

const router = Router();
router.post('/veiculos', cadastrarVeiculo);
export default router;
