import { Router } from 'express'
import type { ServicioTokens } from '../../../dominio/puertos'
import { aTanqueDTO, esTipoTanque } from '../../../dominio/modelo/Tanque'
import { CrearTanque, PropietarioNoExiste } from '../../../aplicacion/casos-uso/CrearTanque'
import type { CrearTanqueDTO } from '../../../aplicacion/casos-uso/CrearTanque'
import { AplicarDanoTanque, TanqueNoEncontrado } from '../../../aplicacion/casos-uso/AplicarDanoTanque'
import { numeroNoNegativo } from '../../../aplicacion/validaciones'
import { exigirSesion } from './autenticacion'
import { ListarTanquesDeJugador } from '../../../aplicacion/casos-uso/ListarTanquesDeJugador'
import { textoMinimo, textoRequerido } from '../../../aplicacion/validaciones'

function validarCreacion(cuerpo: unknown): CrearTanqueDTO | string {
  const d = (cuerpo ?? {}) as Record<string, unknown>
  const error = textoMinimo(d['nombre'], 'nombre', 2) ?? textoRequerido(d['propietarioId'], 'propietarioId')
  if (error) return error
  if (!esTipoTanque(d['tipo'])) return 'tipo inválido (LIGERO | MEDIO | PESADO)'
  return { nombre: d['nombre'] as string, tipo: d['tipo'], propietarioId: d['propietarioId'] as string }
}

export interface DependenciasTanques {
  crearTanque: CrearTanque
  listarTanquesDeJugador: ListarTanquesDeJugador
  aplicarDanoTanque: AplicarDanoTanque
  tokens: ServicioTokens
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

  rutas.post('/:tanqueId/recibir-dano', exigirSesion(deps.tokens), async (req, res, next) => {
    const tanqueId = req.params['tanqueId']
    if (typeof tanqueId !== 'string') return void res.status(400).json({ error: 'tanqueId requerido' })
    const cuerpo = (req.body ?? {}) as Record<string, unknown>
    const error = numeroNoNegativo(cuerpo['danoRecibido'], 'danoRecibido')
    if (error) return void res.status(400).json({ error })
    try {
      const { tanque, vivo } = await deps.aplicarDanoTanque.ejecutar(tanqueId, cuerpo['danoRecibido'] as number)
      res.json({ ...aTanqueDTO(tanque), vivo })
    } catch (error) {
      if (error instanceof TanqueNoEncontrado) return void res.status(404).json({ error: error.message })
      next(error)
    }
  })

  return rutas
}