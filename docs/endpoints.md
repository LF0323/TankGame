# Endpoints del backend (TankGame)

Todas las rutas cuelgan del prefijo `/api`. La documentación interactiva
(Swagger) está en `/api/docs`.

| Método | Ruta | Qué hace | Respuestas |
| --- | --- | --- | --- |
| GET | `/api/salud` | Verifica que el servicio responde | 200 |
| POST | `/api/auth/registro` | Registra un usuario | 201, 400, 409 |
| POST | `/api/auth/login` | Inicia sesión y devuelve un token JWT | 200, 400, 401 |
| GET | `/api/auth/perfil` | Devuelve el usuario de la sesión (requiere token) | 200, 401, 404 |
| POST | `/api/tanques` | Crea un tanque para un jugador | 201, 400, 404 |
| GET | `/api/tanques?propietarioId=` | Lista los tanques de un jugador | 200, 400 |
| POST | `/api/partidas` | Registra una partida jugada | 201, 400, 404 |
| GET | `/api/partidas?jugadorId=` | Lista las partidas de un jugador | 200, 400 |

## Cuerpos de las peticiones

- Registro: `nombre`, `correo`, `clave` (y `rol`, opcional)
- Login: `correo`, `clave`
- Crear tanque: `nombre`, `tipo` (LIGERO | MEDIO | PESADO), `propietarioId`
- Registrar partida: `resultado` (VICTORIA | DERROTA | EMPATE), `puntaje`,
  `duracionSegundos`, `jugadorId`