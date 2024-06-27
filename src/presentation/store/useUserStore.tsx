import { create } from "zustand";
import { UserResponse } from "../../infrastucture/interfaces/user.responses";
import { useAuthStore } from "./auth/useAuthStore";
import { getUsers } from "../../actions/user";

export interface UserState {

    getAll: () => Promise<UserResponse[] | null>;
  }

export const useUserStore = create<UserState>()( (set, get) => ({
    getAll: async () => {
        const { access_token } = useAuthStore.getState();
        if(!access_token) return null;
        const resp = await getUsers(access_token);
        return resp;
    },
  }));