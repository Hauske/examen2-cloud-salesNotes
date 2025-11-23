import { $Enums } from "@prisma/client";

export interface ISaleNote {
    id: string;
    folio: string;
    clienteId: string;
    domicilioId: string;
    total: number;
    cliente: {
        id: string;
        razonSocial: $Enums.TipoSociedad;
        nombreComercial: string;
        rfc: string;
        correoElectronico: string;
        telefono: string;
    };
    contenidos: IContent[];
}

export interface IContent {
    id: string;
    productoId: string;
    notaVentaId: string;
    cantidad: number;
    precioUnitario: number;
    importe: number;
    producto: {
        id: string;
        nombre: string;
        unidadMedida: $Enums.UnidadMedia;
        precioBase: number;
    };
}