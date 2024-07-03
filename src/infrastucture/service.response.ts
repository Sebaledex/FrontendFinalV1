export interface ServiceResponse {
    //fotos: string[];
    _id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    contacto: string;
    fotos?: string[];
    rating: number;
    horariosDisponibles: string[];
    contadorSolicitudes: number;
}
