import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ISaleNote, IContent } from "../interfaces/ISaleNote";

export function generatePDF(notaVenta: ISaleNote): Buffer {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Información del Cliente", 10, 10);
  doc.setFontSize(11);
  doc.text(`Razón Social: ${notaVenta.cliente.razonSocial}`, 10, 20);
  doc.text(`Nombre Comercial: ${notaVenta.cliente.nombreComercial}`, 10, 30);
  doc.text(`RFC: ${notaVenta.cliente.rfc}`, 10, 40);
  doc.text(`Correo: ${notaVenta.cliente.correoElectronico}`, 10, 50);
  doc.text(`Teléfono: ${notaVenta.cliente.telefono}`, 10, 60);

  doc.setFontSize(14);
  doc.text("Información de la Nota", 10, 80);
  doc.setFontSize(11);
  doc.text(`Folio: ${notaVenta.folio}`, 10, 90);

  const rows = notaVenta.contenidos.map((c: IContent) => [
    c.cantidad,
    c.producto.nombre,
    `$${c.precioUnitario.toFixed(2)}`,
    `$${c.importe.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 100,
    head: [["Cantidad", "Producto", "Precio Unitario", "Importe"]],
    body: rows,
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`TOTAL: $${notaVenta.total.toFixed(2)}`, 150, finalY);

  const pdfArrayBuffer = doc.output("arraybuffer");
  return Buffer.from(pdfArrayBuffer);
}
