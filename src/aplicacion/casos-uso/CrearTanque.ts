import { ESTADISTICAS_BASE } from '../../dominio/modelo/Tanque'
import type { Tanque, TipoTanque } from '../../dominio/modelo/Tanque'
import type { TanqueDAO, UsuarioDAO } from '../../dominio/puertos'

export class PropietarioNoExiste extends Error {
  constructor(propietarioId: string) {
    super(`No existe un usuario con id ${propietarioId}`)
  }
}

export interface CrearTanqueDTO {
  nombre: string
  tipo: TipoTanque
  propietarioId: string
}

export class CrearTanque {
  constructor(
    private readonly tanques: TanqueDAO,
    private readonly usuarios: UsuarioDAO,
  ) {}

  async ejecutar(datos: CrearTanqueDTO): Promise<Tanque> {
    if (!(await this.usuarios.porId(datos.propietarioId))) {
      throw new PropietarioNoExiste(datos.propietarioId)
    }

    return this.tanques.guardar({
      nombre: datos.nombre.trim(),
      tipo: datos.tipo,
      propietarioId: datos.propietarioId,
      ...ESTADISTICAS_BASE[datos.tipo],
    })
  }
}