import { create } from "zustand";
import { postulacionCreate } from "../../actions/postulacion";
import { useAuthStore } from "./auth/useAuthStore";

export interface postulacionState {
  create: ( serviceId: string, fecha:Date, horario:string,  mensaje:string) => Promise<boolean>;
}

export const usePostulacionStore = create<postulacionState>()((set, get) => ({
  access_token: undefined,
  create: async ( serviceId: string, fecha:Date, horario:string,  mensaje:string ) => {
    const { access_token } = useAuthStore.getState();
    const { user } = useAuthStore.getState();
    if (!access_token||!user) {
      return false;
    }
    const resp = await postulacionCreate(access_token, user?.id, serviceId, fecha, horario, mensaje);
    if (!resp) {
      return false;
    }
    return true;
  },
}));

