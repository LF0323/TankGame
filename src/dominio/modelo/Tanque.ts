export const TIPOS_TANQUE = ['LIGERO', 'MEDIO', 'PESADO'] as const

export type TipoTanque = (typeof TIPOS_TANQUE)[number]

export interface Tanque {
  id: string
  nombre: string
  tipo: TipoTanque
  vida: number
  dano: number
  velocidad: number
  propietarioId: string
}

export type TanqueNuevo = Omit<Tanque, 'id'>

export interface TanqueDTO {
  id: string
  nombre: string
  tipo: TipoTanque
  vida: number
  dano: number
  velocidad: number
  propietarioId: string
}

export function esTipoTanque(valor: unknown): valor is TipoTanque {
  return TIPOS_TANQUE.includes(valor as TipoTanque)
}

export function aTanqueDTO({ id, nombre, tipo, vida, dano, velocidad, propietarioId }: Tanque): TanqueDTO {
  return { id, nombre, tipo, vida, dano, velocidad, propietarioId }
}