# ACT-008: Especificación de Requisitos Funcionales para Partidas Multijugador

## Información de la Actividad
- **ID de la Tarea:** ACT-008
- **Proyecto:** TankGame (Migración Backend Java a Node.js)
- **Responsables:** Equipo de Desarrollo (Luisa, Luis Felipe, Sergio)
- **Estado:** Completado

---

## 1. Objetivo
Redactar y definir detalladamente los requisitos funcionales asociados a la creación, búsqueda y unión a salas de partidas multijugador en línea, garantizando una capacidad de **2 a 4 jugadores** por partida.

---

## 2. Requisitos Funcionales (RF)

### RF-M01: Creación de Sala Multijugador
- **Descripción:** Cualquier jugador autenticado con token JWT válido debe poder crear una nueva sala de partida multijugador.
- **Detalles:**
  - El sistema genera un código o identificador único (`salaId`) para la sesión.
  - El creador de la sala asume el rol inicial de anfitrión (*host*).
  - La sala se crea en estado `EN_ESPERA`.

### RF-M02: Unión a Sala Existente
- **Descripción:** Un jugador autenticado puede unirse a una sala de partida en espera mediante su identificador o código de acceso.
- **Detalles:**
  - El jugador debe contar con al menos un tanque registrado en su inventario.
  - Al unirse, el jugador pasa al listado de participantes de la sala.

### RF-M03: Capacidad Mínima y Máxima de Jugadores
- **Descripción:** El sistema valida estrictamente que la cantidad de participantes por partida se encuentre dentro del rango permitido (2 a 4 jugadores).
- **Reglas del Negocio:**
  - **Mínimo:** La partida no puede iniciar si hay menos de **2 jugadores** en la sala.
  - **Máximo:** La sala no permite el ingreso de más de **4 jugadores** simultáneos.
  - Intentar unirse a una sala con 4 jugadores retornará un error `400 Bad Request` indicando que la sala está llena.

### RF-M04: Estados y Transiciones de la Sala
- **Descripción:** La sala multijugador maneja un ciclo de vida estructurado:
  - `EN_ESPERA`: Sala creada con 1 a 3 jugadores; acepta nuevos participantes.
  - `LLENA`: Sala con 4 jugadores; bloquea temporalmente nuevos ingresos.
  - `EN_CURSO`: Partida iniciada tras cumplir el cupo mínimo (>= 2) y la confirmación del anfitrión/jugadores.
  - `FINALIZADA`: Partida concluida; procesa y persiste los resultados individuales e historial.

### RF-M05: Asignación de Tanque por Jugador
- **Descripción:** Antes de marcarse como "listo" o iniciar la partida, cada participante debe vincular el `tanqueId` que utilizará durante el combate.

### RF-M06: Abandono o Desconexión de Sala en Espera
- **Descripción:** Si un jugador abandona la sala antes de iniciar:
  - El cupo libre se habilita de inmediato para otros participantes.
  - Si el anfitrión abandona la sala, el rol de anfitrión se reasigna al siguiente jugador conectado.
  - Si la sala queda con 0 jugadores, el sistema la destruye automáticamente.

---

## 3. Criterios de Aceptación (Tabla de Casos)

| Código | Escenario | Resultado Esperado |
| :--- | :--- | :--- |
| **CA-01** | Un usuario crea una sala | Sala creada en estado `EN_ESPERA` con `salaId` único. |
| **CA-02** | Un 2.º jugador se une a la sala | Jugador agregado. La partida queda habilitada para iniciar. |
| **CA-03** | Intento de inicio con 1 jugador | El sistema bloquea el inicio indicando requerimiento mínimo de 2 jugadores. |
| **CA-04** | Se une un 5.º jugador a la sala | El sistema rechaza la petición con error 400 (Capacidad máxima alcanzada: 4 jugadores). |
| **CA-05** | Finalización de combate multijugador | Se registra el resultado y puntaje individual en la entidad `Partida`. |

---

## 4. Trazabilidad
Esta especificación complementa la documentación OpenAPI v3.0.3 en `src/swagger/openapi.ts` en las secciones correspondientes a la entidad `Partidas`.