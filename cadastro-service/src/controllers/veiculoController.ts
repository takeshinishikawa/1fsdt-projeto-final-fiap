import { NextFunction, Request, Response } from 'express';
import { VeiculoService } from '../services/veiculoService';

const veiculoService = new VeiculoService();

export const cadastrarVeiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const veiculo = await veiculoService.cadastrarVeiculo(req.body);
    res.status(201).json({ message: 'Veículo cadastrado com sucesso', veiculo });
  } catch (err: any) {
    // Usa status customizado se disponível
    const status = err.status || 500;

    // Erro de duplicidade de placa
    if (status === 409) {
      res.status(409).json({
        message: err.message,
        placa: err.placa
      });
      return;
    }

    // Erro de validação
    if (status === 400 && err.errors) {
      res.status(400).json({
        message: err.message,
        errors: err.errors
      });
      return;
    }

    // Outros erros (genérico)
    res.status(status).json({
      message: err.message || 'Erro ao cadastrar veículo',
      error: err.original || err
    });
  }
};
