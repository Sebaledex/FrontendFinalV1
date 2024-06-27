import { serviceAxiosApi } from "../config/api/serviceAxiosApi";
import { User } from "../domain/entities/user.entity";
import { UserResponse } from "../infrastucture/interfaces/user.responses";

const returnUserToken = ( data: UserResponse ) => {
    const user: User = {
        id: data._id,
        rol1: data.user_role,
        name: data.name,
        username: data.username,
        email: data.email,
    }
    return {
        user: user,
    }
  }

export const getUser = async (id: string) => {
    try {
        const { data } = await serviceAxiosApi.get<UserResponse>(`v2/user/${id}`);
        return returnUserToken(data);
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getUsers = async (accessToken:String) => {
    try {
        const { data} = await serviceAxiosApi.get<UserResponse[]>(`v2/user`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
        return (data);
    } catch (error) {
        console.log(error);
        return null;
    }
};