import { create } from "zustand";
import { User } from "../../../domain/entities/user.entity";
import { useAuthStore } from "./useAuthStore";
import { ServiceResponse } from "../../../infrastucture/service.response";
import { serviceCreate, serviceDelete, serviceGetAll, serviceGetByUser, serviceUpdate } from "../../../actions/service";
import { serviceGetAvailableHours } from "../../../actions/service";
import { Service } from "../../../domain/entities/service.entity";

export interface AuthState {
    access_token?: string;
    user?: User;
  
    getall: () => Promise<false | ServiceResponse[] | null>;
    getAvailableHours: (serviceId: string, date: Date) => Promise<string[]>;
    createService: (service: Service) => Promise<false | ServiceResponse | null>;
    deleteService: (serviceId: string) => Promise<false | { status: number; msg: string } | null>;
    getByUser: (userId: string) => Promise<false | ServiceResponse[] | null>;
    updateService: (serviceId: string, service: Service) => Promise<false | ServiceResponse | null>;
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
      getByUser: async (userId: string) => {
        const { access_token } = useAuthStore.getState();
        if (!access_token) {
          return false;
        }
        const resp = await serviceGetByUser(access_token, userId);
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
    }

  }))

