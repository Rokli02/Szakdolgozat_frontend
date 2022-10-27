import { createContext, FC, useEffect, useState } from 'react';
import { AuthContextStatesType, AuthContextType } from '../models/auth.model';
import { BackendLocationNames, BackendLocations, SidebarItem } from '../models/menu.model';
import { loginRequest, getSidebarItems } from '../utils/auth-utils';
import { setAuthHeader, setBaseUrl } from '../utils/axiosConfig';
import { AxiosError } from 'axios';

const backendLocations: BackendLocations = {
  fastify: process.env.REACT_APP_FASTIFY_API_URL as string,
  express: process.env.REACT_APP_EXPRESS_API_URL as string
}

export const initValue: AuthContextStatesType = {
  backendLocation: "",
  token: undefined,
  user: undefined,
}

export const initContextValue: AuthContextType = {
  backendLocation: "",
  user: undefined,
  login: (loginName: string, password: string) => null,
  setBackendLocation: (name: BackendLocationNames) => null,
  logout: () => null,
  sidebarItems: [],
  getActiveBackendName: () => "",
}

export const AuthContext = createContext(initContextValue);

export const AuthProvider: FC<{children: JSX.Element}> = ({children}) => {
  const [state, setState] = useState(initValue);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[] | undefined>([]);

  useEffect(() => {
    const apiUrlKey = localStorage.getItem("API_URL_KEY") as BackendLocationNames;
    const initState: AuthContextStatesType = {} as AuthContextStatesType;
    if(apiUrlKey) {
      initState.backendLocation = backendLocations[apiUrlKey];
    } else {
      initState.backendLocation = backendLocations["fastify"];
    }
    
    const tempToken = localStorage.getItem("token");
    const tempUser = localStorage.getItem("user");
    if(tempToken) {
      initState.token = tempToken;
    }
    if(tempUser) {
      initState.user = JSON.parse(tempUser);
    }
    setState(initState);
  }, []);

  useEffect(() => {
    setSidebarItems(getSidebarItems(state.user));
  }, [state.user]);

  const login = async (loginName: string, password: string): Promise<{ message: string }> => {
    try {
      const response = await loginRequest(loginName, password);
      console.log(response);
      setState((pre) => ({
        ...pre,
        user: response.user,
        token: response.token
      }))
      setAuthHeader(response.token);
      return { message: "Sikeres bejelentkezés!" };
    } catch(err) {
      console.log(err);
      return { message: (err as AxiosError).message};
    }
  }
  const setBackendLocation = (name: BackendLocationNames) => {
    const location = backendLocations[name];
    if(location) {
      setState((pre) => ({
        ...pre,
        backendLocation: location,
      }));
      setBaseUrl(location);
      localStorage.setItem("API_URL_KEY", name);
    }
  }
  const logout = () => {
    setState((pre) => ({
      ...initValue,
      backendLocation: pre.backendLocation,
    }));
    setAuthHeader("");
  }
  const getActiveBackendName = (): string => {
    for(const locName of Object.keys(backendLocations)) {
      if(state.backendLocation === backendLocations[locName]) {
        return locName;
      }
    }
    return "";
  }

  return (
    <AuthContext.Provider value={{
      backendLocation: state.backendLocation,
      user: state.user,
      login,
      setBackendLocation,
      logout,
      sidebarItems,
      getActiveBackendName
    }}>
      {children}
    </AuthContext.Provider>
  )
}