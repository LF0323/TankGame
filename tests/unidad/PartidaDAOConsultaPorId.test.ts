import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '../../src/infraestructura/persistencia/generado/client'
import { PartidaDAOPrisma } from '../../src/infraestructura/persistencia/PartidaDAOPrisma'

describe('PartidaDAOPrisma.porId', () => {
  it('consulta por ID y convierte la fila al modelo de dominio', async () => {
    const fila = {
      id: 'partida-123',
      resultado: 'VICTORIA',
      puntaje: 100,
      duracionSegundos: 300,
      jugadorId: 'jugador-123',
      jugadaEn: new Date('2026-10-26T12:00:00.000Z'),
    }

    const findUnique = vi.fn().mockResolvedValue(fila)

    const prismaFalso = {
      partida: { findUnique },
    } as unknown as PrismaClient

    const dao = new PartidaDAOPrisma(prismaFalso)

    await expect(dao.porId(fila.id)).resolves.toEqual({
      id: fila.id,
      resultado: 'VICTORIA',
      puntaje: 100,
      duracionSegundos: 300,
      jugadorId: 'jugador-123',
    })

    expect(findUnique).toHaveBeenCalledWith({
      where: { id: fila.id },
    })
  })

  it('devuelve null cuando Prisma no encuentra la partida', async () => {
    const findUnique = vi.fn().mockResolvedValue(null)

    const prismaFalso = {
      partida: { findUnique },
    } as unknown as PrismaClient

    const dao = new PartidaDAOPrisma(prismaFalso)

    await expect(dao.porId('inexistente')).resolves.toBeNull()
  })
})
