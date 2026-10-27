
import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '../../src/infraestructura/persistencia/generado/client'
import { PartidaDAOPrisma } from '../../src/infraestructura/persistencia/PartidaDAOPrisma'

describe('PartidaDAOPrisma', () => {
    it('consulta las partidas ordenadas de más reciente a más antigua', async () => {
        const filas = [
            {
                id: 'partida-reciente',
                resultado: 'VICTORIA',
                puntaje: 200,
                duracionSegundos: 60,
                jugadorId: 'jugador-1',
                jugadaEn: new Date('2026-10-26T10:00:00.000Z'),
            },
            {
                id: 'partida-antigua',
                resultado: 'DERROTA',
                puntaje: 50,
                duracionSegundos: 120,
                jugadorId: 'jugador-1',
                jugadaEn: new Date('2026-10-25T10:00:00.000Z'),
            },
        ]

        const findMany = vi.fn().mockResolvedValue(filas)

        const prismaFalso = {
            partida: {
                findMany,
            },
        } as unknown as PrismaClient

        const dao = new PartidaDAOPrisma(prismaFalso)

        const resultado = await dao.listarPorJugador('jugador-1')

        expect(findMany).toHaveBeenCalledWith({
            where: {
                jugadorId: 'jugador-1',
            },
            orderBy: {
                jugadaEn: 'desc',
            },
        })

        expect(resultado).toHaveLength(2)
        expect(resultado[0]?.id).toBe('partida-reciente')
        expect(resultado[1]?.id).toBe('partida-antigua')

        expect(resultado[0]).toEqual({
            id: 'partida-reciente',
            resultado: 'VICTORIA',
            puntaje: 200,
            duracionSegundos: 60,
            jugadorId: 'jugador-1',
        })
    })
})
