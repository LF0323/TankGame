# ACT-045 - Procedimiento de Pull Request, revisión e integración

## Información de la actividad

**ID:** ACT-045

**Actividad:** Definir el procedimiento de Pull Request, revisión e integración de cambios.

**Responsable:** Sergio Alexander Castro López

---

# Introducción

El desarrollo colaborativo requiere mecanismos de control que permitan integrar cambios de manera segura y organizada. Los Pull Requests ofrecen un proceso estructurado para validar modificaciones antes de incorporarlas a la rama principal del proyecto.

Este documento establece el flujo de trabajo que utilizará el equipo para realizar integraciones dentro del repositorio TankGame.

---

# Objetivo

Definir un procedimiento estándar para la revisión, validación e integración de cambios realizados por los integrantes del equipo.

---

# Flujo general de trabajo

```text
Backlog
↓
Jira
↓
Creación de rama
↓
Desarrollo
↓
Commit
↓
Push
↓
Pull Request
↓
Revisión
↓
Merge
↓
Main
```

---

# Procedimiento detallado

## 1. Actualización de la rama principal

Antes de comenzar una actividad se debe actualizar la rama principal.

Comandos:

```bash
git checkout main
git pull origin main
```

---

## 2. Creación de la rama de trabajo

Cada actividad debe desarrollarse en una rama independiente siguiendo la convención definida.

Ejemplo:

```text
feature/ACT-043-convencion-ramas
```

---

## 3. Desarrollo de la actividad

Los cambios deben realizarse únicamente dentro de la rama creada.

La rama principal no debe modificarse directamente.

---

## 4. Registro de cambios

Una vez finalizada la actividad se agregan los archivos modificados.

```bash
git add .
```

---

## 5. Creación del commit

Todos los commits deben incluir el código de la actividad.

Ejemplos:

```text
ACT-043: define convencion de nombres para ramas
```

```text
ACT-045: documenta procedimiento de pull request
```

---

## 6. Envío al repositorio remoto

Los cambios deben subirse a GitHub.

```bash
git push origin nombre-rama
```

Ejemplo:

```bash
git push origin feature/ACT-045-procedimiento-pr
```

---

## 7. Creación del Pull Request

Desde GitHub se debe abrir un Pull Request indicando:

- Actividad relacionada.
- Descripción de cambios.
- Evidencia asociada.
- Rama origen.
- Rama destino.

---

## 8. Revisión

Durante la revisión se debe verificar:

### Calidad

- Cumplimiento de la actividad.
- Ausencia de errores evidentes.

### Organización

- Estructura correcta de archivos.
- Ubicación adecuada de documentos.

### Convenciones

- Uso correcto de ramas.
- Uso correcto de commits.

### Seguridad

- No inclusión de claves.
- No inclusión de tokens.
- No inclusión de archivos sensibles.

---

## 9. Integración

Una vez aprobada la revisión se podrá realizar el Merge hacia la rama principal.

El historial de cambios debe mantenerse para garantizar la trazabilidad del proyecto.

---

# Roles involucrados

## Desarrollador

Responsable de:

- Crear la rama.
- Realizar cambios.
- Generar commits.
- Crear Pull Request.

## Revisor

Responsable de:

- Verificar cambios.
- Validar evidencia.
- Aprobar integración.

---

# Beneficios

La utilización de Pull Requests aporta:

- Control de cambios.
- Mayor calidad del software.
- Mejor colaboración.
- Historial organizado.
- Mayor trazabilidad.

---

# Relación con el backlog

Cada Pull Request debe estar asociado a una actividad identificada mediante un código ACT.

Ejemplo:

| Actividad | Rama | Commit |
|------------|------------|------------|
| ACT-043 | feature/ACT-043-convencion-ramas | ACT-043: define convencion de nombres para ramas |
| ACT-045 | feature/ACT-045-procedimiento-pr | ACT-045: documenta procedimiento de pull request |

---

# Conclusión

Todo cambio realizado dentro del proyecto TankGame deberá desarrollarse en una rama independiente, registrarse mediante commits identificados con el código de actividad correspondiente y pasar por un proceso de Pull Request antes de su integración a la rama principal.