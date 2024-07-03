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

  export const serviceGetAvailableHours = async (access_token: string, serviceId: string, date: Date) => {
    try {
      console.log(`buscando horarios disponibles`);
      const { data } = await serviceAxiosApi.get<string[]>(`/v2/service/${serviceId}/horarios-disponibles/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data;
    } catch (error) {
      console.error('Error getting available hours:', error);
      return [];
    }
  };

  export const serviceGetById = async (access_token: string, userId: string) => {
    try {
      console.log(`buscando servicios por usuario`);
      const { data } = await serviceAxiosApi.get<ServiceResponse[]>(`/v2/service/${userId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data;
    } catch (error) {
      console.error('Error getting services by user:', error);
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
      const { data } = await serviceAxiosApi.get<ServiceResponse[]>(`/v2/service/service/${userId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return data;
      console.log(data);
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

export const ServicetotalSales = async (access_token: string, serviceId: string) => {
  try {
    const { data } = await serviceAxiosApi.get<number>(`/v2/service/reports/total-sales/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log("datos",data);
    return data;
  } catch (error) {
    console.error('Error fetching total sales:', error);
    return null;
  }
};

export const serviceMonthlySales = async (access_token: string,serviceId:string) => {
  try {
    const { data } = await serviceAxiosApi.get<{ month: number; total: number }[]>(`/v2/service/reports/monthly-sales/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log("datos",data);
    return data;
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return null;
  }
};

export const serviceAnnualSales = async (access_token: string,serviceId:string) => {
  try {
    const { data } = await serviceAxiosApi.get<{ year: number; total: number }[]>(`/v2/service/reports/annual-sales/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log("datos",data);
    return data;
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return null;
  }
};

export const serviceTopServices = async (access_token: string,userId:string) => {
  try {
    const { data } = await serviceAxiosApi.get<ServiceResponse[]>(`/v2/service/reports/top-services/${userId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log("datos",data);
    return data;
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return null;
  }
};

export const serviceTopServicesAll= async (access_token: string) => {
  try {
    const { data } = await serviceAxiosApi.get<ServiceResponse[]>(`/v2/service/top/requested`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return null;
  }
};

export const serviceGetByServiceId = async (access_token: string, serviceId: string) => {
  try {
    const { data } = await serviceAxiosApi.get<ServiceResponse>(`/v2/service/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log("datos del servicio por ID",data);
    return data;
  } catch (error) {
    console.error('Error fetching service by id:', error);
    return null;
  }
};

export const servicereviewService = async (access_token: string, serviceId: string,userId:string, rating:number,comentario:string,fecha:Date) => {
  try {
    const { data } = await serviceAxiosApi.post<ServiceResponse>(`/v2/service/${serviceId}/reviews/${userId}`,{
      rating,
      comentario,
      fecha
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log("datos del servicio por ID",data);
    return data;
  } catch (error) {
    console.error('Error fetching service by id:', error);
    return null;
  }
};
