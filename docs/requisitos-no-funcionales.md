# ACT-015: Especificación de Requisitos No Funcionales (RNF)

## Información de la Actividad
- **ID de la Tarea:** ACT-015
- **Proyecto:** TankGame (Migración Backend Java a Node.js)
- **Responsable:** Luis Felipe González López
- **Estado:** En desarrollo / Completado

---

## 1. Objetivo
Establecer y documentar los criterios de calidad, atributos del sistema y restricciones técnicas que rigen el backend de TankGame en cuanto a seguridad básica, mantenibilidad del código, usabilidad de las APIs y rendimiento esperado.

---

## 2. Requisitos No Funcionales

### 2.1. Seguridad Básica (RNF-SEG)
- **RNF-SEG-01 (Autenticación e Identidad):** Las rutas protegidas exigen un token JWT válido transmitido vía el encabezado `Authorization: Bearer <token>`. Los tokens son firmados mediante el algoritmo `HS256` y poseen un tiempo de expiración limitado (8 horas).
- **RNF-SEG-02 (Cifrado de Credenciales):** Las contraseñas de los usuarios nunca se persisten en texto plano; deben ser procesadas utilizando el algoritmo `bcrypt` antes de la persistencia.
- **RNF-SEG-03 (Protección de Secretos):** Secretos de la aplicación, claves JWT y credenciales de bases de datos deben gestionarse exclusivamente mediante variables de entorno (`.env`) y no deben incluirse en el repositorio de código.
- **RNF-SEG-04 (Validación de Entradas):** Toda petición entrante debe sanitizarse y validarse para prevenir fallos de seguridad o corrupción de datos.

### 2.2. Mantenibilidad (RNF-MAN)
- **RNF-MAN-01 (Arquitectura por Capas):** El backend debe mantener una separación clara de responsabilidades: definición de rutas (`routes`), lógica de control (`controllers`), casos de uso/negocio (`services`) y acceso a datos (`repositories`).
- **RNF-MAN-02 (Adherencia a Principios SOLID y DRY):** El código debe evitar la duplicación de lógica de negocio y seguir el principio de responsabilidad única para facilitar pruebas y refactorizaciones.
- **RNF-MAN-03 (Tipado Estricto):** El desarrollo en Node.js se soporta sobre TypeScript para garantizar un tipado estático, previniendo errores de tipo en tiempo de ejecución.
- **RNF-MAN-04 (Documentación de Código y API):** Toda la especificación de contratos HTTP se mantiene al día en el archivo centralizado OpenAPI/Swagger (`openapi.ts`).

### 2.3. Usabilidad de la API (RNF-USA)
- **RNF-USA-01 (Estándar RESTful):** Uso consistente de verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`) y códigos de estado HTTP estándar (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `409 Conflict`).
- **RNF-USA-02 (Respuestas de Error Homogéneas):** Todos los errores deben retornar una estructura estandarizada en formato JSON (`ErrorDTO`), facilitando la interpretación por parte del cliente o interfaz gráfica.
- **RNF-USA-03 (Interactividad en Swagger UI):** La API debe ser totalmente navegable y de fácil prueba desde la interfaz Swagger cargada en `/api-docs`.

### 2.4. Rendimiento Esperado (RNF-REN)
- **RNF-REN-01 (Tiempo de Respuesta):** Transacciones simples (comprobación de salud, lectura de perfiles o listado de tanques) deben responder en menos de **200 ms**. Operaciones complejas de persistencia o creación de salas deben tomar menos de **500 ms**.
- **RNF-REN-02 (Concurrencia en Partidas):** El servidor debe soportar la gestión simultánea de múltiples salas multijugador de **2 a 4 jugadores** por partida sin degradación en el tiempo de procesamiento de peticiones HTTP.
- **RNF-REN-03 (Consumo Eficiente de Recursos):** Aprovechamiento del bucle de eventos (*event loop*) asíncrono de Node.js, evitando bloqueos por I/O.

---

## 3. Matriz de Verificación de Calidad

| ID | Criterio de Verificación | Método de Prueba |
| :--- | :--- | :--- |
| **RNF-SEG** | Peticiones a rutas protegidas sin encabezado `Bearer` | Prueba HTTP retorna `401 Unauthorized`. |
| **RNF-MAN** | Estructura modular del proyecto | Revisión de código y arquitectura de carpetas. |
| **RNF-USA** | Formato de error homogéneo | Envío de datos inválidos en el cuerpo de la petición retorna `{"error": "..."}`. |
| **RNF-REN** | Tiempo de respuesta de endpoints | Monitoreo o pruebas con Postman/Curl midiendo latencia. |