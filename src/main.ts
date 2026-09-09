// Raíz de composición: el único archivo que puede importarlo todo y hacer `new`
// de implementaciones concretas.
import { RegistrarUsuario } from './aplicacion/casos-uso/RegistrarUsuario'
import { IniciarSesion } from './aplicacion/casos-uso/IniciarSesion'
import { CrearTanque } from './aplicacion/casos-uso/CrearTanque'
import { ListarTanquesDeJugador } from './aplicacion/casos-uso/ListarTanquesDeJugador'
import { RegistrarPartida } from './aplicacion/casos-uso/RegistrarPartida'
import { ListarPartidasDeJugador } from './aplicacion/casos-uso/ListarPartidasDeJugador'
import { prisma } from './infraestructura/persistencia/prisma'
import { UsuarioDAOPrisma } from './infraestructura/persistencia/UsuarioDAOPrisma'
import { TanqueDAOPrisma } from './infraestructura/persistencia/TanqueDAOPrisma'
import { PartidaDAOPrisma } from './infraestructura/persistencia/PartidaDAOPrisma'
import { ClavesBcrypt } from './infraestructura/seguridad/ClavesBcrypt'
import { TokensJwt } from './infraestructura/seguridad/TokensJwt'
import { crearServidor } from './infraestructura/http/servidor'

const secreto = process.env['JWT_SECRET']
if (!secreto) throw new Error('Falta JWT_SECRET (copia .env.example a .env)')

const usuarios = new UsuarioDAOPrisma(prisma)
const tanques = new TanqueDAOPrisma(prisma)
const partidas = new PartidaDAOPrisma(prisma)
const claves = new ClavesBcrypt()
const tokens = new TokensJwt(secreto)

const app = crearServidor({
  usuarios,
  tokens,
  registrarUsuario: new RegistrarUsuario(usuarios, claves),
  iniciarSesion: new IniciarSesion(usuarios, claves, tokens),
  crearTanque: new CrearTanque(tanques, usuarios),
  listarTanquesDeJugador: new ListarTanquesDeJugador(tanques),
  registrarPartida: new RegistrarPartida(partidas, usuarios),
  listarPartidasDeJugador: new ListarPartidasDeJugador(partidas),
})

const puerto = Number(process.env['PORT'] ?? 3000)
app.listen(puerto, () => console.log(`TankGame backend escuchando en http://localhost:${puerto}/api · docs en /api/docs`))