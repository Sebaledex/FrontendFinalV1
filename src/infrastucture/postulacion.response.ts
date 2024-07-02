export interface PostulacionResponse {
    message: string;
    Postulacion: {
        servicioId: string;
        usuarioId: string;
        mensaje: string;
        fechaSolicitada: string;
        horarioSolicitado: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}