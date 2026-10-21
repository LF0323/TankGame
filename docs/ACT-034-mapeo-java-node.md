# ACT-034 - Correspondencia entre componentes Java y Node.js

## Objetivo

Documentar la correspondencia entre los componentes identificados en la arquitectura Java original y su equivalente dentro de la implementación actual desarrollada en Node.js.

---

## Análisis realizado

Se realizó una revisión de la estructura actual del proyecto TankGame, identificando la organización de carpetas, capas de aplicación, entidades de dominio y componentes responsables de la lógica de negocio.

El objetivo es mantener la separación de responsabilidades existente durante futuras modificaciones o migraciones.

---

## Correspondencia de capas

| Arquitectura Java | Arquitectura Node.js |
|-------------------|---------------------|
| Controller | Controller |
| Service | Casos de Uso |
| Repository | DAO Prisma |
| Entity | Entidad de Dominio |
| DTO | DTO |
| Persistence Layer | Infraestructura Persistencia |
| Security Layer | Infraestructura Seguridad |

---

## Capa de presentación

### Java

Responsable de recibir solicitudes HTTP y entregar respuestas al cliente.

### Node.js

Ubicada dentro de:

```text
src/infraestructura/http
```

Contiene los controladores y rutas responsables de exponer la API REST.

---

## Capa de aplicación

### Java

Implementada mediante servicios encargados de ejecutar reglas de negocio.

### Node.js

Ubicada dentro de:

```text
src/aplicacion/casos-uso
```

Casos identificados:

- RegistrarUsuario
- IniciarSesion
- CrearTanque
- ListarTanquesDeJugador
- RegistrarPartida
- ListarPartidasDeJugador

---

## Capa de persistencia

### Java

Generalmente implementada mediante repositorios y acceso a base de datos.

### Node.js

Implementada mediante Prisma.

Ubicación:

```text
src/infraestructura/persistencia
```

Componentes identificados:

- UsuarioDAOPrisma
- TanqueDAOPrisma
- PartidaDAOPrisma

---

## Capa de seguridad

### Java

Manejo de autenticación y autorización.

### Node.js

Ubicación:

```text
src/infraestructura/seguridad
```

Componentes identificados:

- ClavesBcrypt
- TokensJwt

---

## Entidades de dominio identificadas

### Usuario

Representa los jugadores y usuarios del sistema.

### Tanque

Representa los vehículos controlados por los jugadores.

### Partida

Representa los resultados registrados durante una partida.

---

## Persistencia de datos

El sistema utiliza:

- PostgreSQL
- Prisma ORM

La conexión se realiza mediante la variable:

```env
DATABASE_URL
```

definida dentro del archivo `.env`.

---

## Beneficios de la correspondencia

La identificación de equivalencias entre componentes permite:

- Facilitar la comprensión de la arquitectura.
- Apoyar futuros procesos de migración.
- Mantener la separación de responsabilidades.
- Mejorar el mantenimiento del sistema.
- Reducir errores durante futuras implementaciones.

---

## Conclusiones

La arquitectura actual de Node.js mantiene una separación clara entre presentación, aplicación, persistencia y seguridad, permitiendo establecer una correspondencia directa con los componentes tradicionalmente utilizados en aplicaciones Java empresariales.

---

## Estado actual

Actividad en desarrollo.

Documento preliminar sujeto a futuras actualizaciones.
