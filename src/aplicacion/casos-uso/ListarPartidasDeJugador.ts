import type { Partida } from '../../dominio/modelo/Partida'
import type { PartidaDAO } from '../../dominio/puertos'

export class ListarPartidasDeJugador {
  constructor(private readonly partidas: PartidaDAO) {}

  async ejecutar(jugadorId: string): Promise<Partida[]> {
    return this.partidas.listarPorJugador(jugadorId)
  }
}