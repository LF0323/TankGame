import type { TanqueDAO } from '../../dominio/puertos'
import { TanqueNoEncontrado } from './ObtenerTanquePorId'

export class EliminarTanque {
  constructor(private readonly tanques: TanqueDAO) {}

  async ejecutar(id: string): Promise<void> {
    const tanque = await this.tanques.porId(id)
    if (!tanque) {
      throw new TanqueNoEncontrado(id)
    }
    await this.tanques.desactivar(id)
  }
}