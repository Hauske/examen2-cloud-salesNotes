/*
  Warnings:

  - Changed the type of `razonSocial` on the `Cliente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoSociedad" AS ENUM ('S_EN_NC', 'S_EN_CS', 'S_DE_RL', 'SA', 'S_EN_C_POR_A', 'S_COOP', 'SAS');

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "razonSocial",
ADD COLUMN     "razonSocial" "TipoSociedad" NOT NULL;
