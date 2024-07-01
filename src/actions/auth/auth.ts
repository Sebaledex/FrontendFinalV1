import { serviceAxiosApi } from "../../config/api/serviceAxiosApi";
import { User } from "../../domain/entities/user.entity";
import { AuthResponse } from "../../infrastucture/interfaces/auth.responses";
import { AxiosError } from 'axios';




  const returnUserToken = ( data: AuthResponse ) => {

    const user: User = {
      id: data.userId,
      name: data.name,
      username: data.username,
      email: data.email
    }
  
    return {
      user: user,
      access_token: data.access_token,
    }
  }
  

  export const authLogin = async (username: string, password: string) => {
    console.log('Inicio de authLogin');
    console.log('Datos de entrada:', { username, password });

    try {
        console.log('Enviando solicitud a /v2/auth/signin');
        const { data } = await serviceAxiosApi.post<AuthResponse>('/v2/auth/signin', {
            username,
            password,
        });
        console.log('Solicitud exitosa:', data);

        return returnUserToken(data);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log('Error en la solicitud Axios:', error.message);
            if (error.response) {
                console.log('Datos de respuesta del error:', error.response.data);
                console.log('Estado de respuesta del error:', error.response.status);
                console.log('Headers de respuesta del error:', error.response.headers);
            } else if (error.request) {
                console.log('No se recibió respuesta:', error.request);
            } else {
                console.log('Error en la configuración de la solicitud:', error.message);
            }
        } else {
            console.log('Error inesperado:', error);
        }
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