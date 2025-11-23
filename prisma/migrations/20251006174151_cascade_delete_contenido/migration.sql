-- DropForeignKey
ALTER TABLE "public"."ContenidoNotaVenta" DROP CONSTRAINT "ContenidoNotaVenta_notaVentaId_fkey";

-- AddForeignKey
ALTER TABLE "ContenidoNotaVenta" ADD CONSTRAINT "ContenidoNotaVenta_notaVentaId_fkey" FOREIGN KEY ("notaVentaId") REFERENCES "NotaVenta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
