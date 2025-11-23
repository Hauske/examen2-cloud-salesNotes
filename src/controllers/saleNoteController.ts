import { Request, Response } from "express";
import prisma from "../prisma/client";
import { uploadSaleNote } from "../utils/uploadPDF";
import { s3 } from "../lib/s3Client";
import { GetObjectCommand, CopyObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

interface IProduct {
    productoId: string,
    cantidad: number
}

class saleNoteController {
    async getSalesNotes(req: Request, res: Response){
        try {
            const saleNotes = await prisma.notaVenta.findMany({});
            return res.json(saleNotes);
        }
        catch(e){
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error listing the Sale Notes' });
        }
    };

    async getSaleNoteById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Missing client ID." });
            }

            const saleNote = await prisma.notaVenta.findUnique({
                where: { id }
            });

            if (!saleNote) {
                return res.status(404).json({ error: "Sale Note not found." });
            }

            return res.json(saleNote);
        } 
        catch (e) {
            console.error("error:", e);
            return res.status(500).json({ error: "There was an error listing the Sale Note." });
        }
    };

    async createSaleNote(req: Request, res: Response){
        try {
            const {
                clienteId,
                domicilioId,
                contenidos,
            } = req.body;
            
            if(!clienteId || !domicilioId || !Array.isArray(contenidos) || !contenidos.length){
                return res.status(400).json({ error: "Missing fields." });
            }

            const lastNote = await prisma.notaVenta.findFirst({
                orderBy: { folio: "desc" }
            })

            let newFolio = "NV-2025-0001";
            if(lastNote){
                const number = parseInt(lastNote.folio.split("-").pop() || "0", 10);
                newFolio = `NV-2025-${String(number + 1).padStart(4, "0")}`;
            }

            const productsIds = contenidos.map((el: IProduct) => el.productoId);

            const products = await prisma.producto.findMany({
                where: { id: { in: productsIds } }
            });

            const productsWithAmount = contenidos.map((contenido: IProduct) => {
                const product = products.find((p: { id: string; }) => p.id === contenido.productoId);
                const precioUnitario = product!.precioBase;
                const cantidad = contenido.cantidad;
                const importe = precioUnitario * cantidad;

                return {
                    productoId: contenido.productoId,
                    cantidad,
                    precioUnitario,
                    importe
                };
            });

            const total = productsWithAmount.reduce((acc, item) => acc + item.importe, 0);
            
            const notaVenta = await prisma.notaVenta.create({
                data: {
                    folio: newFolio,
                    clienteId,
                    domicilioId,
                    total,
                    contenidos: {
                        createMany: {
                            data: productsWithAmount
                        }
                    }
                },
                include: {
                    cliente: true,
                    contenidos: {
                        include: {
                            producto: true
                        }
                    }
                }
            });

            await uploadSaleNote(notaVenta);

            const notificationServer = process.env.NOTIFICATION_SERVER || "localhost:4000";

            fetch(`http://${notificationServer}/notify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notaVenta)
            }).catch(err => {
                console.error("Notify service failed:", err);
            });

            return res.json(notaVenta);
        }
        catch(e) {
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error creating the Sale Note' });
        }
    };

    async deleteSaleNote(req: Request, res: Response){
        try {
            const { id } = req.params;
        
            await prisma.notaVenta.delete({
                where: { id }
            });

            return res.json('Sale note deleted sucessfully');
        }
        catch(e){
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error deleting the Sale Note' });
        }
    };

    async getPDF(req: Request, res: Response){
        const { rfc, folio } = req.params;
        const bucketName = process.env.BUCKET_NAME;
        const objectKey = `${rfc}/${folio}.pdf`;

        const head = await s3.send(new HeadObjectCommand({
            Bucket: bucketName,
            Key: objectKey
        }));

        await s3.send(new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `/${bucketName}/${objectKey}`,
            Key: objectKey,
            MetadataDirective: "REPLACE",
            Metadata: {
            "hora-envio": head.Metadata?.["hora-envio"] || new Date().toISOString(),
            "nota-descargada": "true",
            "veces-enviado": head.Metadata?.["veces-enviado"] || "1"
            },
            ContentType: "application/pdf"
        }));

        const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
        const response = await s3.send(command);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${folio}.pdf"`);

        if (response.Body) {
            (response.Body as any).pipe(res);
        } 
        else {
            res.status(404).send("Archivo no encontrado");
        }
    } 
}

export default new saleNoteController();