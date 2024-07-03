import { create } from "zustand";
import { postulacionCreate, postulacionGetByUser } from "../../actions/postulacion";
import { useAuthStore } from "./auth/useAuthStore";
import { PostulacionResponse } from "../../infrastucture/postulacion.response";

export interface postulacionState {
  create: ( serviceId: string, fecha:Date, horario:string,  mensaje:string) => Promise<boolean>;
  getbyuser: () => Promise<false | PostulacionResponse[] | null>;
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

  getbyuser: async () => {
    const { access_token } = useAuthStore.getState();
    const { user } = useAuthStore.getState();
    if (!access_token||!user) {
      return false;
    }
    const resp = await postulacionGetByUser(user.id, access_token);
    console.log('Postulaciones en STORE:', resp);
    if (!resp) {
      return false;
    }
    return resp;
  },
}));

