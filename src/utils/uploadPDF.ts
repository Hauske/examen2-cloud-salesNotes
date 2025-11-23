import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3Client";
import { generatePDF } from "../services/saleNotesPDFService";
import { ISaleNote } from "../interfaces/ISaleNote";

export async function uploadSaleNote(notaVenta: ISaleNote) {
  const pdf = generatePDF(notaVenta);

  const bucketName = process.env.BUCKET_NAME;
  const objectKey = `${notaVenta.cliente.rfc}/${notaVenta.folio}.pdf`;

  const metadata = {
    "hora-envio": new Date().toISOString(),
    "nota-descargada": "false",
    "veces-enviado": "1"
  };

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: pdf,
    ContentType: "application/pdf",
    Metadata: metadata
  });

  await s3.send(command);
}
