import { Router } from 'express';
import {
  listarVeiculos,
  buscarVeiculoPorPlaca,
  buscarVeiculosPorMarca,
  buscarVeiculosPorAno
} from '../controllers/veiculoController';

const router = Router();

router.get('/veiculos', listarVeiculos); // Filtros via query params: ?marca=Fiat&ano=2020
router.get('/veiculos/placa/:placa', buscarVeiculoPorPlaca);
router.get('/veiculos/marca/:marca', buscarVeiculosPorMarca);
router.get('/veiculos/ano/:ano', buscarVeiculosPorAno);

export default router;
