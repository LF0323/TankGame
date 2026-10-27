
import { Router } from 'express'
import type { CredencialDTO, ServicioTokens } from '../../../dominio/puertos'
import { aTanqueDTO, esTipoTanque } from '../../../dominio/modelo/Tanque'

import {
  CrearTanque,
  PropietarioNoExiste,
} from '../../../aplicacion/casos-uso/CrearTanque'
import type { CrearTanqueDTO } from '../../../aplicacion/casos-uso/CrearTanque'

import {
  AplicarDanoTanque,
  TanqueNoEncontrado,
} from '../../../aplicacion/casos-uso/AplicarDanoTanque'

import {
  ObtenerTanquePorId,
  TanqueNoEncontrado as TanqueNoEncontradoPorId,
} from '../../../aplicacion/casos-uso/ObtenerTanquePorId'

import { EliminarTanque } from '../../../aplicacion/casos-uso/EliminarTanque'
import { ListarTanquesDeJugador } from '../../../aplicacion/casos-uso/ListarTanquesDeJugador'

import {
  NombreTanqueInvalido,
  RenombrarTanquePropio,
  TanqueNoExiste,
  TanqueNoPerteneceAlJugador,
} from '../../../aplicacion/casos-uso/RenombrarTanquePropio'

import {
  numeroNoNegativo,
  textoMinimo,
  textoRequerido,
} from '../../../aplicacion/validaciones'

import { exigirSesion } from './autenticacion'

function validarCreacion(cuerpo: unknown): CrearTanqueDTO | string {
  const d = (cuerpo ?? {}) as Record<string, unknown>

  const error =
    textoMinimo(d['nombre'], 'nombre', 2) ??
    textoRequerido(d['propietarioId'], 'propietarioId')

  if (error) return error

  if (!esTipoTanque(d['tipo'])) {
    return 'tipo inválido (LIGERO | MEDIO | PESADO)'
  }

  return {
    nombre: d['nombre'] as string,
    tipo: d['tipo'],
    propietarioId: d['propietarioId'] as string,
  }
}

function esUUID(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    valor,
  )
}

export interface DependenciasTanques {
  crearTanque: CrearTanque
  listarTanquesDeJugador: ListarTanquesDeJugador
  obtenerTanquePorId: ObtenerTanquePorId
  eliminarTanque: EliminarTanque
  aplicarDanoTanque: AplicarDanoTanque
  renombrarTanquePropio: RenombrarTanquePropio
  tokens: ServicioTokens
}

export function rutasTanques(deps: DependenciasTanques): Router {
  const rutas = Router()

  // Crear un tanque.
  rutas.post('/', async (req, res, next) => {
    const datos = validarCreacion(req.body)

    if (typeof datos === 'string') {
      return void res.status(400).json({ error: datos })
    }

    try {
      const tanque = await deps.crearTanque.ejecutar(datos)
      res.status(201).json(aTanqueDTO(tanque))
    } catch (error) {
      if (error instanceof PropietarioNoExiste) {
        return void res.status(404).json({ error: error.message })
      }

      next(error)
    }
  })

  // Listar los tanques de un propietario.
  rutas.get('/', async (req, res, next) => {
    const propietarioId = req.query['propietarioId']

    if (typeof propietarioId !== 'string') {
      return void res.status(400).json({
        error: 'propietarioId requerido como query param',
      })
    }

    try {
      const tanques =
        await deps.listarTanquesDeJugador.ejecutar(propietarioId)

      res.json(tanques.map(aTanqueDTO))
    } catch (error) {
      next(error)
    }
  })

  // Consultar un tanque por su identificador.
  rutas.get('/:tanqueId', async (req, res, next) => {
    const tanqueId = req.params['tanqueId']

    if (typeof tanqueId !== 'string') {
      return void res.status(400).json({ error: 'tanqueId requerido' })
    }

    try {
      const tanque = await deps.obtenerTanquePorId.ejecutar(tanqueId)
      res.json(aTanqueDTO(tanque))
    } catch (error) {
      if (error instanceof TanqueNoEncontradoPorId) {
        return void res.status(404).json({ error: error.message })
      }

      next(error)
    }
  })

  // Renombrar un tanque perteneciente al usuario autenticado.
  rutas.patch(
    '/:tanqueId/nombre',
    exigirSesion(deps.tokens),
    async (req, res, next) => {
      const tanqueId = req.params['tanqueId']

      if (typeof tanqueId !== 'string' || !esUUID(tanqueId)) {
        return void res.status(400).json({
          error: 'tanqueId debe ser un UUID válido',
        })
      }

      const cuerpo = (req.body ?? {}) as Record<string, unknown>
      const nombre = cuerpo['nombre']

      if (typeof nombre !== 'string' || nombre.trim().length < 2) {
        return void res.status(400).json({
          error: 'nombre requerido (mínimo 2 caracteres)',
        })
      }

      try {
        const { id: propietarioId } =
          res.locals['credencial'] as CredencialDTO

        const tanque = await deps.renombrarTanquePropio.ejecutar(
          tanqueId,
          propietarioId,
          nombre.trim(),
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
    },
  )

  // Aplicar daño a un tanque; requiere sesión.
  rutas.post(
    '/:tanqueId/recibir-dano',
    exigirSesion(deps.tokens),
    async (req, res, next) => {
      const tanqueId = req.params['tanqueId']

      if (typeof tanqueId !== 'string') {
        return void res.status(400).json({ error: 'tanqueId requerido' })
      }

      const cuerpo = (req.body ?? {}) as Record<string, unknown>
      const error = numeroNoNegativo(cuerpo['danoRecibido'], 'danoRecibido')

      if (error) {
        return void res.status(400).json({ error })
      }

      try {
        const { tanque, vivo } = await deps.aplicarDanoTanque.ejecutar(
          tanqueId,
          cuerpo['danoRecibido'] as number,
        )

        res.json({ ...aTanqueDTO(tanque), vivo })
      } catch (error) {
        if (error instanceof TanqueNoEncontrado) {
          return void res.status(404).json({ error: error.message })
        }

        next(error)
      }
    },
  )

  // Eliminar (desactivar) un tanque.
  rutas.delete('/:tanqueId', async (req, res, next) => {
    const tanqueId = req.params['tanqueId']

    if (typeof tanqueId !== 'string') {
      return void res.status(400).json({ error: 'tanqueId requerido' })
    }

    try {
      await deps.eliminarTanque.ejecutar(tanqueId)
      res.status(204).send()
    } catch (error) {
      if (error instanceof TanqueNoEncontrado) {
        return void res.status(404).json({ error: error.message })
      }

      next(error)
    }
  })

  return rutas
}