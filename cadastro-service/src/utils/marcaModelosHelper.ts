import MarcaModelo, { IMarcaModelo } from '../models/MarcaModelo';

export async function getMarcasModelos(): Promise<Record<string, string[]>> {
  const docs = await MarcaModelo.find({});
  const marcasModelos: Record<string, string[]> = {};
  docs.forEach(doc => {
    marcasModelos[doc.marca.toUpperCase()] = doc.modelos.map(m => m.toUpperCase());
  });
  return marcasModelos;
}
