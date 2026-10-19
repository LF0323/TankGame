import { ROLES } from '../../dominio/modelo/Usuario'
import { TIPOS_TANQUE } from '../../dominio/modelo/Tanque'
import { RESULTADOS_PARTIDA } from '../../dominio/modelo/Partida'

const usuario = {
  type: 'object',
  description:
    'Usuario del sistema tal como viaja por HTTP (`UsuarioDTO`): la entidad del dominio sin el hash ' +
    'de la clave, que nunca sale del servidor.',
  properties: {
    id: { type: 'string', format: 'uuid', example: 'cd9c06cf-b57f-4e22-bc47-589a074e8c2c' },
    nombre: { type: 'string', example: 'Ana Agente' },
    correo: { type: 'string', format: 'email', example: 'ana@uam.edu.co' },
    rol: { type: 'string', enum: ROLES, example: 'AGENTE' },
    activo: { type: 'boolean', example: true },
  },
  required: ['id', 'nombre', 'correo', 'rol', 'activo'],
}

const sesion = {
  type: 'object',
  description: 'Resultado de un inicio de sesión: el token y el usuario dueño de la sesión.',
  properties: {
    token: { type: 'string', description: 'JWT para el encabezado `Authorization: Bearer <token>`.' },
    usuario: { $ref: '#/components/schemas/UsuarioDTO' },
  },
  required: ['token', 'usuario'],
}

const tanque = {
  type: 'object',
  description: 'Tanque del sistema tal como viaja por HTTP (`TanqueDTO`).',
  properties: {
    id: { type: 'string', format: 'uuid', example: 'd9b39201-89aa-4c1b-99e3-f25b64e9841c' },
    nombre: { type: 'string', example: 'Rex' },
    tipo: { type: 'string', enum: TIPOS_TANQUE, example: 'MEDIO' },
    vida: { type: 'integer', example: 100 },
    dano: { type: 'integer', example: 12 },
    velocidad: { type: 'integer', example: 6 },
    propietarioId: { type: 'string', format: 'uuid', description: 'Id del usuario dueño del tanque.' },
  },
  required: ['id', 'nombre', 'tipo', 'vida', 'dano', 'velocidad', 'propietarioId'],
}

const partida = {
  type: 'object',
  description: 'Partida jugada tal como viaja por HTTP (`PartidaDTO`).',
  properties: {
    id: { type: 'string', format: 'uuid', example: 'de30e063-acce-4316-9850-eaf0196148d1' },
    resultado: { type: 'string', enum: RESULTADOS_PARTIDA, example: 'VICTORIA' },
    puntaje: { type: 'integer', minimum: 0, example: 100 },
    duracionSegundos: { type: 'integer', minimum: 1, example: 300 },
    jugadorId: { type: 'string', format: 'uuid', description: 'Id del usuario que jugó la partida.' },
  },
  required: ['id', 'resultado', 'puntaje', 'duracionSegundos', 'jugadorId'],
}

const error = {
  type: 'object',
  properties: { error: { type: 'string', example: 'Correo o clave incorrectos' } },
  required: ['error'],
}

const respuestaError = (description: string, ejemplo: string) => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorDTO' }, example: { error: ejemplo } } },
})

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'TankGame · API',
    version: '1.0.0',
    description: [
      'API del backend del proyecto TankGame (Migración Java → Node.js).',
      '',
      '### Funciones existentes conservadas:',
      '- **Monitoreo y Salud del Servicio**: Endpoint de comprobación de estado (`GET /api/salud`).',
      '- **Gestión de Usuarios y Autenticación**: Registro de jugadores (`POST /api/auth/registro`), inicio de sesión con JWT (`POST /api/auth/login`) y consulta de perfil (`GET /api/auth/perfil`).',
      '- **Gestión de Tanques**: Creación y asignación de atributos según tipo de vehículo (`POST /api/tanques`) y consulta por propietario (`GET /api/tanques`).',
      '- **Registro de Partidas**: Persistencia de victorias/derrotas/empates, puntajes y duración (`POST /api/partidas`) e historial del jugador (`GET /api/partidas`).',
      '',
      '**Cómo probar desde aquí**: registra un usuario en `POST /api/auth/registro`, copia el `id` de la',
      'respuesta, y úsalo como `propietarioId` / `jugadorId` en los endpoints de Tanques y Partidas.',
      '',
      'Todas las rutas cuelgan del prefijo `/api`.',
    ].join('\n'),
    license: { name: 'MIT' },
  },
  servers: [{ url: '/api', description: 'Servidor actual' }],
  // Por defecto las rutas son públicas; solo las que declaran `security` exigen token.
  security: [],
  tags: [
    { name: 'Salud', description: 'Verificación de que el servicio responde.' },
    { name: 'Autenticación', description: 'Registro de usuarios, inicio de sesión y consulta del perfil propio.' },
    { name: 'Tanques', description: 'Tanques que posee cada jugador.' },
    { name: 'Partidas', description: 'Registro de partidas jugadas.' },
  ],
  paths: {
    '/salud': {
      get: {
        tags: ['Salud'],
        summary: 'Verificar que el servicio está vivo',
        description:
          'Responde 200 si el proceso atiende peticiones. No consulta la base de datos: sirve para el ' +
          'monitoreo y para el healthcheck del despliegue, no para diagnosticar la persistencia.',
        responses: {
          200: {
            description: 'El servicio responde.',
            content: { 'application/json': { example: { estado: 'ok' } } },
          },
        },
      },
    },

    '/auth/registro': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un usuario',
        description: [
          'Crea un usuario y devuelve sus datos públicos. **No inicia sesión**: para obtener un token hay',
          'que llamar después a `/auth/login`.',
          '',
          'Reglas que aplica el caso de uso `RegistrarUsuario`:',
          '',
          '- El correo se normaliza a minúsculas y se guarda sin espacios, de modo que `ANA@uam.edu.co` y',
          '  `ana@uam.edu.co` son el mismo usuario.',
          '- El correo es único; un segundo registro con el mismo correo responde 409.',
          '- La clave nunca se almacena en claro: se cifra con bcrypt antes de llegar al repositorio.',
          '- `rol` es opcional y por defecto es `SOLICITANTE`.',
        ].join('\n'),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', minLength: 2, description: 'Nombre completo.', example: 'Ana Agente' },
                  correo: {
                    type: 'string',
                    format: 'email',
                    description: 'Correo. Se normaliza a minúsculas.',
                    example: 'ana@uam.edu.co',
                  },
                  clave: { type: 'string', minLength: 8, format: 'password', example: 'clave-segura' },
                  rol: {
                    type: 'string',
                    enum: ROLES,
                    default: 'SOLICITANTE',
                    example: 'AGENTE',
                  },
                },
                required: ['nombre', 'correo', 'clave'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario creado.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioDTO' } } },
          },
          400: respuestaError(
            'Datos inválidos: nombre de menos de 2 caracteres, correo mal formado, clave de menos de 8 caracteres o rol desconocido.',
            'clave requerida (mínimo 8 caracteres)',
          ),
          409: respuestaError('Ya existe un usuario con ese correo.', 'El correo ana@uam.edu.co ya está registrado'),
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        description: [
          'Valida las credenciales y devuelve un **JWT firmado (HS256, vigencia 8 horas)** que lleva el id',
          'del usuario en `sub` y su rol en `rol`. Ese token es el que autoriza las rutas protegidas.',
        ].join('\n'),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  correo: { type: 'string', format: 'email', example: 'ana@uam.edu.co' },
                  clave: { type: 'string', format: 'password', example: 'clave-segura' },
                },
                required: ['correo', 'clave'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Sesión iniciada.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SesionDTO' } } },
          },
          400: respuestaError('Falta `correo` o `clave` en el cuerpo.', 'correo y clave son obligatorios'),
          401: respuestaError('Credenciales inválidas o usuario inactivo.', 'Correo o clave incorrectos'),
        },
      },
    },

    '/auth/perfil': {
      get: {
        tags: ['Autenticación'],
        summary: 'Consultar el usuario de la sesión actual',
        description: 'Devuelve el usuario dueño del token enviado.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Usuario en sesión.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioDTO' } } },
          },
          401: respuestaError('Token ausente, mal formado, expirado o con firma inválida.', 'Sesión requerida'),
          404: respuestaError('El token es válido pero el usuario ya no existe.', 'Usuario no encontrado'),
        },
      },
    },

    '/tanques': {
      post: {
        tags: ['Tanques'],
        summary: 'Crear un tanque',
        description: [
          'Crea un tanque para un jugador existente. El caso de uso `CrearTanque` valida primero que el',
          '`propietarioId` corresponda a un usuario real, y según el `tipo` calcula automáticamente',
          '`vida`, `dano` y `velocidad` (no se envían en el cuerpo, los decide el servidor).',
        ].join('\n'),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', minLength: 2, example: 'Rex' },
                  tipo: { type: 'string', enum: TIPOS_TANQUE, example: 'MEDIO' },
                  propietarioId: { type: 'string', format: 'uuid' },
                },
                required: ['nombre', 'tipo', 'propietarioId'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Tanque creado.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TanqueDTO' } } },
          },
          400: respuestaError('Datos inválidos.', 'tipo inválido (LIGERO | MEDIO | PESADO)'),
          404: respuestaError('El propietarioId no corresponde a un usuario existente.', 'No existe un usuario con id ...'),
        },
      },
      get: {
        tags: ['Tanques'],
        summary: 'Listar los tanques de un jugador',
        parameters: [
          {
            name: 'propietarioId',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Id del usuario dueño de los tanques.',
          },
        ],
        responses: {
          200: {
            description: 'Lista de tanques del jugador (puede estar vacía).',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TanqueDTO' } } } },
          },
          400: respuestaError('Falta el query param propietarioId.', 'propietarioId requerido como query param'),
        },
      },
    },

    '/partidas': {
      post: {
        tags: ['Partidas'],
        summary: 'Registrar una partida jugada',
        description:
          'Registra el resultado de una partida para un jugador existente. El caso de uso ' +
          '`RegistrarPartida` valida primero que el `jugadorId` corresponda a un usuario real.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  resultado: { type: 'string', enum: RESULTADOS_PARTIDA, example: 'VICTORIA' },
                  puntaje: { type: 'integer', minimum: 0, example: 100 },
                  duracionSegundos: { type: 'integer', minimum: 1, example: 300 },
                  jugadorId: { type: 'string', format: 'uuid' },
                },
                required: ['resultado', 'puntaje', 'duracionSegundos', 'jugadorId'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Partida registrada.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PartidaDTO' } } },
          },
          400: respuestaError('Datos inválidos.', 'resultado inválido (VICTORIA | DERROTA | EMPATE)'),
          404: respuestaError('El jugadorId no corresponde a un usuario existente.', 'No existe un usuario con id ...'),
        },
      },
      get: {
        tags: ['Partidas'],
        summary: 'Listar las partidas de un jugador',
        parameters: [
          {
            name: 'jugadorId',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Id del usuario que jugó las partidas.',
          },
        ],
        responses: {
          200: {
            description: 'Lista de partidas del jugador, más reciente primero (puede estar vacía).',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PartidaDTO' } } } },
          },
          400: respuestaError('Falta el query param jugadorId.', 'jugadorId requerido como query param'),
        },
      },
    },
  },
  components: {
    schemas: { UsuarioDTO: usuario, SesionDTO: sesion, TanqueDTO: tanque, PartidaDTO: partida, ErrorDTO: error },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtenido en `POST /api/auth/login`.',
      },
    },
  },
}