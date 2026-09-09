import type { Partida, ResultadoPartida } from '../../dominio/modelo/Partida'
import type { PartidaDAO, UsuarioDAO } from '../../dominio/puertos'

export class JugadorNoExiste extends Error {
  constructor(jugadorId: string) {
    super(`No existe un usuario con id ${jugadorId}`)
  }
}

export interface RegistrarPartidaDTO {
  resultado: ResultadoPartida
  puntaje: number
  duracionSegundos: number
  jugadorId: string
}

export class RegistrarPartida {
  constructor(
    private readonly partidas: PartidaDAO,
    private readonly usuarios: UsuarioDAO,
  ) {}

  async ejecutar(datos: RegistrarPartidaDTO): Promise<Partida> {
    if (!(await this.usuarios.porId(datos.jugadorId))) {
      throw new JugadorNoExiste(datos.jugadorId)
    }

    return this.partidas.guardar({
      resultado: datos.resultado,
      puntaje: datos.puntaje,
      duracionSegundos: datos.duracionSegundos,
      jugadorId: datos.jugadorId,
    })
  }
}