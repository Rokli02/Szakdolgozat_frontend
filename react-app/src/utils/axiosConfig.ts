import axios from 'axios';
import { BackendLocations } from '../models/menu.model';

export const backendLocations: BackendLocations = {
  fastify: process.env.REACT_APP_FASTIFY_API_URL as string,
  express: process.env.REACT_APP_EXPRESS_API_URL as string,
  spring: process.env.REACT_APP_SPRING_API_URL as string,
}

export const http = axios.create();

export const setBaseUrl = (path: string) => {
  http.defaults.baseURL = path;
}

export const setAuthHeader = (token: string) => {
  http.defaults.headers.common["Authorization"] = token;
}

export default http;