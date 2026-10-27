
import type { Tanque } from '../../dominio/modelo/Tanque'
import type { TanqueDAO } from '../../dominio/puertos'

export class TanqueNoExiste extends Error {
    constructor(id: string) {
        super(`No existe un tanque con id ${id}`)
        this.name = 'TanqueNoExiste'
    }
}

export class TanqueNoPerteneceAlJugador extends Error {
    constructor() {
        super('El tanque no pertenece al jugador autenticado')
        this.name = 'TanqueNoPerteneceAlJugador'
    }
}

export class NombreTanqueInvalido extends Error {
    constructor() {
        super('El nombre debe tener al menos 2 caracteres')
        this.name = 'NombreTanqueInvalido'
    }
}

export class RenombrarTanquePropio {
    constructor(private readonly tanques: TanqueDAO) {}

    async ejecutar(
        tanqueId: string,
        propietarioId: string,
        nombre: string,
    ): Promise<Tanque> {
        const nombreNormalizado = nombre.trim()

        if (nombreNormalizado.length < 2) {
            throw new NombreTanqueInvalido()
        }

        const tanque = await this.tanques.porId(tanqueId)

        if (!tanque) {
            throw new TanqueNoExiste(tanqueId)
        }

        if (tanque.propietarioId !== propietarioId) {
            throw new TanqueNoPerteneceAlJugador()
        }

        return this.tanques.actualizarNombre(tanqueId, nombreNormalizado)
    }
}
