import type { Tanque } from '../../dominio/modelo/Tanque'
import type { TanqueDAO } from '../../dominio/puertos'

export class ListarTanquesDeJugador {
  constructor(private readonly tanques: TanqueDAO) {}

  async ejecutar(propietarioId: string): Promise<Tanque[]> {
    return this.tanques.listarPorPropietario(propietarioId)
  }
}