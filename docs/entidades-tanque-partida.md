# Entidades Tanque y Partida

## Tanque
Representa el vehículo de un jugador.
- `id`, `nombre`, `tipo` (LIGERO | MEDIO | PESADO)
- `vida`, `dano`, `velocidad`: calculados automáticamente según el tipo
- `propietarioId`: referencia al Usuario dueño

## Partida
Representa una partida jugada.
- `id`, `resultado` (VICTORIA | DERROTA | EMPATE)
- `puntaje`, `duracionSegundos`
- `jugadorId`: referencia al Usuario que jugó

Ambas entidades están definidas en `prisma/schema.prisma` y se relacionan
con `Usuario` mediante clave foránea, de modo que un tanque o una partida
no pueden existir sin un usuario válido.
