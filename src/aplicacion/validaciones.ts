// Funciones reutilizables de validación de entradas.
// Devuelven un mensaje de error (string) si el valor no cumple, o null si es válido.

export function textoMinimo(valor: unknown, campo: string, minimo: number): string | null {
  if (typeof valor !== 'string' || valor.trim().length < minimo) {
    return `${campo} requerido (mínimo ${minimo} caracteres)`
  }
  return null
}

export function textoRequerido(valor: unknown, campo: string): string | null {
  if (typeof valor !== 'string' || valor.trim().length === 0) {
    return `${campo} requerido`
  }
  return null
}

export function numeroNoNegativo(valor: unknown, campo: string): string | null {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0) {
    return `${campo} inválido`
  }
  return null
}

export function numeroPositivo(valor: unknown, campo: string): string | null {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
    return `${campo} inválido`
  }
  return null
}