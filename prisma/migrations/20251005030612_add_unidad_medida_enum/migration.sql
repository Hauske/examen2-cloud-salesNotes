/*
  Warnings:

  - Changed the type of `unidadMedida` on the `Producto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "unidadMedida",
ADD COLUMN     "unidadMedida" "UnidadMedia" NOT NULL;
