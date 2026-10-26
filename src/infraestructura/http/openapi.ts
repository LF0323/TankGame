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
  },
  required: [
    'id',
    'nombre',
    'tipo',
    'vida',
    'dano',
    'velocidad',
    'propietarioId',
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

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'TankGame · API',
    version: '1.0.0',
    description: [
      'API del backend del proyecto TankGame.',
      '',
      'Incluye autenticación, usuarios, tanques y partidas.',
      '',
      'Para probar los endpoints, registra un usuario mediante POST /api/auth/registro.',
      'Después inicia sesión mediante POST /api/auth/login para obtener un JWT.',
      'El token es obligatorio para las operaciones que declaran seguridad bearerAuth.',
      '',
      'Todas las rutas se publican bajo el prefijo /api.',
    ].join('\n'),
    license: { name: 'MIT' },
  },

  // El prefijo /api se configura aquí.
  // Por eso las claves de paths comienzan con /, pero no repiten /api.
  servers: [{ url: '/api', description: 'Servidor actual' }],

  // Solo las operaciones que declaran security requieren token.
  security: [],

  tags: [
    {
      name: 'Salud',
      description: 'Verificación de que el servicio responde.',
    },
    {
      name: 'Autenticación',
      description: 'Registro, inicio de sesión y consulta del perfil.',
    },
    {
      name: 'Tanques',
      description: 'Creación, consulta y renombrado de tanques.',
    },
    {
      name: 'Partidas',
      description: 'Registro y consulta de partidas jugadas.',
    },
  ],

  paths: {
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
        description: 'Devuelve los datos del usuario identificado por el JWT.',
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
            description: 'Identificador UUID del tanque que se quiere renombrar.',
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
            description: 'Identificador del usuario que jugó las partidas.',
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
  },

  components: {
    schemas: {
      UsuarioDTO: usuario,
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