import type { PrismaClient } from './generado/client'
import type { PartidaModel as FilaPartida } from './generado/models'
import type { Partida, PartidaNueva, ResultadoPartida } from '../../dominio/modelo/Partida'
import type { PartidaDAO } from '../../dominio/puertos'

const aDominio = (fila: FilaPartida): Partida => ({
  id: fila.id,
  resultado: fila.resultado as ResultadoPartida,
  puntaje: fila.puntaje,
  duracionSegundos: fila.duracionSegundos,
  jugadorId: fila.jugadorId,
})

export class PartidaDAOPrisma implements PartidaDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async guardar(partida: PartidaNueva): Promise<Partida> {
    return aDominio(await this.prisma.partida.create({ data: partida }))
  }

  async listarPorJugador(jugadorId: string): Promise<Partida[]> {
    const filas = await this.prisma.partida.findMany({
      where: { jugadorId },
      orderBy: { jugadaEn: 'desc' },
    })
    return filas.map(aDominio)
  }
}