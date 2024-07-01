import { create } from "zustand";
import { User } from "../../../domain/entities/user.entity";
import { AuthStatus } from "../../../infrastucture/interfaces/auth.status";
import { authLogin, authSignup } from "../../../actions/auth/auth";
import { StorageAdapter } from "../../../config/adapters/storage-adapter";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "./useAuthStore";
import { ServiceResponse } from "../../../infrastucture/service.response";
import { serviceGetAll } from "../../../actions/service";

export interface AuthState {
    access_token?: string;
    user?: User;
  
    getall: () => Promise<false | ServiceResponse[] | null>;

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
  }))

