# ACT-043 - Convención de nombres de ramas

## Información de la actividad

**ID:** ACT-043

**Actividad:** Establecer una convención de nombres de ramas que incluya el identificador de actividad.

**Responsable:** Sergio Alexander Castro López

---

# Introducción

El proyecto TankGame requiere una estrategia de control de versiones que facilite la organización del trabajo realizado por los integrantes del equipo. A medida que el número de actividades aumenta, resulta necesario mantener una estructura clara para la creación de ramas que permitan relacionar fácilmente los cambios realizados con las actividades registradas en el backlog.

La adopción de una convención de nombres mejora la trazabilidad, la colaboración entre desarrolladores, la revisión de cambios y la integración de funcionalidades dentro del repositorio.

---

# Objetivo

Definir una convención estandarizada para la creación de ramas dentro del repositorio del proyecto TankGame, permitiendo relacionar cada rama con una actividad específica del backlog.

---

# Justificación

La ausencia de una convención puede generar problemas como:

- Dificultad para identificar el propósito de una rama.
- Problemas para relacionar cambios con actividades del backlog.
- Confusión durante procesos de revisión e integración.
- Falta de trazabilidad en el historial del proyecto.

Por esta razón se establece una nomenclatura única para todo el equipo.

---

# Convención adoptada

Todas las ramas deberán seguir la estructura:

feature/ACT-XXX-descripcion

Donde:

- feature identifica una actividad o funcionalidad.
- ACT-XXX corresponde al identificador de la actividad.
- descripcion corresponde a una descripción corta y significativa.

---

# Reglas de nombramiento

1. Todas las ramas deben iniciar con el prefijo feature.
2. Todas las ramas deben incluir el ID de la actividad.
3. La descripción debe escribirse en minúsculas.
4. Se utilizarán guiones para separar palabras.
5. No se utilizarán espacios ni caracteres especiales.
6. Cada actividad tendrá una rama principal asociada.

---

# Ejemplos de aplicación

| Actividad | Rama propuesta |
|------------|------------|
| ACT-001 | feature/ACT-001-definicion-objetivo |
| ACT-002 | feature/ACT-002-descripcion-usuario |
| ACT-003 | feature/ACT-003-alcance-version |
| ACT-004 | feature/ACT-004-flujo-partida |
| ACT-005 | feature/ACT-005-funciones-conservar |
| ACT-006 | feature/ACT-006-limitaciones-tecnicas |
| ACT-007 | feature/ACT-007-requisitos-login |
| ACT-008 | feature/ACT-008-partidas-multijugador |
| ACT-009 | feature/ACT-009-control-tanque |
| ACT-010 | feature/ACT-010-finalizacion-partida |
| ACT-011 | feature/ACT-011-guardar-progreso |
| ACT-012 | feature/ACT-012-perfil-jugador |
| ACT-013 | feature/ACT-013-ranking-global |
| ACT-014 | feature/ACT-014-mejoras-tanque |
| ACT-015 | feature/ACT-015-requisitos-no-funcionales |
| ACT-016 | feature/ACT-016-revision-requisitos |
| ACT-017 | feature/ACT-017-actualizacion-readme |
| ACT-018 | feature/ACT-018-configuracion-local |
| ACT-019 | feature/ACT-019-inventario-componentes |
| ACT-020 | feature/ACT-020-diagrama-flujo |
| ACT-021 | feature/ACT-021-arquitectura-alto-nivel |
| ACT-022 | feature/ACT-022-flujo-datos |
| ACT-023 | feature/ACT-023-analisis-backend-java |
| ACT-024 | feature/ACT-024-operaciones-backend |
| ACT-025 | feature/ACT-025-estructura-nodejs |
| ACT-026 | feature/ACT-026-inicializacion-node |
| ACT-027 | feature/ACT-027-variables-entorno |
| ACT-028 | feature/ACT-028-configuracion-gitignore |
| ACT-029 | feature/ACT-029-arranque-servidor |
| ACT-030 | feature/ACT-030-endpoints-backend |
| ACT-031 | feature/ACT-031-controladores |
| ACT-032 | feature/ACT-032-servicios |
| ACT-033 | feature/ACT-033-persistencia |
| ACT-034 | feature/ACT-034-mapeo-java-node |
| ACT-035 | feature/ACT-035-validacion-backend |
| ACT-036 | feature/ACT-036-entidades-datos |
| ACT-037 | feature/ACT-037-perfiles-jugadores |
| ACT-038 | feature/ACT-038-puntajes-partidas |
| ACT-039 | feature/ACT-039-conexion-base-datos |
| ACT-040 | feature/ACT-040-validacion-persistencia |
| ACT-041 | feature/ACT-041-integridad-datos |
| ACT-042 | feature/ACT-042-estrategia-ramas |
| ACT-043 | feature/ACT-043-convencion-ramas |
| ACT-044 | feature/ACT-044-convencion-commits |
| ACT-045 | feature/ACT-045-procedimiento-pr |
| ACT-046 | feature/ACT-046-plantilla-issue |
| ACT-047 | feature/ACT-047-seguridad-repositorio |
| ACT-048 | feature/ACT-048-responsabilidades-backend |
| ACT-049 | feature/ACT-049-principio-srp |
| ACT-050 | feature/ACT-050-principio-dry |
| ACT-051 | feature/ACT-051-inversion-dependencias |
| ACT-052 | feature/ACT-052-abstracciones-backend |
| ACT-053 | feature/ACT-053-patrones-diseno |
| ACT-054 | feature/ACT-054-refactorizacion |
| ACT-055 | feature/ACT-055-validacion-entradas |

---

# Beneficios

La aplicación de esta convención permitirá:

- Mejor organización del repositorio.
- Identificación rápida de actividades.
- Relación clara entre Jira y GitHub.
- Seguimiento eficiente de cambios.
- Mayor facilidad para crear Pull Requests.

---

# Conclusión

El equipo adopta la convención:

feature/ACT-XXX-descripcion

como estándar oficial para la creación de ramas asociadas a las actividades del proyecto TankGame.