export const RESULTADOS_PARTIDA = ['VICTORIA', 'DERROTA', 'EMPATE'] as const

export type ResultadoPartida = (typeof RESULTADOS_PARTIDA)[number]

export interface Partida {
  id: string
  resultado: ResultadoPartida
  puntaje: number
  duracionSegundos: number
  jugadorId: string
}

export type PartidaNueva = Omit<Partida, 'id'>

export interface PartidaDTO {
  id: string
  resultado: ResultadoPartida
  puntaje: number
  duracionSegundos: number
  jugadorId: string
}

export function esResultadoPartida(valor: unknown): valor is ResultadoPartida {
  return RESULTADOS_PARTIDA.includes(valor as ResultadoPartida)
}

export function aPartidaDTO({ id, resultado, puntaje, duracionSegundos, jugadorId }: Partida): PartidaDTO {
  return { id, resultado, puntaje, duracionSegundos, jugadorId }
}