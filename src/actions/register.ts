import AsyncStorage from "@react-native-async-storage/async-storage";
import { serviceAxiosApi } from "../config/api/serviceAxiosApi";
import { User } from "../domain/entities/user.entity";
import { RegisterResponse } from "../infrastucture/interfaces/register.response";

const returnRegisterToken = ( data: RegisterResponse ) => {

  return {
    register: data.data,
    _id: data._id,
    userId: data.userId,
    coordinates: {
      latitude: data.coordinates.latitude,
      longitude: data.coordinates.longitude,
    },
    register_id: data._id,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    edited: data.edited,
    editedBy: data.editedBy,
}
}

export const registercreateRegister = async (latitude: Number, longitude: Number ,userId:string,  access_token: string) => {
  try {
    console.log(`Creating register for user ${userId} with latitude ${latitude} and longitude ${longitude}`);
    const { data } = await serviceAxiosApi.post<RegisterResponse>('/v2/register', {
      coordinates:{
        latitude,
        longitude,
    },
      userId,
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return returnRegisterToken(data);
  } catch (error:any) {
    console.error('Error creating register:', error);
    return null;
  }
};

export const registercheckOut = async (checkOut:Date,registerId:string,accessToken:string,latitude:Number,longitude:Number) => {
  const formattedCheckOut = checkOut instanceof Date ? checkOut.toISOString() : checkOut;
  console.log(`Creating checkOut for register ${registerId} with latitude ${latitude} and longitude ${longitude}`);
  const payload = { checkOut: formattedCheckOut,
    coordinatesOut:{
      latitude,
      longitude,
    }
  }; 
  try {
    console.log(`Creando check-out para el registro ${registerId}`);
    const { data } = await serviceAxiosApi.patch(`/v2/register/${registerId}/checkOut`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json' 
      }
    });
    console.log('Check-out DATA created:', data);
    return data;
  } catch (error) {
    console.error('Error creating check-out:', error);
    return null;
  }
}

export const registerfindById = async (accessToken: string,start:string,end:string,userId:string) => {
  try {
    const { data } = await serviceAxiosApi.get<RegisterResponse[]>(`/v2/register/ScheduleById/${start}/${end}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return data}
  catch (error) {
    console.error('Error finding register:', error);
    return null;
  }
}

export const registereditAttendanceCheckIn = async (id:string, checkIn:Date, accessToken:string,adminName:string) => {
  const formattedCheckIn = checkIn instanceof Date ? checkIn.toISOString() : checkIn;
  const payload = { checkIn: formattedCheckIn,  edited: true, editedBy: adminName};
  try {
    const { data } = await serviceAxiosApi.patch(`/v2/register/${id}/checkIn`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error('Error editing attendance:', error);
    return null;
  }
}

export const registereditAttendanceCheckOut = async (id:string,  checkOut:Date, accessToken:string,adminName:string) => {
  const formattedCheckOut = checkOut instanceof Date ? checkOut.toISOString() : checkOut;
  const payload = { checkOut: formattedCheckOut, edited: true, editedBy: adminName};
  try {
    const { data } = await serviceAxiosApi.patch(`/v2/register/${id}/CheckOut`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error('Error editing attendance:', error);
    return null;
  }
}