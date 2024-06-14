import { create } from "zustand";
import { User } from "../../../domain/entities/user.entity";
import { AuthStatus } from "../../../infrastucture/interfaces/auth.status";
import { authLogin, authSignup } from "../../../actions/auth/auth";
import { StorageAdapter } from "../../../config/adapters/storage-adapter";
import { useNavigation } from "@react-navigation/native";
import { createRegister } from "../../../actions/register";




export interface AuthState {
    status: AuthStatus;
    access_token?: string;
    user?: User;
  
    login: (username: string, password: string) => Promise<boolean>;
    signup: (name: string, username: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    createRegister: (name: string, city: string) => Promise<boolean>;

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
        console.log({resp});
        await StorageAdapter.setItem('token', resp.access_token);
        await StorageAdapter.setItem('user_id', resp.user_id);
        await StorageAdapter.setItem('rol1', resp.user.rol1);
        set({ status: 'authenticated', access_token: resp.access_token, user: resp.user});
        
        return true;
      },    

    signup: async (name: string, username: string, email: string, password: string) => {
      const resp = await authSignup(name, username, email, password); 
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
    },
  
    createRegister: async (name: string, city: string) => {
      const { access_token, user } = get();
      // Log para verificar los datos antes de crear el registro
      console.log('Creating register with name', name, 'in city', city);
      console.log('Access token:', access_token);
      console.log('User:', user);
  
      // Verificación adicional de user.id para evitar errores
      if (!access_token || !user || !user.id) {
        console.log('Access token or user ID not available');
        return false;
      }
  
      // Log para verificar el ID del usuario antes de crear el registro
      console.log('User ID:', user.id);
  
      try {
        const resp = await createRegister(name, city, user.id, access_token);
        if (resp) {
          // Log para verificar el registro creado exitosamente
          console.log('Register created successfully:', resp);
          return true;
        } else {
          console.log('Failed to create register');
          return false;
        }
      } catch (error) {
        console.error('Error creating register:', error);
        return false;
      }
    },
}))