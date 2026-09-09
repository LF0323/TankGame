-- CreateEnum
CREATE TYPE "TipoTanque" AS ENUM ('LIGERO', 'MEDIO', 'PESADO');

-- CreateEnum
CREATE TYPE "ResultadoPartida" AS ENUM ('VICTORIA', 'DERROTA', 'EMPATE');

-- CreateTable
CREATE TABLE "Tanque" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoTanque" NOT NULL DEFAULT 'MEDIO',
    "vida" INTEGER NOT NULL DEFAULT 100,
    "dano" INTEGER NOT NULL DEFAULT 10,
    "velocidad" INTEGER NOT NULL DEFAULT 5,
    "propietarioId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tanque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" TEXT NOT NULL,
    "resultado" "ResultadoPartida" NOT NULL,
    "puntaje" INTEGER NOT NULL DEFAULT 0,
    "duracionSegundos" INTEGER NOT NULL,
    "jugadorId" TEXT NOT NULL,
    "jugadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tanque" ADD CONSTRAINT "Tanque_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
