// useUserStore.ts
import { create } from "zustand";
import { useAuthStore } from "./auth/useAuthStore";
import { getUsers, changeUserRole } from "../../actions/user";
import { UserResponse } from "../../infrastucture/interfaces/user.responses";

export interface UserState {
  getAll: () => Promise<UserResponse[] | null>;
  changeRole: (id: string, isAdmin: boolean) => Promise<boolean>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  getAll: async () => {
    const { access_token } = useAuthStore.getState();
    if (!access_token) return null;
    const resp = await getUsers(access_token);
    return resp;
  },
  changeRole: async (id: string, isAdmin: boolean) => {
    const { access_token } = useAuthStore.getState();
    if (!access_token) return false;
    const resp = await changeUserRole(id, isAdmin, access_token);
    return resp !== null;
  },
}));
