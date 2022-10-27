import axios from 'axios';

export const http = axios.create();

export const setBaseUrl = (path: string) => { // Talán meg kell változtatni
  http.defaults.baseURL = path;
}

export const setAuthHeader = (token: string) => {
  http.interceptors.request.use((req) => ({
    ...req,
    headers: {
      ...req.headers,
      "Authorization": token,
    }
  }))
}

export default http;