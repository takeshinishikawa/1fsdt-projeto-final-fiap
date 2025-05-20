import { Request, Response } from 'express';
import { VeiculoService } from '../services/veiculoService';

const veiculoService = new VeiculoService();

// Listar todos os veículos, com filtros opcionais por marca e ano
export const listarVeiculos = async (req: Request, res: Response) => {
  try {
    const filtros: any = {};
    if (req.query.marca) filtros.marca = req.query.marca;
    if (req.query.ano) filtros.ano = Number(req.query.ano);

    const veiculos = await veiculoService.listarVeiculos(filtros);
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar veículos', error });
  }
};

// Buscar veículo por placa
export const buscarVeiculoPorPlaca = async (req: Request, res: Response) => {
  try {
    const { placa } = req.params;
    if (!placa) {
      res.status(400).json({ message: 'Placa não informada' });
    }
    const veiculo = await veiculoService.buscarPorPlaca(placa);
    if (!veiculo) {
      res.status(404).json({ message: 'Veículo não encontrado' });
    }
    res.json(veiculo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar veículo', error });
  }
};

// Buscar veículos por marca
export const buscarVeiculosPorMarca = async (req: Request, res: Response) => {
  try {
    const { marca } = req.params;
    if (!marca) {
      res.status(400).json({ message: 'Marca não informada' });
    }
    const veiculos = await veiculoService.listarVeiculos({ marca });
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar veículos por marca', error });
  }
};

// Buscar veículos por ano
export const buscarVeiculosPorAno = async (req: Request, res: Response) => {
  try {
    const { ano } = req.params;
    if (!ano) {
      res.status(400).json({ message: 'Ano não informado' });
    }
    const veiculos = await veiculoService.listarVeiculos({ ano: Number(ano) });
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar veículos por ano', error });
  }
};

// Para salvar via evento RabbitMQ:
export const salvarVeiculoEvento = async (dados: any) => {
  await veiculoService.salvarVeiculo(dados);
};
