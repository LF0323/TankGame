import { aUsuarioDTO } from '../../dominio/modelo/Usuario'
import type { UsuarioDTO } from '../../dominio/modelo/Usuario'
import type { CredencialDTO, UsuarioDAO } from '../../dominio/puertos'

export class UsuarioNoEncontrado extends Error {
  constructor(usuarioId: string) {
    super(`No existe un usuario con id ${usuarioId}`)
  }
}

export class SinPermisoParaCambiarEstado extends Error {
  constructor() {
    super('Solo el propio usuario o un administrador pueden cambiar el estado de una cuenta')
  }
}

/**
 * Desactivación lógica: la fila del usuario no se borra, solo se marca `activo = false`.
 * Así se conserva su historial (tanques y partidas) y `IniciarSesion` le niega el acceso.
 */
export class CambiarEstadoUsuario {
  constructor(private readonly usuarios: UsuarioDAO) {}

  async ejecutar(solicitante: CredencialDTO, usuarioId: string, activo: boolean): Promise<UsuarioDTO> {
    // El permiso se revisa antes que la existencia: así no se revela qué ids existen.
    if (solicitante.id !== usuarioId && solicitante.rol !== 'ADMINISTRADOR') {
      throw new SinPermisoParaCambiarEstado()
    }
    if (!(await this.usuarios.porId(usuarioId))) throw new UsuarioNoEncontrado(usuarioId)

    return aUsuarioDTO(await this.usuarios.cambiarActivo(usuarioId, activo))
  }
}
