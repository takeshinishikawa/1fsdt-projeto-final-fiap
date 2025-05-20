import Veiculo, { IVeiculo } from '../models/Veiculos';
import { publishVehicleEvent } from '../queue/publisher';
import mongoose from 'mongoose';

export class VeiculoService {
  async cadastrarVeiculo(dados: Partial<IVeiculo>) {
    // Validação de campos obrigatórios
    const { marca, modelo, ano, placa } = dados;
    if (!marca || !modelo || !ano || !placa) {
      const error = new Error('Dados obrigatórios faltando');
      (error as any).status = 400;
      throw error;
    }

    // Salva no banco primeiro
    let veiculo;
    try {
      veiculo = await Veiculo.create({ marca, modelo, ano, placa });
    } catch (err: any) {
      // Erro de duplicidade de placa
      if (err.code === 11000 && err.keyPattern && err.keyPattern.placa) {
        const error = new Error('Já existe um veículo cadastrado com esta placa.');
        (error as any).status = 409;
        (error as any).placa = err.keyValue?.placa;
        throw error;
      }
      // Erro de validação
      if (err.name === 'ValidationError' && err.errors) {
        const erros: Record<string, string> = {};
        Object.keys(err.errors).forEach((campo) => {
          erros[campo] = err.errors[campo].message;
        });
        const error = new Error('Dados inválidos para cadastro de veículo.');
        (error as any).status = 400;
        (error as any).errors = erros;
        throw error;
      }
      // Outros erros
      const error = new Error('Erro ao cadastrar veículo');
      (error as any).status = 500;
      (error as any).original = err;
      throw error;
    }

    // Só publica no RabbitMQ se o veículo foi salvo com sucesso
    try {
      // Use o próprio objeto salvo para publicar (garante dados válidos)
      await publishVehicleEvent(veiculo.toObject());
    } catch (err) {
      // Se der erro ao publicar, você pode optar por deletar o registro ou só logar
      // Aqui apenas lança erro, mas o veículo já estará salvo no banco
      const error = new Error('Erro ao publicar evento no RabbitMQ');
      (error as any).status = 500;
      (error as any).original = err;
      throw error;
    }

    return veiculo;
  }
}
