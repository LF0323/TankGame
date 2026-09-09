import { Router } from 'express'
import { aTanqueDTO, esTipoTanque } from '../../../dominio/modelo/Tanque'
import { CrearTanque, PropietarioNoExiste } from '../../../aplicacion/casos-uso/CrearTanque'
import type { CrearTanqueDTO } from '../../../aplicacion/casos-uso/CrearTanque'
import { ListarTanquesDeJugador } from '../../../aplicacion/casos-uso/ListarTanquesDeJugador'

function validarCreacion(cuerpo: unknown): CrearTanqueDTO | string {
  const d = (cuerpo ?? {}) as Record<string, unknown>
  if (typeof d['nombre'] !== 'string' || d['nombre'].trim().length < 2) return 'nombre requerido (mínimo 2 caracteres)'
  if (typeof d['propietarioId'] !== 'string') return 'propietarioId requerido'
  if (!esTipoTanque(d['tipo'])) return 'tipo inválido (LIGERO | MEDIO | PESADO)'
  return { nombre: d['nombre'], tipo: d['tipo'], propietarioId: d['propietarioId'] }
}

export interface DependenciasTanques {
  crearTanque: CrearTanque
  listarTanquesDeJugador: ListarTanquesDeJugador
}

export function rutasTanques(deps: DependenciasTanques): Router {
  const rutas = Router()

  rutas.post('/', async (req, res, next) => {
    const datos = validarCreacion(req.body)
    if (typeof datos === 'string') return void res.status(400).json({ error: datos })
    try {
      res.status(201).json(aTanqueDTO(await deps.crearTanque.ejecutar(datos)))
    } catch (error) {
      if (error instanceof PropietarioNoExiste) return void res.status(404).json({ error: error.message })
      next(error)
    }
  })

  rutas.get('/', async (req, res, next) => {
    const propietarioId = req.query['propietarioId']
    if (typeof propietarioId !== 'string') return void res.status(400).json({ error: 'propietarioId requerido como query param' })
    try {
      const tanques = await deps.listarTanquesDeJugador.ejecutar(propietarioId)
      res.json(tanques.map(aTanqueDTO))
    } catch (error) {
      next(error)
    }
  })

  return rutas
}