
import { ROLES } from '../../dominio/modelo/Usuario'
import { TIPOS_TANQUE } from '../../dominio/modelo/Tanque'
import { RESULTADOS_PARTIDA } from '../../dominio/modelo/Partida'

const usuario = {
  type: 'object',
  description:
      'Usuario del sistema tal como viaja por HTTP (UsuarioDTO). No incluye el hash de la clave.',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: 'cd9c06cf-b57f-4e22-bc47-589a074e8c2c',
    },
    nombre: { type: 'string', example: 'Ana Agente' },
    correo: { type: 'string', format: 'email', example: 'ana@uam.edu.co' },
    rol: { type: 'string', enum: ROLES, example: 'AGENTE' },
    activo: { type: 'boolean', example: true },
  },
  required: ['id', 'nombre', 'correo', 'rol', 'activo'],
}

const usuarioPublico = {
  type: 'object',
  description:
      'Datos públicos de un usuario (UsuarioPublicoDTO), sin correo ni clave.',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: 'cd9c06cf-b57f-4e22-bc47-589a074e8c2c',
    },
    nombre: { type: 'string', example: 'Ana Agente' },
    rol: { type: 'string', enum: ROLES, example: 'AGENTE' },
    activo: { type: 'boolean', example: true },
  },
  required: ['id', 'nombre', 'rol', 'activo'],
}

const sesion = {
  type: 'object',
  description: 'Resultado del inicio de sesión.',
  properties: {
    token: {
      type: 'string',
      description: 'JWT para Authorization: Bearer <token>.',
    },
    usuario: { $ref: '#/components/schemas/UsuarioDTO' },
  },
  required: ['token', 'usuario'],
}

const tanque = {
  type: 'object',
  description: 'Tanque del sistema tal como viaja por HTTP (TanqueDTO).',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: 'd9b39201-89aa-4c1b-99e3-f25b64e9841c',
    },
    nombre: { type: 'string', example: 'Rex' },
    tipo: { type: 'string', enum: TIPOS_TANQUE, example: 'MEDIO' },
    vida: { type: 'integer', example: 100 },
    dano: { type: 'integer', example: 12 },
    velocidad: { type: 'integer', example: 6 },
    propietarioId: {
      type: 'string',
      format: 'uuid',
      description: 'Identificador del usuario dueño del tanque.',
    },
    activo: { type: 'boolean', example: true },
  },
  required: [
    'id',
    'nombre',
    'tipo',
    'vida',
    'dano',
    'velocidad',
    'propietarioId',
    'activo',
  ],
}

const partida = {
  type: 'object',
  description: 'Partida jugada tal como viaja por HTTP (PartidaDTO).',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: 'de30e063-acce-4316-9850-eaf0196148d1',
    },
    resultado: {
      type: 'string',
      enum: RESULTADOS_PARTIDA,
      example: 'VICTORIA',
    },
    puntaje: { type: 'integer', minimum: 0, example: 100 },
    duracionSegundos: { type: 'integer', minimum: 1, example: 300 },
    jugadorId: {
      type: 'string',
      format: 'uuid',
      description: 'Identificador del usuario que jugó la partida.',
    },
  },
  required: [
    'id',
    'resultado',
    'puntaje',
    'duracionSegundos',
    'jugadorId',
  ],
}

const error = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      example: 'Correo o clave incorrectos',
    },
  },
  required: ['error'],
}

const respuestaError = (description: string, ejemplo: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorDTO' },
      example: { error: ejemplo },
    },
  },
})

/**
 * Todas las rutas se publican bajo /api.
 * El prefijo se agrega una sola vez para evitar duplicar /api.
 */
const PREFIJO_API = '/api'

const conPrefijoApi = (rutas: object) =>
    Object.fromEntries(
        Object.entries(rutas).map(([ruta, definicion]) => [
          PREFIJO_API + ruta,
          definicion,
        ]),
    )

export const openapi = {
  openapi: '3.0.3',

  info: {
    title: 'TankGame · API',
    version: '1.0.0',
    description: [
      'API del backend del proyecto TankGame (Migración Java → Node.js).',
      '',
      '### Funciones existentes conservadas:',
      '- **Monitoreo y salud:** comprobación del estado del servicio mediante GET /api/salud.',
      '- **Gestión de usuarios y autenticación:** registro, inicio de sesión mediante JWT y consulta del perfil.',
      '- **Gestión de usuarios:** consulta de datos públicos y activación o desactivación lógica de cuentas.',
      '- **Gestión de tanques:** creación, consulta, listado, desactivación lógica, recepción de daño y renombrado de tanques.',
      '- **Registro de partidas:** persistencia de resultados, puntajes y duración, y consulta del historial de un jugador.',
      '',
      '### Requisitos funcionales - Partida multijugador (ACT-008):',
      '- **RF-M01 (Creación de sala multijugador):** un usuario autenticado puede crear una sala de partida en espera, asignándole un código o identificador único.',
      '- **RF-M02 (Unirse a una partida):** cualquier jugador autenticado puede unirse a una sala en espera mediante su identificador mientras la sala no haya iniciado.',
      '- **RF-M03 (Capacidad de jugadores):** una sala multijugador requiere un mínimo de 2 jugadores para iniciar y permite un máximo de 4 jugadores por sala.',
      '- **RF-M04 (Validación de cupo):** si la sala alcanza los 4 jugadores, no se permitirán nuevos ingresos. Si hay menos de 2 jugadores al intentar iniciar, se bloquea el inicio.',
      '- **RF-M05 (Asignación de tanques):** cada jugador que se une a una partida multijugador debe seleccionar o tener asignado un tanque previamente registrado.',
      '',
      'Para probar los endpoints, registra un usuario mediante POST /api/auth/registro.',
      'Después inicia sesión mediante POST /api/auth/login para obtener un JWT.',
      'El token es obligatorio para las operaciones que declaran seguridad bearerAuth.',
      '',
      'Todas las rutas se publican bajo el prefijo /api.',
    ].join('\n'),
    license: { name: 'MIT' },
  },

  servers: [{ url: '/', description: 'Servidor actual' }],

  security: [],

  tags: [
    {
      name: 'Salud',
      description: 'Verificación de que el servicio responde.',
    },
    {
      name: 'Autenticación',
      description:
          'Registro de usuarios, inicio de sesión y consulta del perfil propio.',
    },
    {
      name: 'Usuarios',
      description:
          'Consulta de usuarios y gestión del estado de las cuentas.',
    },
    {
      name: 'Tanques',
      description:
          'Creación, consulta, desactivación, recepción de daño y renombrado de tanques.',
    },
    {
      name: 'Partidas',
      description:
          'Registro de partidas e historial de resultados.',
    },
  ],

  paths: conPrefijoApi({
    '/salud': {
      get: {
        tags: ['Salud'],
        summary: 'Verificar que el servicio está disponible',
        description:
            'Responde cuando el servidor atiende peticiones. No verifica la conexión con la base de datos.',
        responses: {
          200: {
            description: 'El servicio responde.',
            content: {
              'application/json': {
                example: { estado: 'ok' },
              },
            },
          },
        },
      },
    },

    '/auth/registro': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un usuario',
        description:
            'Crea un usuario. No inicia sesión automáticamente; debe llamarse después a /auth/login.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: {
                    type: 'string',
                    minLength: 2,
                    example: 'Ana Agente',
                  },
                  correo: {
                    type: 'string',
                    format: 'email',
                    example: 'ana@uam.edu.co',
                  },
                  clave: {
                    type: 'string',
                    minLength: 8,
                    format: 'password',
                    example: 'clave-segura',
                  },
                  rol: {
                    type: 'string',
                    enum: ROLES,
                    default: 'SOLICITANTE',
                    example: 'SOLICITANTE',
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
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UsuarioDTO' },
              },
            },
          },
          400: respuestaError(
              'Los datos enviados no cumplen las validaciones.',
              'clave requerida (mínimo 8 caracteres)',
          ),
          409: respuestaError(
              'Ya existe un usuario con ese correo.',
              'El correo ya está registrado',
          ),
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        description:
            'Valida las credenciales y devuelve un JWT para las operaciones protegidas.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  correo: {
                    type: 'string',
                    format: 'email',
                    example: 'ana@uam.edu.co',
                  },
                  clave: {
                    type: 'string',
                    format: 'password',
                    example: 'clave-segura',
                  },
                },
                required: ['correo', 'clave'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Sesión iniciada.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SesionDTO' },
              },
            },
          },
          400: respuestaError(
              'Falta correo o clave en el cuerpo.',
              'correo y clave son obligatorios',
          ),
          401: respuestaError(
              'Las credenciales no son válidas.',
              'Correo o clave incorrectos',
          ),
        },
      },
    },

    '/auth/perfil': {
      get: {
        tags: ['Autenticación'],
        summary: 'Consultar el usuario de la sesión actual',
        description:
            'Devuelve los datos del usuario identificado por el JWT.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Usuario en sesión.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UsuarioDTO' },
              },
            },
          },
          401: respuestaError(
              'El token está ausente o no es válido.',
              'Sesión requerida',
          ),
          404: respuestaError(
              'El usuario del token ya no existe.',
              'Usuario no encontrado',
          ),
        },
      },
    },

    '/usuarios/{usuarioId}': {
      get: {
        tags: ['Usuarios'],
        summary: 'Consultar un usuario por su ID',
        description:
            'Devuelve los datos públicos del usuario (id, nombre, rol y estado), sin correo ni clave. Requiere sesión.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'usuarioId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID del usuario que se quiere consultar.',
          },
        ],
        responses: {
          200: {
            description: 'Datos públicos del usuario.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsuarioPublicoDTO',
                },
              },
            },
          },
          401: respuestaError(
              'Token ausente, mal formado, expirado o con firma inválida.',
              'Sesión requerida',
          ),
          404: respuestaError(
              'El usuario no existe.',
              'No existe un usuario con id ...',
          ),
        },
      },
    },

    '/usuarios/{usuarioId}/estado': {
      patch: {
        tags: ['Usuarios'],
        summary: 'Activar o desactivar una cuenta',
        description: [
          'Cambia el campo `activo` de un usuario. No borra la fila: se conservan sus tanques y partidas.',
          'Una cuenta desactivada no puede iniciar sesión.',
          '',
          'Reglas del caso de uso CambiarEstadoUsuario:',
          '- Requiere sesión.',
          '- Solo el propio usuario o un ADMINISTRADOR pueden cambiar el estado.',
          '- Si el usuario no existe, responde 404.',
        ].join('\n'),
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'usuarioId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description:
                'ID del usuario cuya cuenta se activa o desactiva.',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  activo: {
                    type: 'boolean',
                    example: false,
                    description: '`false` desactiva, `true` reactiva.',
                  },
                },
                required: ['activo'],
              },
            },
          },
        },
        responses: {
          200: {
            description:
                'Cuenta actualizada; devuelve el usuario con su nuevo estado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UsuarioDTO' },
              },
            },
          },
          400: respuestaError(
              'Falta `activo` o no es booleano.',
              'activo requerido (true | false)',
          ),
          401: respuestaError(
              'Token ausente, mal formado, expirado o con firma inválida.',
              'Sesión requerida',
          ),
          403: respuestaError(
              'El solicitante no es el dueño de la cuenta ni administrador.',
              'Solo el propio usuario o un administrador pueden cambiar el estado de una cuenta',
          ),
          404: respuestaError(
              'El usuario no existe.',
              'No existe un usuario con id ...',
          ),
        },
      },
    },

    '/tanques': {
      post: {
        tags: ['Tanques'],
        summary: 'Crear un tanque',
        description:
            'Crea un tanque para un usuario existente. El servidor calcula vida, daño y velocidad según el tipo.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: {
                    type: 'string',
                    minLength: 2,
                    example: 'Rex',
                  },
                  tipo: {
                    type: 'string',
                    enum: TIPOS_TANQUE,
                    example: 'MEDIO',
                  },
                  propietarioId: {
                    type: 'string',
                    format: 'uuid',
                  },
                },
                required: ['nombre', 'tipo', 'propietarioId'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Tanque creado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TanqueDTO' },
              },
            },
          },
          400: respuestaError(
              'Los datos del tanque no son válidos.',
              'tipo inválido (LIGERO | MEDIO | PESADO)',
          ),
          404: respuestaError(
              'El propietario no existe.',
              'No existe un usuario con ese id',
          ),
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
            description: 'Identificador del usuario dueño de los tanques.',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: {
            description: 'Lista de tanques del jugador.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TanqueDTO' },
                },
              },
            },
          },
          400: respuestaError(
              'Falta el parámetro propietarioId.',
              'propietarioId requerido como query param',
          ),
        },
      },
    },

    '/tanques/{tanqueId}': {
      get: {
        tags: ['Tanques'],
        summary: 'Consultar un tanque por su ID',
        description:
            'Obtiene la información detallada de un tanque específico.',
        parameters: [
          {
            name: 'tanqueId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID del tanque a consultar.',
          },
        ],
        responses: {
          200: {
            description: 'Detalles del tanque.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TanqueDTO' },
              },
            },
          },
          404: respuestaError(
              'No existe ningún tanque activo con el ID especificado.',
              'No existe un tanque con id ...',
          ),
        },
      },

      delete: {
        tags: ['Tanques'],
        summary: 'Eliminar un tanque lógicamente',
        description:
            'Desactiva un tanque (activo: false) para que deje de estar disponible en las consultas y listados.',
        parameters: [
          {
            name: 'tanqueId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID del tanque a eliminar.',
          },
        ],
        responses: {
          204: { description: 'Tanque desactivado con éxito.' },
          404: respuestaError(
              'No existe ningún tanque activo con el ID especificado.',
              'No existe un tanque con id ...',
          ),
        },
      },
    },

    '/tanques/{tanqueId}/nombre': {
      patch: {
        tags: ['Tanques'],
        summary: 'Renombrar un tanque propio',
        description: [
          'Actualiza el nombre de un tanque perteneciente al usuario autenticado.',
          'El propietario se obtiene del JWT y no del cuerpo de la solicitud.',
          'El nombre se elimina de espacios al principio y al final y debe tener al menos dos caracteres.',
        ].join('\n'),
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'tanqueId',
            in: 'path',
            required: true,
            description:
                'Identificador UUID del tanque que se quiere renombrar.',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: {
                    type: 'string',
                    minLength: 2,
                    example: 'Destructor',
                    description: 'Nuevo nombre del tanque.',
                  },
                },
                required: ['nombre'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Nombre del tanque actualizado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TanqueDTO' },
              },
            },
          },
          400: respuestaError(
              'El identificador o el nombre no son válidos.',
              'nombre requerido (mínimo 2 caracteres)',
          ),
          401: respuestaError(
              'Falta un token válido.',
              'Sesión requerida',
          ),
          403: respuestaError(
              'El tanque pertenece a otro usuario.',
              'El tanque no pertenece al jugador autenticado',
          ),
          404: respuestaError(
              'No existe un tanque con ese identificador.',
              'No existe un tanque con id ...',
          ),
        },
      },
    },

    '/tanques/{tanqueId}/recibir-dano': {
      post: {
        tags: ['Tanques'],
        summary: 'Aplicar daño recibido a un tanque',
        description:
            'Resta danoRecibido a la vida del tanque. La vida no baja de 0 y un tanque con vida 0 queda eliminado (vivo: false). Requiere sesión.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'tanqueId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID del tanque que recibe el daño.',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  danoRecibido: {
                    type: 'number',
                    minimum: 0,
                    example: 30,
                    description: 'Puntos de vida a restar.',
                  },
                },
                required: ['danoRecibido'],
              },
            },
          },
        },
        responses: {
          200: {
            description:
                'Tanque con su vida actualizada y si sigue vivo.',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/TanqueDTO' },
                    {
                      type: 'object',
                      properties: {
                        vivo: { type: 'boolean', example: true },
                      },
                      required: ['vivo'],
                    },
                  ],
                },
              },
            },
          },
          400: respuestaError(
              'Falta danoRecibido o no es un número mayor o igual a 0.',
              'danoRecibido inválido',
          ),
          401: respuestaError(
              'Token ausente, mal formado, expirado o con firma inválida.',
              'Sesión requerida',
          ),
          404: respuestaError(
              'El tanque no existe.',
              'No existe un tanque con id ...',
          ),
        },
      },
    },

    '/partidas': {
      post: {
        tags: ['Partidas'],
        summary: 'Registrar una partida jugada',
        description:
            'Registra el resultado de una partida para un jugador existente.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  resultado: {
                    type: 'string',
                    enum: RESULTADOS_PARTIDA,
                    example: 'VICTORIA',
                  },
                  puntaje: {
                    type: 'integer',
                    minimum: 0,
                    example: 100,
                  },
                  duracionSegundos: {
                    type: 'integer',
                    minimum: 1,
                    example: 300,
                  },
                  jugadorId: {
                    type: 'string',
                    format: 'uuid',
                  },
                },
                required: [
                  'resultado',
                  'puntaje',
                  'duracionSegundos',
                  'jugadorId',
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Partida registrada.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PartidaDTO' },
              },
            },
          },
          400: respuestaError(
              'Los datos de la partida no son válidos.',
              'resultado inválido (VICTORIA | DERROTA | EMPATE)',
          ),
          404: respuestaError(
              'El jugador no existe.',
              'No existe un usuario con ese id',
          ),
        },
      },

      get: {
        tags: ['Partidas'],
        summary: 'Listar las partidas de un jugador',
        description:
            'Devuelve las partidas del jugador, ordenadas de más reciente a más antigua.',
        parameters: [
          {
            name: 'jugadorId',
            in: 'query',
            required: true,
            description:
                'Identificador del usuario que jugó las partidas.',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: {
            description: 'Lista de partidas del jugador.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PartidaDTO' },
                },
              },
            },
          },
          400: respuestaError(
              'Falta el parámetro jugadorId.',
              'jugadorId requerido como query param',
          ),
        },
      },
    },
  }),

  components: {
    schemas: {
      UsuarioDTO: usuario,
      UsuarioPublicoDTO: usuarioPublico,
      SesionDTO: sesion,
      TanqueDTO: tanque,
      PartidaDTO: partida,
      ErrorDTO: error,
    },

    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtenido en POST /api/auth/login.',
      },
    },
  },
}