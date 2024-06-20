import { STAGE, API_URL as PROD_URL, API_URL_ANDROID } from '@env';
import axios from 'axios';
import { Platform } from 'react-native';



export const API_URL = "http://192.168.100.2:3000/api"



const serviceAxiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})


export {
  serviceAxiosApi,
}