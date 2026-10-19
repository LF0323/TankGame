# ACT-005: Funciones Existentes del Juego Conservadas

## Información de la Actividad
- **ID de la Tarea:** ACT-005
- **Proyecto:** TankGame (Migración Backend Java a Node.js)
- **Responsables:** Equipo de Desarrollo (Luisa, Luis Felipe, Sergio)
- **Estado:** Completado

---

## 1. Objetivo
Identificar, inventariar y documentar formalmente las funcionalidades del backend heredado en Java que deben mantenerse sin alteraciones lógicas durante el proceso de migración hacia la plataforma Node.js con TypeScript.

---

## 2. Inventario de Funciones Conservadas

### 2.1. Monitoreo y Salud del Servicio
- **Endpoint:** `GET /api/salud`
- **Descripción:** Comprobación del estado operativo del proceso servidor.
- **Reglas del Negocio:**
  - Responde con un estado `200 OK` y el payload `{"estado": "ok"}` si el servicio atiende peticiones HTTP.
  - No requiere acceso ni validación contra la base de datos (diseñado para probes de Kubernetes/Docker Healthchecks).

### 2.2. Autenticación y Gestión de Usuarios
- **Endpoints:**
  - `POST /api/auth/registro`
  - `POST /api/auth/login`
  - `GET /api/auth/perfil`
- **Reglas del Negocio:**
  - Normalización de correos electrónicos a minúsculas y eliminación de espacios en blanco.
  - Verificación de unicidad del correo electrónico (retorna `409 Conflict` si ya existe).
  - Cifrado obligatorio de contraseñas mediante algoritmo `bcrypt` antes de la persistencia.
  - Emisión de tokens de sesión JWT firmados con algoritmo `HS256` y vigencia de 8 horas.
  - Protección de la ruta `/auth/perfil` exigiendo encabezado `Authorization: Bearer <token>`.

### 2.3. Gestión de Tanques
- **Endpoints:**
  - `POST /api/tanques`
  - `GET /api/tanques`
- **Reglas del Negocio:**
  - Validación previa de la existencia del propietario mediante `propietarioId` (retorna `404 Not Found` si no existe).
  - Cálculo automático de estadísticas del vehículo (`vida`, `dano`, `velocidad`) en el servidor según el enum seleccionado (`LIGERO`, `MEDIO`, `PESADO`).
  - Consulta de tanques filtrados obligatoriamente por el parámetro de consulta (`query param`) `propietarioId`.

### 2.4. Registro de Partidas
- **Endpoints:**
  - `POST /api/partidas`
  - `GET /api/partidas`
- **Reglas del Negocio:**
  - Validación de la existencia del usuario que jugó la partida mediante `jugadorId`.
  - Registro de atributos obligatorios: resultado (`VICTORIA`, `DERROTA`, `EMPATE`), puntaje (mínimo 0) y duración en segundos (mínimo 1).
  - Listado de historial de partidas por jugador ordenado descendentemente (partida más reciente primero).

---

## 3. Trazabilidad Técnica
Todas las funciones listadas se encuentran reflejadas en la especificación OpenAPI v3.0.3 en el archivo `src/swagger/openapi.ts`, preservando los esquemas DTO (`UsuarioDTO`, `SesionDTO`, `TanqueDTO`, `PartidaDTO`, `ErrorDTO`).