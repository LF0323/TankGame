import { Router } from 'express'
import { aPartidaDTO, esResultadoPartida } from '../../../dominio/modelo/Partida'
import { JugadorNoExiste, RegistrarPartida } from '../../../aplicacion/casos-uso/RegistrarPartida'
import type { RegistrarPartidaDTO } from '../../../aplicacion/casos-uso/RegistrarPartida'
import { ListarPartidasDeJugador } from '../../../aplicacion/casos-uso/ListarPartidasDeJugador'
import { numeroNoNegativo, numeroPositivo, textoRequerido } from '../../../aplicacion/validaciones'
import {ObtenerPartidaPorId, PartidaNoEncontrada} from '../../../aplicacion/casos-uso/ObtenerPartidaPorId'

function validarRegistro(cuerpo: unknown): RegistrarPartidaDTO | string {
  const d = (cuerpo ?? {}) as Record<string, unknown>
  if (!esResultadoPartida(d['resultado'])) return 'resultado inválido (VICTORIA | DERROTA | EMPATE)'
  const error =
    numeroNoNegativo(d['puntaje'], 'puntaje') ??
    numeroPositivo(d['duracionSegundos'], 'duracionSegundos') ??
    textoRequerido(d['jugadorId'], 'jugadorId')
  if (error) return error
  return {
    resultado: d['resultado'],
    puntaje: d['puntaje'] as number,
    duracionSegundos: d['duracionSegundos'] as number,
    jugadorId: d['jugadorId'] as string,
  }
}

export interface DependenciasPartidas {
  registrarPartida: RegistrarPartida
  listarPartidasDeJugador: ListarPartidasDeJugador
  obtenerPartidaPorId: ObtenerPartidaPorId
}

export function rutasPartidas(deps: DependenciasPartidas): Router {
  const rutas = Router()

  rutas.post('/', async (req, res, next) => {
    const datos = validarRegistro(req.body)
    if (typeof datos === 'string') return void res.status(400).json({ error: datos })
    try {
      res.status(201).json(aPartidaDTO(await deps.registrarPartida.ejecutar(datos)))
    } catch (error) {
      if (error instanceof JugadorNoExiste) return void res.status(404).json({ error: error.message })
      next(error)
    }
  })

  rutas.get('/', async (req, res, next) => {
    const jugadorId = req.query['jugadorId']
    if (typeof jugadorId !== 'string') return void res.status(400).json({ error: 'jugadorId requerido como query param' })
    try {
      const partidas = await deps.listarPartidasDeJugador.ejecutar(jugadorId)
      res.json(partidas.map(aPartidaDTO))
    } catch (error) {
      next(error)
    }
  })

  // Consultar una partida por su identificador.
  rutas.get('/:partidaId', async (req, res, next) => {
    const partidaId = req.params['partidaId']

    if (typeof partidaId !== 'string') {
      return void res.status(400).json({ error: 'partidaId requerido' })
    }

    try {
      const partida = await deps.obtenerPartidaPorId.ejecutar(partidaId)
      res.json(aPartidaDTO(partida))
    } catch (error) {
      if (error instanceof PartidaNoEncontrada) {
        return void res.status(404).json({ error: error.message })
      }

      next(error)
    }
  })

  return rutas
}