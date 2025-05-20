import { Schema, model, Document } from 'mongoose';

export interface IMarcaModelo extends Document {
  marca: string;
  modelos: string[];
}

const MarcaModeloSchema = new Schema<IMarcaModelo>({
  marca: { type: String, required: true, unique: true, uppercase: true },
  modelos: [{ type: String, required: true }]
});

export default model<IMarcaModelo>('MarcaModelo', MarcaModeloSchema, 'marcas_modelos');
