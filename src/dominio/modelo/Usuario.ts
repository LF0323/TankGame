export const ROLES = ['SOLICITANTE', 'AGENTE', 'COORDINADOR', 'ADMINISTRADOR'] as const

export type Rol = (typeof ROLES)[number]

/** Entidad del dominio. Sin sufijo: no es un dato en tránsito ni un acceso a datos. */
export interface Usuario {
  id: string
  nombre: string
  correo: string
  claveHash: string
  rol: Rol
  activo: boolean
}

/** Un usuario que todavía no existe: el DAO asigna el id al guardarlo. */
export type UsuarioNuevo = Omit<Usuario, 'id'>

/** Lo que sale hacia el exterior: el mismo usuario, nunca el hash de la clave. */
export interface UsuarioDTO {
  id: string
  nombre: string
  correo: string
  rol: Rol
  activo: boolean
}

/** Lo que cualquier usuario con sesión puede ver de otro: sin correo ni clave. */
export interface UsuarioPublicoDTO {
  id: string
  nombre: string
  rol: Rol
  activo: boolean
}

export function esRol(valor: unknown): valor is Rol {
  return ROLES.includes(valor as Rol)
}

export function aUsuarioDTO({ id, nombre, correo, rol, activo }: Usuario): UsuarioDTO {
  return { id, nombre, correo, rol, activo }
}

export function aUsuarioPublicoDTO({ id, nombre, rol, activo }: Usuario): UsuarioPublicoDTO {
  return { id, nombre, rol, activo }
}
