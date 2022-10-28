import axios from 'axios';
import { BackendLocations } from '../models/menu.model';

export const backendLocations: BackendLocations = {
  fastify: process.env.REACT_APP_FASTIFY_API_URL as string,
  express: process.env.REACT_APP_EXPRESS_API_URL as string
}

export const http = axios.create();

http.defaults.baseURL = backendLocations.fastify;

export const setBaseUrl = (path: string) => { // Talán meg kell változtatni
  console.log("change base url", path);
  http.defaults.baseURL = path;
}

export const setAuthHeader = (token: string) => {
  http.defaults.headers.common["Authorization"] = token;
  // http.interceptors.request.use((req) => ({
  //   ...req,
  //   headers: {
  //     ...req.headers,
  //     "Authorization": token,
  //   }
  // }))
}

export default http;