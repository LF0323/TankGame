import express, { Router } from 'express'
import type { ErrorRequestHandler, Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { openapi } from './openapi'
import { rutasAutenticacion } from './rutas/autenticacion'
import type { DependenciasAutenticacion } from './rutas/autenticacion'
import { rutasTanques } from './rutas/tanques'
import type { DependenciasTanques } from './rutas/tanques'
import { rutasPartidas } from './rutas/partidas'
import type { DependenciasPartidas } from './rutas/partidas'

const errores: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Error interno' })
}

type Dependencias = DependenciasAutenticacion & DependenciasTanques & DependenciasPartidas

export function crearServidor(deps: Dependencias): Express {
  const api = Router()
  api.get('/salud', (_req, res) => void res.json({ estado: 'ok' }))
  api.get('/openapi.json', (_req, res) => void res.json(openapi))
  api.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'TankGame · API' }))
  api.use('/auth', rutasAutenticacion(deps))
  api.use('/tanques', rutasTanques(deps))
  api.use('/partidas', rutasPartidas(deps))

  const app = express()
  app.use(express.json())
  app.use('/api', api)
  app.use((_req, res) => void res.status(404).json({ error: 'Ruta no encontrada' }))
  app.use(errores)
  return app
}