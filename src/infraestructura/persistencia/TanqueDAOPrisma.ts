import type { PrismaClient } from './generado/client'
import type { TanqueModel as FilaTanque } from './generado/models'
import type { Tanque, TanqueNuevo, TipoTanque } from '../../dominio/modelo/Tanque'
import type { TanqueDAO } from '../../dominio/puertos'

const aDominio = (fila: FilaTanque): Tanque => ({
  id: fila.id,
  nombre: fila.nombre,
  tipo: fila.tipo as TipoTanque,
  vida: fila.vida,
  dano: fila.dano,
  velocidad: fila.velocidad,
  propietarioId: fila.propietarioId,
  activo: fila.activo,
})

export class TanqueDAOPrisma implements TanqueDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async guardar(tanque: TanqueNuevo): Promise<Tanque> {
    return aDominio(await this.prisma.tanque.create({ data: tanque }))
  }

  async porId(id: string): Promise<Tanque | null> {
    const fila = await this.prisma.tanque.findUnique({ where: { id } })
    return fila && fila.activo ? aDominio(fila) : null
  }

  async listarPorPropietario(propietarioId: string): Promise<Tanque[]> {
    const filas = await this.prisma.tanque.findMany({ where: { propietarioId, activo: true } })
    return filas.map(aDominio)
  }

  async desactivar(id: string): Promise<void> {
    await this.prisma.tanque.update({
      where: { id },
      data: { activo: false },
    })
  }
}
  async actualizarVida(id: string, vida: number): Promise<Tanque> {
    return aDominio(await this.prisma.tanque.update({ where: { id }, data: { vida } }))
  }
}
