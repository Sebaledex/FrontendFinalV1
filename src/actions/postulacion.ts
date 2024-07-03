import { serviceAxiosApi } from "../config/api/serviceAxiosApi";
import { PostulacionResponse } from "../infrastucture/postulacion.response";
import { ServiceResponse } from "../infrastucture/service.response";

const returnPostulacionToken = ( data: PostulacionResponse ) => {

    return {
      message: data.message,
        servicioId: data.servicioId,
        usuarioId: data.usuarioId,
        mensaje: data.mensaje,
        fechaSolicitada: data.fechaSolicitada,
        horarioSolicitado: data.horarioSolicitado,
        _id: data._id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        __v: data.__v
    };
  }
  export const postulacionCreate = async (access_token:string,userId:string,serviceId:string,fechaSolicitada:Date,horarioSolicitado:string,mensaje:string) => {
    try {
        console.log(`creando postulacion`);
      const { data } = await serviceAxiosApi.post<PostulacionResponse>(`/v2/postulacion/${userId}/${serviceId}`, {
        mensaje,
        fechaSolicitada,
        horarioSolicitado
      }, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data;
    }catch (error: any) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        console.error('Error request:', error.request);
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        console.error('Error message:', error.message);
      }
      return null;
    }
  };

  export const postulacionGetByUser = async (userId:string,access_token:string) => {
    try {
      const { data } = await serviceAxiosApi.get<PostulacionResponse[]>(`/v2/postulacion/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      console.log('Postulaciones EN ACTION :', data);
      return data;
    }
    catch (error: any) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        console.error('Error request:', error.request);
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        console.error('Error message:', error.message);
      }
      return null;
    }
  };
