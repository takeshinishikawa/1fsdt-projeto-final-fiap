import { Schema, model, Document } from 'mongoose';
import { getMarcasModelos } from '../utils/marcaModelosHelper';
import { IMarcaModelo } from './MarcaModelo';

export interface IVeiculo extends Document {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
}

const regexPlacaAntiga = /^[A-Z]{3}-?\d{4}$/;
const regexPlacaNova = /^[A-Z]{3}\d[A-Z]\d{2}$/;
const anoMinimo = 1886;
const anoMaximo = new Date().getFullYear() + 1;

const VeiculoSchema = new Schema<IVeiculo>({
  marca: {
    type: String,
    required: true,
    uppercase: true,
    validate: {
      validator: async function (v: string) {
        const marcasModelos = await getMarcasModelos();
        return Object.keys(marcasModelos).includes(v.toUpperCase());
      },
      message: (props: any) => `Marca inválida: ${props.value}`
    }
  },
  modelo: {
    type: String,
    required: true,
    validate: {
      validator: async function (v: string) {
        const marca = (this as IVeiculo).marca;
        if (!marca) return false;
        const marcasModelos = await getMarcasModelos();
        const modelos = marcasModelos[marca.toUpperCase()];
        return modelos ? modelos.includes(v.toUpperCase()) : false;
      },
      message: (props: any) => `Modelo inválido para a marca selecionada: ${props.value}`
    }
  },
  ano: {
    type: Number,
    required: true,
    validate: {
      validator: (v: number) => v >= anoMinimo && v <= anoMaximo,
      message: (props: any) => `Ano inválido: ${props.value}`
    }
  },
  placa: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    validate: {
      validator: (v: string) => regexPlacaAntiga.test(v) || regexPlacaNova.test(v),
      message: (props: any) => `Placa inválida: ${props.value}`
    }
  }
});

export default model<IVeiculo>('Veiculo', VeiculoSchema);
