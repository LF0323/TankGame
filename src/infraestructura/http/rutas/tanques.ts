
import { Router } from 'express'
import { aTanqueDTO, esTipoTanque } from '../../../dominio/modelo/Tanque'
import { CrearTanque, PropietarioNoExiste } from '../../../aplicacion/casos-uso/CrearTanque'
import type { CrearTanqueDTO } from '../../../aplicacion/casos-uso/CrearTanque'
import { ListarTanquesDeJugador } from '../../../aplicacion/casos-uso/ListarTanquesDeJugador'
import type { CredencialDTO, ServicioTokens } from '../../../dominio/puertos'
import { exigirSesion } from './autenticacion'
import {
  NombreTanqueInvalido,
  RenombrarTanquePropio,
  TanqueNoExiste,
  TanqueNoPerteneceAlJugador,
} from '../../../aplicacion/casos-uso/RenombrarTanquePropio'

function validarCreacion(cuerpo: unknown): CrearTanqueDTO | string {
  const d = (cuerpo ?? {}) as Record<string, unknown>

  if (typeof d['nombre'] !== 'string' || d['nombre'].trim().length < 2) {
    return 'nombre requerido (mínimo 2 caracteres)'
  }

  if (typeof d['propietarioId'] !== 'string') {
    return 'propietarioId requerido'
  }

  if (!esTipoTanque(d['tipo'])) {
    return 'tipo inválido (LIGERO | MEDIO | PESADO)'
  }

  return {
    nombre: d['nombre'],
    tipo: d['tipo'],
    propietarioId: d['propietarioId'],
  }
}

function esUUID(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)
}

export interface DependenciasTanques {
  crearTanque: CrearTanque
  listarTanquesDeJugador: ListarTanquesDeJugador
  renombrarTanquePropio: RenombrarTanquePropio
  tokens: ServicioTokens
}

export function rutasTanques(deps: DependenciasTanques): Router {
  const rutas = Router()

  rutas.post('/', async (req, res, next) => {
    const datos = validarCreacion(req.body)

    if (typeof datos === 'string') {
      return void res.status(400).json({ error: datos })
    }

    try {
      res.status(201).json(aTanqueDTO(await deps.crearTanque.ejecutar(datos)))
    } catch (error) {
      if (error instanceof PropietarioNoExiste) {
        return void res.status(404).json({ error: error.message })
      }

      next(error)
    }
  })

  rutas.get('/', async (req, res, next) => {
    const propietarioId = req.query['propietarioId']

    if (typeof propietarioId !== 'string') {
      return void res.status(400).json({
        error: 'propietarioId requerido como query param',
      })
    }

    try {
      const tanques = await deps.listarTanquesDeJugador.ejecutar(propietarioId)
      res.json(tanques.map(aTanqueDTO))
    } catch (error) {
      next(error)
    }
  })

  rutas.patch('/:tanqueId/nombre', exigirSesion(deps.tokens), async (req, res, next) => {
      const tanqueId = req.params['tanqueId']

      if (typeof tanqueId !== 'string' || !esUUID(tanqueId)) {
        return void res.status(400).json({ error: 'tanqueId debe ser un UUID válido' })
    }


    const cuerpo = (req.body ?? {}) as Record<string, unknown>
    const nombre = cuerpo['nombre']

    if (typeof nombre !== 'string' || nombre.trim().length < 2) {
      return void res.status(400).json({
        error: 'nombre requerido (mínimo 2 caracteres)',
      })
    }

    try {
      const { id: propietarioId } = res.locals['credencial'] as CredencialDTO

      const tanque = await deps.renombrarTanquePropio.ejecutar(
          tanqueId,
          propietarioId,
          nombre,
      )

      res.json(aTanqueDTO(tanque))
    } catch (error) {
      if (error instanceof TanqueNoExiste) {
        return void res.status(404).json({ error: error.message })
      }

      if (error instanceof TanqueNoPerteneceAlJugador) {
        return void res.status(403).json({ error: error.message })
      }

      if (error instanceof NombreTanqueInvalido) {
        return void res.status(400).json({ error: error.message })
      }

      next(error)
    }
  })

  return rutas
}
