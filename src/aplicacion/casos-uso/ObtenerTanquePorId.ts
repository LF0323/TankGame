import type { Tanque } from '../../dominio/modelo/Tanque'
import type { TanqueDAO } from '../../dominio/puertos'

export class TanqueNoEncontrado extends Error {
  constructor(tanqueId: string) {
    super(`No existe un tanque con id ${tanqueId}`)
  }
}

export class ObtenerTanquePorId {
  constructor(private readonly tanques: TanqueDAO) {}

  async ejecutar(id: string): Promise<Tanque> {
    const tanque = await this.tanques.porId(id)
    if (!tanque) {
      throw new TanqueNoEncontrado(id)
    }
    return tanque
  }
}