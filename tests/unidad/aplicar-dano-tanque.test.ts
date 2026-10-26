import { describe, expect, it } from 'vitest'
import { AplicarDanoTanque, TanqueNoEncontrado } from '../../src/aplicacion/casos-uso/AplicarDanoTanque'
import { ESTADISTICAS_BASE } from '../../src/dominio/modelo/Tanque'
import { TanqueDAOEnMemoria } from '../dobles/TanqueDAOEnMemoria'

async function armar(tipo: 'LIGERO' | 'MEDIO' | 'PESADO' = 'MEDIO') {
  const tanques = new TanqueDAOEnMemoria()
  const tanque = await tanques.guardar({ nombre: 'Rex', tipo, propietarioId: 'u1', ...ESTADISTICAS_BASE[tipo] })
  return { tanques, tanque, aplicar: new AplicarDanoTanque(tanques) }
}

describe('aplicar daño recibido a un tanque', () => {
  it('resta la vida y la guarda', async () => {
    const { aplicar, tanques, tanque } = await armar('MEDIO')
    const resultado = await aplicar.ejecutar(tanque.id, 30)

    expect(resultado.tanque.vida).toBe(70)
    expect(resultado.vivo).toBe(true)
    expect((await tanques.porId(tanque.id))?.vida).toBe(70)
  })

  it('la vida no baja de 0 y el tanque queda eliminado', async () => {
    const { aplicar, tanque } = await armar('LIGERO')
    const resultado = await aplicar.ejecutar(tanque.id, 500)

    expect(resultado.tanque.vida).toBe(0)
    expect(resultado.vivo).toBe(false)
  })

  it('el daño se acumula entre llamadas', async () => {
    const { aplicar, tanque } = await armar('PESADO')
    await aplicar.ejecutar(tanque.id, 100)
    const resultado = await aplicar.ejecutar(tanque.id, 100)

    expect(resultado.tanque.vida).toBe(0)
    expect(resultado.vivo).toBe(false)
  })

  it('lanza "no encontrado" si el tanque no existe', async () => {
    const { aplicar } = await armar()
    await expect(aplicar.ejecutar('no-existe', 10)).rejects.toBeInstanceOf(TanqueNoEncontrado)
  })
})
