import { create } from "zustand";
import { User } from "../../../domain/entities/user.entity";
import { useAuthStore } from "./useAuthStore";
import { ServiceResponse } from "../../../infrastucture/service.response";
import { ServicetotalSales, serviceAnnualSales, serviceCreate, serviceDelete, serviceGetAll, serviceGetByUser, serviceMonthlySales, serviceTopServices, serviceTopServicesAll, serviceUpdate } from "../../../actions/service";
import { serviceGetAvailableHours } from "../../../actions/service";
import { Service } from "../../../domain/entities/service.entity";

export interface AuthState {
    access_token?: string;
    user?: User;
  
    getall: () => Promise<false | ServiceResponse[] | null>;
    getAvailableHours: (serviceId: string, date: Date) => Promise<string[]>;
    createService: (service: Service) => Promise<false | ServiceResponse | null>;
    deleteService: (serviceId: string) => Promise<false | { status: number; msg: string } | null>;
    getByUser: () => Promise<false | ServiceResponse[] | null>;
    updateService: (serviceId: string, service: Service) => Promise<false | ServiceResponse | null>;
    totalSales: (serviceId: string) => Promise< number >;
    monthlySales: (serviceId: string) => Promise<{ month: number; total: number }[] | null>;
    annualSales: (serviceId: string) => Promise<{ year: number; total: number }[] | null>;
    top5Services: () => Promise<false |ServiceResponse[] | null>;
    topServices: () => Promise<ServiceResponse[] | null>;

  }

  export const useServiceStore = create<AuthState>()( (set, get) => ({
    access_token: undefined,
    user: undefined,
    getall: async () => {
        const { access_token } = useAuthStore.getState();
        if ( !access_token ) {
          return false;
        }
        const resp = await serviceGetAll(access_token);
        if ( !resp ) {
          return false;
        }
        console.log({resp})
        return resp;
      },

      getAvailableHours: async (serviceId: string, date: Date) => {
        const { access_token } = useAuthStore.getState();
        if (!access_token) {
          throw new Error('Access token not found');
        }
        const hours = await serviceGetAvailableHours(access_token, serviceId, date);
        return hours;
      },

      createService: async (service: Service) => {
        const { access_token, user } = useAuthStore.getState();
        if (!access_token || !user) {
          return false;
        }
        const resp = await serviceCreate(access_token, service, user.id);
        if (!resp) {
          return false;
        }
        return resp;
      },
      deleteService: async (serviceId: string) => {
        const { access_token } = useAuthStore.getState();
        if (!access_token) {
          return false;
        }
        const resp = await serviceDelete(access_token, serviceId);
        if (!resp) {
          return false;
        }
        return resp;
      },
      getByUser: async () => {
        const { access_token,user } = useAuthStore.getState();
        if (!access_token||!user) {
          return false;
        }
        console.log(`Buscando servicios por usuario: ${user.id}`);
        const resp = await serviceGetByUser(access_token, user.id);
        if (!resp) {
          return false;
        }
        return resp;
      },

      updateService: async (serviceId: string, service: Service) => {
        const { access_token } = useAuthStore.getState();
        if (!access_token) {
            return false;
        }
        const resp = await serviceUpdate(access_token, serviceId, service);
        if (!resp) {
            return false;
        }
        return resp;
    },

      totalSales: async (serviceId:string) => {
          const { access_token } = useAuthStore.getState();
          if (!access_token) {
              return 0;
          }
          const resp = await ServicetotalSales( access_token,serviceId);
          console.log({"store":resp})
          if (!resp) {
              return 0;
          }
          return resp;
      },
      monthlySales: async (serviceId:string) => {
          const { access_token } = useAuthStore.getState();
          if (!access_token) {
              return null;
          }
          const resp = await serviceMonthlySales( access_token,serviceId);
          console.log({"store":resp})
          if (!resp) {
              return null;
          }
          return resp;
      },

      annualSales: async (serviceId:string) => {
          const { access_token } = useAuthStore.getState();
          if (!access_token) {
              return null;
          }
          const resp = await serviceAnnualSales( access_token,serviceId);
          console.log({"store":resp})
          if (!resp) {
              return null;
          }
          return resp;
      },

      top5Services: async () => {
          const { access_token, user } = useAuthStore.getState();
          if (!access_token|| !user) {
              return false;
          }
          const resp = await serviceTopServices( access_token,user.id);
          console.log({"store":resp})
          if (!resp) {
              return false;
          }
          return resp;
      },

      topServices: async () => {
          const { access_token } = useAuthStore.getState();
          if (!access_token) {
              return null;
          }
          const resp = await serviceTopServicesAll( access_token);
          if (!resp) {
              return null;
          }
          return resp
      
      },
  }))

