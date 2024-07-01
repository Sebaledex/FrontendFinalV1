import { serviceAxiosApi } from "../config/api/serviceAxiosApi";
import { ServiceResponse } from "../infrastucture/service.response";

const returnServiceToken = ( data: ServiceResponse ) => {

    return {
        id: data._id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        contacto: data.contacto
  }
  }
  
  export const serviceGetAll = async (access_token:string) => {
    try {
      console.log(`buscando todos los servicios`);
      const { data } = await serviceAxiosApi.get<ServiceResponse[]>('/v2/service', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data} 
      catch (error) {
      console.error('Error geting register:', error);
      return null;
    }
  };