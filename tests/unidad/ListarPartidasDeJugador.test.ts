
import { describe, expect, it, vi } from 'vitest'
import type { Partida } from '../../src/dominio/modelo/Partida'
import type { PartidaDAO } from '../../src/dominio/puertos'
import { ListarPartidasDeJugador } from '../../src/aplicacion/casos-uso/ListarPartidasDeJugador'

describe('ListarPartidasDeJugador', () => {
    it('consulta las partidas del jugador indicado', async () => {
        const partidas: Partida[] = [
            {
                id: 'partida-1',
                resultado: 'VICTORIA',
                puntaje: 150,
                duracionSegundos: 90,
                jugadorId: 'jugador-1',
            },
            {
                id: 'partida-2',
                resultado: 'DERROTA',
                puntaje: 50,
                duracionSegundos: 120,
                jugadorId: 'jugador-1',
            },
        ]

        const listarPorJugador = vi.fn().mockResolvedValue(partidas)

        const dao = {
            listarPorJugador,
        } as unknown as PartidaDAO

        const casoUso = new ListarPartidasDeJugador(dao)

        const resultado = await casoUso.ejecutar('jugador-1')

        expect(listarPorJugador).toHaveBeenCalledWith('jugador-1')
        expect(resultado).toEqual(partidas)
    })

    it('devuelve una lista vacía cuando el jugador no tiene partidas', async () => {
        const listarPorJugador = vi.fn().mockResolvedValue([])

        const dao = {
            listarPorJugador,
        } as unknown as PartidaDAO

        const casoUso = new ListarPartidasDeJugador(dao)

        const resultado = await casoUso.ejecutar('jugador-2')

        expect(listarPorJugador).toHaveBeenCalledWith('jugador-2')
        expect(resultado).toEqual([])
    })
})
