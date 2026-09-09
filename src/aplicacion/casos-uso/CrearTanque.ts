import type { Tanque, TipoTanque } from '../../dominio/modelo/Tanque'
import type { TanqueDAO, UsuarioDAO } from '../../dominio/puertos'

export class PropietarioNoExiste extends Error {
  constructor(propietarioId: string) {
    super(`No existe un usuario con id ${propietarioId}`)
  }
}

export interface CrearTanqueDTO {
  nombre: string
  tipo: TipoTanque
  propietarioId: string
}

export class CrearTanque {
  constructor(
    private readonly tanques: TanqueDAO,
    private readonly usuarios: UsuarioDAO,
  ) {}

  async ejecutar(datos: CrearTanqueDTO): Promise<Tanque> {
    if (!(await this.usuarios.porId(datos.propietarioId))) {
      throw new PropietarioNoExiste(datos.propietarioId)
    }

    const valoresPorTipo: Record<TipoTanque, { vida: number; dano: number; velocidad: number }> = {
      LIGERO: { vida: 70, dano: 8, velocidad: 9 },
      MEDIO: { vida: 100, dano: 12, velocidad: 6 },
      PESADO: { vida: 150, dano: 18, velocidad: 3 },
    }

    return this.tanques.guardar({
      nombre: datos.nombre.trim(),
      tipo: datos.tipo,
      propietarioId: datos.propietarioId,
      ...valoresPorTipo[datos.tipo],
    })
  }
}