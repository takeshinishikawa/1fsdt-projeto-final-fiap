import { Router } from 'express';
import { cadastrarMarcasModelosEmLote, listarMarcasModelos } from '../controllers/marcaModeloController';

const router = Router();
router.post('/marcas-modelos/lote', cadastrarMarcasModelosEmLote);
router.get('/marcas-modelos', listarMarcasModelos);

export default router;
