import { describe, expect, it, vi } from 'vitest'
import type { Partida } from '../../src/dominio/modelo/Partida'
import type { PartidaDAO } from '../../src/dominio/puertos'
import {
  ObtenerPartidaPorId,
  PartidaNoEncontrada,
} from '../../src/aplicacion/casos-uso/ObtenerPartidaPorId'

const partida: Partida = {
  id: 'partida-123',
  resultado: 'VICTORIA',
  puntaje: 100,
  duracionSegundos: 300,
  jugadorId: 'jugador-123',
}

describe('ObtenerPartidaPorId', () => {
  it('devuelve la partida cuando existe', async () => {
    const dao: PartidaDAO = {
      guardar: vi.fn(),
      porId: vi.fn().mockResolvedValue(partida),
      listarPorJugador: vi.fn(),
    }

    const casoUso = new ObtenerPartidaPorId(dao)

    await expect(casoUso.ejecutar(partida.id)).resolves.toEqual(partida)
    expect(dao.porId).toHaveBeenCalledWith(partida.id)
  })

  it('lanza PartidaNoEncontrada cuando no existe', async () => {
    const dao: PartidaDAO = {
      guardar: vi.fn(),
      porId: vi.fn().mockResolvedValue(null),
      listarPorJugador: vi.fn(),
    }

    const casoUso = new ObtenerPartidaPorId(dao)

    await expect(casoUso.ejecutar('inexistente')).rejects.toThrow(
      PartidaNoEncontrada,
    )
  })
})
