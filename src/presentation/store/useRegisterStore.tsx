import { create } from "zustand";
import { Register } from "../../domain/entities/register.entity";
import { RegisterStatus } from "../../infrastucture/interfaces/register.status";
import { registercheckOut, registercreateRegister, registereditAttendanceCheckIn, registereditAttendanceCheckOut } from "../../actions/register";
import { useAuthStore } from "./auth/useAuthStore";
import { registerfindById } from "../../actions/register";
import { RegisterResponse } from "../../infrastucture/interfaces/register.response";

export interface RegisterState {
    status: RegisterStatus;
    register?: Register ;
    register_id?: string;
    
    createRegister: (latitude: Number, longitude: Number) => Promise<boolean>;
    checkOut: (time: Date, latitude: Number, longitude: Number) => Promise<boolean>;
    findRegisterById: (start:string,end:string) => Promise<false | RegisterResponse[] | null>;
    findRegisterById2: (start:string,end:string, userId:string) => Promise<false | RegisterResponse[] | null>;
    editAttendanceCheckIn: (register_id:string , checkIn:Date) => Promise<boolean>;
    editAttendanceCheckOut: (register_id:string ,checkOut: Date) => Promise<boolean>;

  }

export const useRegisterStore = create<RegisterState>()( (set, get) => ({
    status: 'not working',
    register: undefined,
    
    createRegister: async (latitude: Number, longitude: Number) => {
        const { access_token, user } = useAuthStore.getState();
        if(!access_token || !user) return false;
        const resp = await registercreateRegister(latitude, longitude, user.id, access_token);
        if (!resp) {
          set({ status: 'not working', register: undefined, register_id: undefined});
          return false;
        }
        console.log("store",{resp})
        set({ status: 'working', register: resp.register, register_id: resp.register_id});
        return true;
      },
    
    checkOut: async (time: Date,latitude: Number, longitude: Number) => {
        const { access_token } = useAuthStore.getState();
        const { register_id } = get();
        if(!register_id|| !access_token) return false;
        const resp = await registercheckOut(time,  register_id, access_token, latitude ,longitude );
        if (!resp) {
          set({ status: 'working', });
          return false;
        }
        console.log("store",{resp})
        set({ status: 'not working', register: undefined, register_id: undefined});
        return true;
      },

      findRegisterById: async (start:string, end:string) => {
        const { access_token, user } = useAuthStore.getState();
        if(!access_token||!user) return false;
        const resp = await registerfindById( access_token, start, end, user.id);
        return resp;
    },

    findRegisterById2: async (start:string, end:string, userId:string) => {
      const { access_token } = useAuthStore.getState();
      if(!access_token||!userId) return false;
      const resp = await registerfindById( access_token, start, end, userId);
      return resp;
  },

  editAttendanceCheckIn: async (record_id:string ,checkIn:Date )=> {
    const { access_token ,user } = useAuthStore.getState();
    if(!access_token || !record_id || !user) return false;
    if(checkIn){
    const resp = await registereditAttendanceCheckIn (record_id,checkIn, access_token, user.name);
    if (!resp) {return false};
    }
    return true;
  },

  editAttendanceCheckOut: async ( record_id:string ,checkOut: Date )=> {
    const { access_token ,user } = useAuthStore.getState();
    if(!access_token|| !record_id || !user) return false;
    if(checkOut){
    const resp = await registereditAttendanceCheckOut (record_id,checkOut, access_token,user.name);
    if (!resp) {return false};
    }
    return true;
  },

  
  }))