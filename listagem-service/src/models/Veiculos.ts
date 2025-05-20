import { Schema, model, Document } from 'mongoose';

export interface IVeiculo extends Document {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
}

const VeiculoSchema = new Schema<IVeiculo>({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  ano: { type: Number, required: true },
  placa: { type: String, required: true, unique: true }
});

export default model<IVeiculo>('Veiculo', VeiculoSchema);
