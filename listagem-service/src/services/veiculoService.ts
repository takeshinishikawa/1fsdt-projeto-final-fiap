import Veiculo, { IVeiculo } from '../models/Veiculos';

interface FiltrosVeiculo {
  marca?: string;
  ano?: number;
}

export class VeiculoService {
  // Salva um novo veículo no banco de dados (com upsert para idempotência)
  async salvarVeiculo(dados: IVeiculo): Promise<IVeiculo | null> {
    // Atualiza se já existe, senão insere
    await Veiculo.updateOne(
      { placa: dados.placa },
      { $set: dados },
      { upsert: true }
    );
    // Retorna o documento atualizado/criado
    return Veiculo.findOne({ placa: dados.placa });
  }

  // Lista veículos com filtros opcionais
  async listarVeiculos(filtros: FiltrosVeiculo): Promise<IVeiculo[]> {
    const query: any = {};
    if (filtros.marca) query.marca = filtros.marca;
    if (filtros.ano) query.ano = filtros.ano;
    return Veiculo.find(query);
  }

  // Busca veículo por placa (único)
  async buscarPorPlaca(placa: string): Promise<IVeiculo | null> {
    return Veiculo.findOne({ placa });
  }

  // Busca veículos por marca
  async buscarPorMarca(marca: string): Promise<IVeiculo[]> {
    return Veiculo.find({ marca });
  }

  // Busca veículos por ano
  async buscarPorAno(ano: number): Promise<IVeiculo[]> {
    return Veiculo.find({ ano });
  }
}
