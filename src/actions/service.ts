import { serviceAxiosApi } from "../config/api/serviceAxiosApi";
import { Service } from "../domain/entities/service.entity";
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

  export const serviceCreate = async (access_token: string, service: Service, userId: string) => {
    try {
      const { data } = await serviceAxiosApi.post<ServiceResponse>(`/v2/service/${userId}`, service, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data;
    } catch (error) {
      console.error('Error creating service:', error);
      return null;
    }
  };

  
  export const serviceDelete = async (access_token: string, serviceId: string) => {
    try {
      const { data } = await serviceAxiosApi.delete<{ status: number; msg: string }>(`/v2/service/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data;
    } catch (error) {
      console.error('Error deleting service:', error);
      return null;
    }
  };
  
  export const serviceGetByUser = async (access_token: string, userId: string) => {
    try {
      const { data } = await serviceAxiosApi.get<ServiceResponse[]>(`/v2/service/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data;
    } catch (error) {
      console.error('Error fetching services by user:', error);
      return null;
    }
  };

  export const serviceUpdate = async (access_token: string, serviceId: string, service: Service) => {
    try {
        const { data } = await serviceAxiosApi.put<ServiceResponse>(`/v2/service/${serviceId}`, service, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        return data;
    } catch (error) {
        console.error('Error updating service:', error);
        return null;
    }
};