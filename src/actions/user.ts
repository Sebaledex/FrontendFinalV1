// user.ts
import { serviceAxiosApi } from "../config/api/serviceAxiosApi";
import { UserResponse } from "../infrastucture/interfaces/user.responses";

const returnUserToken = (data: UserResponse) => {
  const user = {
    id: data._id,
    role: data.user_role,
    name: data.name,
    username: data.username,
    email: data.email,
  };
  return {
    user: user,
  };
};

export const getUser = async (id: string) => {
  try {
    const { data } = await serviceAxiosApi.get<UserResponse>(`v2/user/${id}`);
    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUsers = async (accessToken: string) => {
  try {
    const { data } = await serviceAxiosApi.get<UserResponse[]>(`v2/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const changeUserRole = async (id: string, isAdmin: boolean, accessToken: string) => {
  try {
    const { data } = await serviceAxiosApi.patch<UserResponse>(`v2/user/${id}/role`, { isAdmin }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};