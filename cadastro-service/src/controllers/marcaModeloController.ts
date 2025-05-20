import { Request, Response, NextFunction } from 'express';
import { MarcaModeloService } from '../services/marcaModeloService';
import MarcaModelo from '../models/MarcaModelo';

const marcaModeloService = new MarcaModeloService();

export const cadastrarMarcasModelosEmLote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const results = await marcaModeloService.cadastrarMarcasModelosLote(req.body);
    res.status(201).json({ message: 'Marcas/modelos cadastrados/atualizados com sucesso.', results });
  } catch (err: any) {
    const status = err.status || 500;
    if (status === 409) {
      res.status(409).json({ message: err.message });
      return;
    }
    if (status === 400 && err.errors) {
      res.status(400).json({
        message: err.message,
        errors: err.errors
      });
      return;
    }
    res.status(status).json({
      message: err.message || 'Erro ao cadastrar marcas/modelos em lote',
      error: err.original || err
    });
  }
};

export const listarMarcasModelos = async (req: Request, res: Response) => {
    try {
      const marcasModelos = await MarcaModelo.find({});
      res.json(marcasModelos);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar marcas/modelos', error: err });
    }
  };