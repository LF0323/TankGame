# Estructura de carpetas del backend (TankGame)

El backend sigue arquitectura hexagonal, dividida en tres capas:

## src/dominio/
Contiene las reglas del negocio puras, sin depender de nada externo.
- `modelo/`: las entidades (Usuario, Tanque, Partida) y sus tipos.
- `puertos/`: las interfaces (contratos) que la infraestructura debe cumplir,
  por ejemplo `TanqueDAO` y `PartidaDAO`.

## src/aplicacion/
- `casos-uso/`: la lógica de cada acción del sistema (CrearTanque,
  RegistrarPartida, etc.), que depende solo de los puertos del dominio,
  nunca de la infraestructura directamente.

## src/infraestructura/
Las implementaciones concretas:
- `persistencia/`: acceso a la base de datos con Prisma (TanqueDAOPrisma,
  PartidaDAOPrisma).
- `http/`: servidor Express, rutas y documentación Swagger.
- `seguridad/`: hashing de claves y JWT.

Regla clave: dominio y aplicación nunca importan nada de infraestructura.
Eso se verifica automáticamente con `npm run arquitectura`.