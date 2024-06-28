import { create } from "zustand";
import { User } from "../../../domain/entities/user.entity";
import { AuthStatus } from "../../../infrastucture/interfaces/auth.status";
import { authLogin, authSignup } from "../../../actions/auth/auth";
import { registercheckOut, registercreateRegister } from "../../../actions/register";
import { StorageAdapter } from "../../../config/adapters/storage-adapter";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthState {
  status: AuthStatus;
  access_token?: string;
  user?: User;

  login: (username: string, password: string) => Promise<boolean>;
  signup: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  access_token: undefined,
  user: undefined,

  login: async (username: string, password: string) => {
    const resp = await authLogin(username, password);
    if (!resp) {
      set({ status: 'unauthenticated', access_token: undefined, user: undefined });
      return false;
    }
    console.log({ resp });
    await StorageAdapter.setItem('token', resp.access_token);
    await StorageAdapter.setItem('user_id', resp.user_id);
    await StorageAdapter.setItem('rol1', resp.user.rol1);
    set({ status: 'authenticated', access_token: resp.access_token, user: resp.user });
    return true;
  },

  signup: async (name: string, username: string, email: string, password: string) => {
    const resp = await authSignup(name, username, email, password);
    if (!resp) {
      set({ status: 'unauthenticated', access_token: undefined, user: undefined });
      return false;
    }
    console.log({ resp });
    set({ status: 'authenticated', access_token: resp.access_token, user: resp.user });
    return true;
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'user_id', 'rol1']); // Remover todos los datos relevantes
    set({ status: 'unauthenticated', access_token: undefined, user: undefined });
  },
}));
