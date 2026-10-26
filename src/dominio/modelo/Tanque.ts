export const TIPOS_TANQUE = ['LIGERO', 'MEDIO', 'PESADO'] as const

export type TipoTanque = (typeof TIPOS_TANQUE)[number]

/** Estadísticas con las que nace cada tipo de tanque. `vida` es también su vida máxima. */
export const ESTADISTICAS_BASE: Record<TipoTanque, { vida: number; dano: number; velocidad: number }> = {
  LIGERO: { vida: 70, dano: 8, velocidad: 9 },
  MEDIO: { vida: 100, dano: 12, velocidad: 6 },
  PESADO: { vida: 150, dano: 18, velocidad: 3 },
}

export interface Tanque {
  id: string
  nombre: string
  tipo: TipoTanque
  vida: number
  dano: number
  velocidad: number
  propietarioId: string
  activo: boolean
}

export type TanqueNuevo = Omit<Tanque, 'id' | 'activo'>

export interface TanqueDTO {
  id: string
  nombre: string
  tipo: TipoTanque
  vida: number
  dano: number
  velocidad: number
  propietarioId: string
  activo: boolean
}

export function esTipoTanque(valor: unknown): valor is TipoTanque {
  return TIPOS_TANQUE.includes(valor as TipoTanque)
}

export function aTanqueDTO({ id, nombre, tipo, vida, dano, velocidad, propietarioId, activo }: Tanque): TanqueDTO {
  return { id, nombre, tipo, vida, dano, velocidad, propietarioId, activo }
}