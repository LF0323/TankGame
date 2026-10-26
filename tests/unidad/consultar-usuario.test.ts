import { describe, expect, it } from 'vitest'
import { RegistrarUsuario } from '../../src/aplicacion/casos-uso/RegistrarUsuario'
import { ConsultarUsuario } from '../../src/aplicacion/casos-uso/ConsultarUsuario'
import { UsuarioNoEncontrado } from '../../src/aplicacion/casos-uso/CambiarEstadoUsuario'
import { ClavesFalsas, UsuarioDAOEnMemoria } from '../dobles/UsuarioDAOEnMemoria'

async function armar() {
  const usuarios = new UsuarioDAOEnMemoria()
  const registrar = new RegistrarUsuario(usuarios, new ClavesFalsas())
  const ana = await registrar.ejecutar({ nombre: 'Ana Agente', correo: 'ana@uam.edu.co', clave: 'clave-larga', rol: 'AGENTE' })
  return { consultar: new ConsultarUsuario(usuarios), ana }
}

describe('consulta de usuario por id', () => {
  it('devuelve solo los datos públicos, sin correo ni clave', async () => {
    const { consultar, ana } = await armar()
    const dto = await consultar.ejecutar(ana.id)

    expect(dto).toEqual({ id: ana.id, nombre: 'Ana Agente', rol: 'AGENTE', activo: true })
    expect(dto).not.toHaveProperty('correo')
    expect(dto).not.toHaveProperty('claveHash')
  })

  it('lanza "no encontrado" si el id no existe', async () => {
    const { consultar } = await armar()
    await expect(consultar.ejecutar('no-existe')).rejects.toBeInstanceOf(UsuarioNoEncontrado)
  })
})
