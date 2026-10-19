# Persistencia de datos tras reinicio del backend (ACT-040)

## Objetivo
Validar que los datos requeridos sobreviven al cierre y reinicio del backend.

## Prueba realizada
1. Se levantó Postgres (`npm run db:up`) y el backend (`npm run dev`).
2. Se registró un usuario, se hizo login y se creó un tanque y una partida.
3. Se listaron con GET /api/tanques?propietarioId=... y GET /api/partidas?jugadorId=...
4. Se apagó el backend (Ctrl + C) y se volvió a iniciar con `npm run dev`.
5. Se hizo login de nuevo y se listaron otra vez el tanque y la partida.

## Resultado
Tras el reinicio siguieron existiendo los mismos registros:
- Tanque `fac276b7-11b1-4a69-8d60-3e21a0746aa2` (Tanque Prueba, tipo MEDIO)
- Partida `89b6a117-d078-4efe-9e21-c38384401248` (VICTORIA, puntaje 500)

Los datos se guardan en Postgres (contenedor Docker), no en la memoria del backend.

## Observación
Al crear el tanque se envió dano=20 y velocidad=5, pero se guardó dano=12 y velocidad=6, porque el backend asigna esos valores según el tipo MEDIO.
