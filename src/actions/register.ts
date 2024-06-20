import { serviceAxiosApi } from "../config/api/serviceAxiosApi";
import { User } from "../domain/entities/user.entity";
import { RegisterResponse } from "../infrastucture/interfaces/register.responses";



export const createRegister = async (name: string, city: string, userId: string, access_token: string) => {
  try {
    console.log(`Creating register for user ${userId} with name ${name} in city ${city}`);
    const { data } = await serviceAxiosApi.post<RegisterResponse>('/v2/register', {
      name,
      city,
      users: [userId],
    }, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    console.log('Register created:', data);
    return data;
  } catch (error) {
    console.error('Error creating register:', error);
    return null;
  }
};