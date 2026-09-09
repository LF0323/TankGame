
import type { Rol, Usuario, UsuarioNuevo } from '../modelo/Usuario'
import type { Tanque, TanqueNuevo } from '../modelo/Tanque'
import type { Partida, PartidaNueva } from '../modelo/Partida'

export interface UsuarioDAO {
  guardar(usuario: UsuarioNuevo): Promise<Usuario>
  porCorreo(correo: string): Promise<Usuario | null>
  porId(id: string): Promise<Usuario | null>
}

export interface ServicioClaves {
  cifrar(clave: string): Promise<string>
  coincide(clave: string, hash: string): Promise<boolean>
}

/** Contenido útil del token: viaja entre el cliente y el servidor en cada petición. */
export interface CredencialDTO {
  id: string
  rol: Rol
}

export interface ServicioTokens {
  emitir(credencial: CredencialDTO): string
  verificar(token: string): CredencialDTO | null
}

export interface TanqueDAO {
  guardar(tanque: TanqueNuevo): Promise<Tanque>
  porId(id: string): Promise<Tanque | null>
  listarPorPropietario(propietarioId: string): Promise<Tanque[]>
}

export interface PartidaDAO {
  guardar(partida: PartidaNueva): Promise<Partida>
  listarPorJugador(jugadorId: string): Promise<Partida[]>
}