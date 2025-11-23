/*
  Warnings:

  - You are about to drop the column `direccionEnvioId` on the `NotaVenta` table. All the data in the column will be lost.
  - You are about to drop the column `direccionFacturacionId` on the `NotaVenta` table. All the data in the column will be lost.
  - Added the required column `domicilioId` to the `NotaVenta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."NotaVenta" DROP CONSTRAINT "NotaVenta_direccionEnvioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NotaVenta" DROP CONSTRAINT "NotaVenta_direccionFacturacionId_fkey";

-- AlterTable
ALTER TABLE "NotaVenta" DROP COLUMN "direccionEnvioId",
DROP COLUMN "direccionFacturacionId",
ADD COLUMN     "domicilioId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NotaVenta" ADD CONSTRAINT "NotaVenta_domicilioId_fkey" FOREIGN KEY ("domicilioId") REFERENCES "Domicilio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
