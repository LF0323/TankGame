/**
 * Reglas de vida de un tanque durante una partida.
 *
 * Migración a TypeScript de la lógica del juego Java (`Tank.applyDamage`, `Tank.setHealth`,
 * `Tank.respawn` y la curación de botiquines de `GameEngine`):
 *
 * - La vida nunca baja de 0 ni supera el máximo.
 * - Con vida 0 el tanque queda eliminado y ya no recibe daño ni curación.
 * - Al reaparecer vuelve a tener la vida completa.
 *
 * A diferencia del juego Java (máximo fijo de 100), el máximo se recibe por parámetro para poder
 * usar la `vida` propia de cada tipo de tanque (LIGERO, MEDIO, PESADO).
 */
export class SaludTanque {
  private vidaActual: number

  constructor(readonly vidaMaxima: number) {
    if (!Number.isInteger(vidaMaxima) || vidaMaxima <= 0) {
      throw new RangeError('vidaMaxima debe ser un entero positivo')
    }
    this.vidaActual = vidaMaxima
  }

  get vida(): number {
    return this.vidaActual
  }

  get vivo(): boolean {
    return this.vidaActual > 0
  }

  /** Resta daño sin bajar de 0. Un tanque eliminado no recibe más daño. */
  aplicarDano(dano: number): void {
    if (!Number.isFinite(dano) || dano < 0) throw new RangeError('dano debe ser un número mayor o igual a 0')
    if (!this.vivo) return
    this.vidaActual = Math.max(0, this.vidaActual - dano)
  }

  /** Suma vida sin superar el máximo. Un tanque eliminado no se cura. */
  curar(cantidad: number): void {
    if (!Number.isFinite(cantidad) || cantidad < 0) throw new RangeError('cantidad debe ser un número mayor o igual a 0')
    if (!this.vivo) return
    this.vidaActual = Math.min(this.vidaMaxima, this.vidaActual + cantidad)
  }

  /** Fija la vida (por ejemplo al recibir el estado del host), limitada al rango 0..máximo. */
  establecerVida(vida: number): void {
    if (!Number.isFinite(vida)) throw new RangeError('vida debe ser un número')
    this.vidaActual = Math.max(0, Math.min(this.vidaMaxima, Math.trunc(vida)))
  }

  /** Reaparición: vida completa. */
  reaparecer(): void {
    this.vidaActual = this.vidaMaxima
  }
}
