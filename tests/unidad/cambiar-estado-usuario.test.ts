import { describe, expect, it } from 'vitest'
import { RegistrarUsuario } from '../../src/aplicacion/casos-uso/RegistrarUsuario'
import { CredencialesInvalidas, IniciarSesion } from '../../src/aplicacion/casos-uso/IniciarSesion'
import {
  CambiarEstadoUsuario,
  SinPermisoParaCambiarEstado,
  UsuarioNoEncontrado,
} from '../../src/aplicacion/casos-uso/CambiarEstadoUsuario'
import { TokensJwt } from '../../src/infraestructura/seguridad/TokensJwt'
import { ClavesFalsas, UsuarioDAOEnMemoria } from '../dobles/UsuarioDAOEnMemoria'

async function armar() {
  const usuarios = new UsuarioDAOEnMemoria()
  const claves = new ClavesFalsas()
  const registrar = new RegistrarUsuario(usuarios, claves)
  const iniciar = new IniciarSesion(usuarios, claves, new TokensJwt('secreto-de-prueba'))
  const cambiarEstado = new CambiarEstadoUsuario(usuarios)

  const ana = await registrar.ejecutar({ nombre: 'Ana Agente', correo: 'ana@uam.edu.co', clave: 'clave-larga', rol: 'AGENTE' })
  const beto = await registrar.ejecutar({ nombre: 'Beto Jugador', correo: 'beto@uam.edu.co', clave: 'clave-larga', rol: 'SOLICITANTE' })
  const admin = await registrar.ejecutar({ nombre: 'Admin', correo: 'admin@uam.edu.co', clave: 'clave-larga', rol: 'ADMINISTRADOR' })
  return { iniciar, cambiarEstado, ana, beto, admin }
}

describe('desactivación lógica de cuenta', () => {
  it('el dueño desactiva su cuenta y ya no puede iniciar sesión', async () => {
    const { iniciar, cambiarEstado, ana } = await armar()
    const dto = await cambiarEstado.ejecutar({ id: ana.id, rol: ana.rol }, ana.id, false)

    expect(dto.activo).toBe(false)
    expect(dto).not.toHaveProperty('claveHash')
    await expect(iniciar.ejecutar('ana@uam.edu.co', 'clave-larga')).rejects.toBeInstanceOf(CredencialesInvalidas)
  })

  it('un administrador puede desactivar y reactivar la cuenta de otro usuario', async () => {
    const { iniciar, cambiarEstado, beto, admin } = await armar()
    const solicitante = { id: admin.id, rol: admin.rol }

    await cambiarEstado.ejecutar(solicitante, beto.id, false)
    await expect(iniciar.ejecutar('beto@uam.edu.co', 'clave-larga')).rejects.toBeInstanceOf(CredencialesInvalidas)

    await cambiarEstado.ejecutar(solicitante, beto.id, true)
    await expect(iniciar.ejecutar('beto@uam.edu.co', 'clave-larga')).resolves.toBeDefined()
  })

  it('un usuario común no puede desactivar la cuenta de otro', async () => {
    const { cambiarEstado, ana, beto } = await armar()
    await expect(cambiarEstado.ejecutar({ id: beto.id, rol: beto.rol }, ana.id, false)).rejects.toBeInstanceOf(
      SinPermisoParaCambiarEstado,
    )
  })

  it('responde "no encontrado" si el administrador pide un id que no existe', async () => {
    const { cambiarEstado, admin } = await armar()
    await expect(cambiarEstado.ejecutar({ id: admin.id, rol: admin.rol }, 'no-existe', false)).rejects.toBeInstanceOf(
      UsuarioNoEncontrado,
    )
  })
})
