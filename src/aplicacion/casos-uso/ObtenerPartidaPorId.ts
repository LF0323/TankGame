import type { Partida } from '../../dominio/modelo/Partida'
import type { PartidaDAO } from '../../dominio/puertos'

export class PartidaNoEncontrada extends Error {
  constructor(partidaId: string) {
    super(`No existe una partida con id ${partidaId}`)
    this.name = 'PartidaNoEncontrada'
  }
}

export class ObtenerPartidaPorId {
  constructor(private readonly partidas: PartidaDAO) {}

  async ejecutar(id: string): Promise<Partida> {
    const partida = await this.partidas.porId(id)

    if (!partida) {
      throw new PartidaNoEncontrada(id)
    }

    return partida
  }
}
