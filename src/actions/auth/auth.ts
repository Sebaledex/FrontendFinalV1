import { serviceAxiosApi } from "../../config/api/serviceAxiosApi";
import { User } from "../../domain/entities/user.entity";
import { AuthResponse } from "../../infrastucture/interfaces/auth.responses";




  const returnUserToken = ( data: AuthResponse ) => {

    const user: User = {
      id: data._id,
      name: data.name,
      username: data.username,
      email: data.email,
      roles: data.roles,
    }
  
    return {
      user: user,
      access_token: data.access_token,
    }
  }
  

export const authLogin = async (username: string, password: string) => {

    try {
        const { data } = await serviceAxiosApi.post<AuthResponse>('/v2/auth/signin', {
            username,
            password,
          });
    
    return returnUserToken(data);
      
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  
  export const authSignup = async (name: string, username: string, email: string, password: string) => {
    email = email.toLowerCase();
    try {
        const { data } = await serviceAxiosApi.post<AuthResponse>('/v2/auth/signup', {
          name,
          username,
          email,
          password,
          });
    
    return returnUserToken(data);
      
    } catch (error) {
      console.log(error);
      return null;
    }





  };