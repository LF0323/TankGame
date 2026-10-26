import { ESTADISTICAS_BASE } from '../../dominio/modelo/Tanque'
import type { Tanque } from '../../dominio/modelo/Tanque'
import { SaludTanque } from '../../dominio/juego/SaludTanque'
import type { TanqueDAO } from '../../dominio/puertos'

export class TanqueNoEncontrado extends Error {
  constructor(tanqueId: string) {
    super(`No existe un tanque con id ${tanqueId}`)
  }
}

export interface ResultadoDano {
  tanque: Tanque
  vivo: boolean
}

/**
 * Aplica daño a un tanque con las reglas migradas del juego (`SaludTanque`) y guarda la vida resultante.
 * La vida máxima sale del tipo del tanque (LIGERO 70, MEDIO 100, PESADO 150).
 */
export class AplicarDanoTanque {
  constructor(private readonly tanques: TanqueDAO) {}

  async ejecutar(tanqueId: string, danoRecibido: number): Promise<ResultadoDano> {
    const tanque = await this.tanques.porId(tanqueId)
    if (!tanque) throw new TanqueNoEncontrado(tanqueId)

    const salud = new SaludTanque(ESTADISTICAS_BASE[tanque.tipo].vida)
    salud.establecerVida(tanque.vida)
    salud.aplicarDano(danoRecibido)

    return { tanque: await this.tanques.actualizarVida(tanque.id, salud.vida), vivo: salud.vivo }
  }
}
