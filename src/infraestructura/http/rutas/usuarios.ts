import { Router } from 'express'
import type { CredencialDTO, ServicioTokens } from '../../../dominio/puertos'
import {
  CambiarEstadoUsuario,
  SinPermisoParaCambiarEstado,
  UsuarioNoEncontrado,
} from '../../../aplicacion/casos-uso/CambiarEstadoUsuario'
import { ConsultarUsuario } from '../../../aplicacion/casos-uso/ConsultarUsuario'
import { exigirSesion } from './autenticacion'

export interface DependenciasUsuarios {
  cambiarEstadoUsuario: CambiarEstadoUsuario
  consultarUsuario: ConsultarUsuario
  tokens: ServicioTokens
}

export function rutasUsuarios(deps: DependenciasUsuarios): Router {
  const rutas = Router()

  rutas.get('/:usuarioId', exigirSesion(deps.tokens), async (req, res, next) => {
    const usuarioId = req.params['usuarioId']
    if (typeof usuarioId !== 'string') return void res.status(400).json({ error: 'usuarioId requerido' })
    try {
      res.json(await deps.consultarUsuario.ejecutar(usuarioId))
    } catch (error) {
      if (error instanceof UsuarioNoEncontrado) return void res.status(404).json({ error: error.message })
      next(error)
    }
  })

  rutas.patch('/:usuarioId/estado', exigirSesion(deps.tokens), async (req, res, next) => {
    const usuarioId = req.params['usuarioId']
    if (typeof usuarioId !== 'string') return void res.status(400).json({ error: 'usuarioId requerido' })
    const cuerpo = (req.body ?? {}) as Record<string, unknown>
    if (typeof cuerpo['activo'] !== 'boolean') {
      return void res.status(400).json({ error: 'activo requerido (true | false)' })
    }
    try {
      const solicitante = res.locals['credencial'] as CredencialDTO
      res.json(await deps.cambiarEstadoUsuario.ejecutar(solicitante, usuarioId, cuerpo['activo']))
    } catch (error) {
      if (error instanceof SinPermisoParaCambiarEstado) return void res.status(403).json({ error: error.message })
      if (error instanceof UsuarioNoEncontrado) return void res.status(404).json({ error: error.message })
      next(error)
    }
  })

  return rutas
}
