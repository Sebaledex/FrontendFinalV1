import { create } from "zustand";
import { User } from "../../../domain/entities/user.entity";
import { AuthStatus } from "../../../infrastucture/interfaces/auth.status";
import { authLogin, authSignup } from "../../../actions/auth/auth";
import { StorageAdapter } from "../../../config/adapters/storage-adapter";



export interface AuthState {
    status: AuthStatus;
    access_token?: string;
    user?: User;
  
    login: (username: string, password: string) => Promise<boolean>;
    signup: (name: string, username: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
  }

export const useAuthStore = create<AuthState>()( (set, get) => ({
    status: 'checking',
    access_token: undefined,
    user: undefined,

    login: async (username: string, password: string) => {
        const resp = await authLogin(username, password);
        if ( !resp ) {
          set({ status: 'unauthenticated', access_token: undefined, user: undefined });
          return false;
        }
        console.log({resp})
        set({ status: 'authenticated', access_token: resp.access_token, user: resp.user});
        return true;
      },    

    signup: async (name: string, username: string, email: string, password: string) => {
      const resp = await authSignup(name, username, email, password); // Modifica authSignup para aceptar name y username
      if (!resp) {
        set({ status: 'unauthenticated', access_token: undefined, user: undefined });
        return false;
      }
      console.log({resp})
      set({ status: 'authenticated', access_token: resp.access_token, user: resp.user});
      return true;
    },

    logout: async () => {
      await StorageAdapter.removeItem('access_token');
      set({ status: 'unauthenticated', access_token: undefined, user: undefined });
    }
  
}))