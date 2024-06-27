import { UpdateResponse } from "../infrastucture/interfaces/update.responses"
import { User } from "../domain/entities/user.entity"
import { serviceAxiosApi } from "../config/api/serviceAxiosApi"
import AsyncStorage from '@react-native-async-storage/async-storage';

const returnUserToken = ( data: UpdateResponse ) => {
  const user: User = {
    id: data._id,
    rol1: data.rol1,
    name: "",
    username: "",
    email: ""
  }

  return {
    user: user,
    access_token: data.access_token,
  }
}

interface UpdateUserData {
  username?: string;
  name?: string;
  email?: string;
  password?: string;
}

export const patch = async (id: string, updateData: UpdateUserData) => {
  try {
    const dataToUpdate: UpdateUserData = {};
    if (updateData.username) dataToUpdate.username = updateData.username;
    if (updateData.name) dataToUpdate.name = updateData.name;
    if (updateData.email) dataToUpdate.email = updateData.email;
    if (updateData.password) dataToUpdate.password = updateData.password;  

    const accessToken = await AsyncStorage.getItem('token');

    const { data } = await serviceAxiosApi.patch<UpdateResponse>(`v2/user/${id}`, dataToUpdate, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log(data);
    return returnUserToken(data);

  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};
