import { describe, expect, it } from 'vitest'
import { SaludTanque } from '../../src/dominio/juego/SaludTanque'

describe('SaludTanque (migración de las reglas de vida del juego Java)', () => {
  it('empieza con la vida máxima y vivo', () => {
    const salud = new SaludTanque(100)
    expect(salud.vida).toBe(100)
    expect(salud.vivo).toBe(true)
  })

  it('el daño resta vida y nunca la deja por debajo de 0', () => {
    const salud = new SaludTanque(100)
    salud.aplicarDano(20)
    expect(salud.vida).toBe(80)
    salud.aplicarDano(500)
    expect(salud.vida).toBe(0)
    expect(salud.vivo).toBe(false)
  })

  it('un tanque eliminado no recibe daño ni curación', () => {
    const salud = new SaludTanque(100)
    salud.aplicarDano(100)
    salud.aplicarDano(20)
    salud.curar(50)
    expect(salud.vida).toBe(0)
  })

  it('la curación no supera el máximo', () => {
    const salud = new SaludTanque(100)
    salud.aplicarDano(30)
    salud.curar(50)
    expect(salud.vida).toBe(100)
  })

  it('establecerVida limita el valor al rango 0..máximo', () => {
    const salud = new SaludTanque(100)
    salud.establecerVida(150)
    expect(salud.vida).toBe(100)
    salud.establecerVida(-10)
    expect(salud.vida).toBe(0)
    salud.establecerVida(42.9)
    expect(salud.vida).toBe(42)
  })

  it('al reaparecer recupera la vida completa', () => {
    const salud = new SaludTanque(150)
    salud.aplicarDano(150)
    salud.reaparecer()
    expect(salud.vida).toBe(150)
    expect(salud.vivo).toBe(true)
  })

  it('usa el máximo propio de cada tanque', () => {
    expect(new SaludTanque(70).vida).toBe(70)
    expect(new SaludTanque(150).vida).toBe(150)
  })

  it('rechaza valores inválidos', () => {
    expect(() => new SaludTanque(0)).toThrow(RangeError)
    expect(() => new SaludTanque(100).aplicarDano(-5)).toThrow(RangeError)
    expect(() => new SaludTanque(100).curar(Number.NaN)).toThrow(RangeError)
  })
})
