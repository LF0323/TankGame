
import type { Tanque, TanqueNuevo } from '../../src/dominio/modelo/Tanque'
import type { TanqueDAO } from '../../src/dominio/puertos'

export class TanqueDAOEnMemoria implements TanqueDAO {
  private readonly filas: Tanque[] = []

  async guardar(tanque: TanqueNuevo): Promise<Tanque> {
    const fila: Tanque = {
      ...tanque,
      id: String(this.filas.length + 1),
      activo: true,
    }

    this.filas.push(fila)
    return fila
  }

  async porId(id: string): Promise<Tanque | null> {
    const fila = this.filas.find((t) => t.id === id)
    return fila && fila.activo ? fila : null
  }

  async listarPorPropietario(propietarioId: string): Promise<Tanque[]> {
    return this.filas.filter(
        (t) => t.propietarioId === propietarioId && t.activo,
    )
  }

  async desactivar(id: string): Promise<void> {
    const fila = this.filas.find((t) => t.id === id)
    if (!fila) throw new Error(`No existe el tanque ${id}`)
    fila.activo = false
  }

  async actualizarVida(id: string, vida: number): Promise<Tanque> {
    const fila = this.filas.find((t) => t.id === id)
    if (!fila) throw new Error(`No existe el tanque ${id}`)
    fila.vida = vida
    return fila
  }

  async actualizarNombre(id: string, nombre: string): Promise<Tanque> {
    const fila = this.filas.find((t) => t.id === id)
    if (!fila) throw new Error(`No existe el tanque ${id}`)
    fila.nombre = nombre
    return fila
  }
}
