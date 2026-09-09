import { Router } from 'express'
import { aPartidaDTO, esResultadoPartida } from '../../../dominio/modelo/Partida'
import { JugadorNoExiste, RegistrarPartida } from '../../../aplicacion/casos-uso/RegistrarPartida'
import type { RegistrarPartidaDTO } from '../../../aplicacion/casos-uso/RegistrarPartida'
import { ListarPartidasDeJugador } from '../../../aplicacion/casos-uso/ListarPartidasDeJugador'

function validarRegistro(cuerpo: unknown): RegistrarPartidaDTO | string {
  const d = (cuerpo ?? {}) as Record<string, unknown>
  if (!esResultadoPartida(d['resultado'])) return 'resultado inválido (VICTORIA | DERROTA | EMPATE)'
  if (typeof d['puntaje'] !== 'number' || d['puntaje'] < 0) return 'puntaje inválido'
  if (typeof d['duracionSegundos'] !== 'number' || d['duracionSegundos'] <= 0) return 'duracionSegundos inválido'
  if (typeof d['jugadorId'] !== 'string') return 'jugadorId requerido'
  return { resultado: d['resultado'], puntaje: d['puntaje'], duracionSegundos: d['duracionSegundos'], jugadorId: d['jugadorId'] }
}

export interface DependenciasPartidas {
  registrarPartida: RegistrarPartida
  listarPartidasDeJugador: ListarPartidasDeJugador
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

  return rutas
}