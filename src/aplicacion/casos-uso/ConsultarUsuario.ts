import { aUsuarioPublicoDTO } from '../../dominio/modelo/Usuario'
import type { UsuarioPublicoDTO } from '../../dominio/modelo/Usuario'
import type { UsuarioDAO } from '../../dominio/puertos'
import { UsuarioNoEncontrado } from './CambiarEstadoUsuario'

/** Devuelve solo los datos públicos de un usuario: nunca el correo ni el hash de la clave. */
export class ConsultarUsuario {
  constructor(private readonly usuarios: UsuarioDAO) {}

  async ejecutar(usuarioId: string): Promise<UsuarioPublicoDTO> {
    const usuario = await this.usuarios.porId(usuarioId)
    if (!usuario) throw new UsuarioNoEncontrado(usuarioId)
    return aUsuarioPublicoDTO(usuario)
  }
}
