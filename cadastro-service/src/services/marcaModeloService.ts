import MarcaModelo, { IMarcaModelo } from '../models/MarcaModelo';

export class MarcaModeloService {
  async cadastrarMarcasModelosLote(lista: { marca: string; modelos: string[] }[]) {
    if (!Array.isArray(lista) || lista.length === 0) {
      const error = new Error('Envie uma lista de marcas/modelos.');
      (error as any).status = 400;
      throw error;
    }

    const results: IMarcaModelo[] = [];
    for (const item of lista) {
      if (!item.marca || !Array.isArray(item.modelos) || item.modelos.length === 0) continue;
      try {
        const doc = await MarcaModelo.findOneAndUpdate(
          { marca: item.marca.toUpperCase() },
          { $set: { modelos: item.modelos } },
          { new: true, upsert: true, runValidators: true }
        );
        if (doc) results.push(doc);
      } catch (err: any) {
        // Captura e lança erro específico para cada item, se necessário
        if (err.name === 'ValidationError' && err.errors) {
          const erros: Record<string, string> = {};
          Object.keys(err.errors).forEach((campo) => {
            erros[campo] = err.errors[campo].message;
          });
          const error = new Error(`Dados inválidos para marca/modelo: ${item.marca}`);
          (error as any).status = 400;
          (error as any).errors = erros;
          throw error;
        }
        const error = new Error(`Erro ao cadastrar marca/modelo: ${item.marca}`);
        (error as any).status = 500;
        (error as any).original = err;
        throw error;
      }
    }
    return results;
  }
}
