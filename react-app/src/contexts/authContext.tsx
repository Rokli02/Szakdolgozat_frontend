import { createContext, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextStatesType, AuthContextType } from '../models/auth.model';
import { BackendLocationNames, SidebarItem } from '../models/menu.model';
import { NewUser } from '../models/user.model';
import { loginRequest, getSidebarItems, signupRequest } from '../utils/auth-utils';
import { backendLocations, setAuthHeader, setBaseUrl } from '../utils/axiosConfig';

const initValue: AuthContextStatesType = {
  backendLocation: "",
  token: undefined,
  user: undefined,
}

const initContextValue: AuthContextType = {
  backendLocation: "",
  user: undefined,
  login: (loginName: string, password: string) => null as any,
  signup: (newUser: NewUser) => null as any,
  setBackendLocation: (name: BackendLocationNames) => null,
  logout: () => null,
  sidebarItems: [],
  getActiveBackendName: () => "",
}

export const AuthContext = createContext(initContextValue);

export const AuthProvider: FC<{children: JSX.Element}> = ({children}) => {
  const [state, setState] = useState(initValue);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[] | undefined>([]);
  const navigate = useNavigate();

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
    setBaseUrl(initState.backendLocation);
  }, []);

  useEffect(() => {
    setSidebarItems(getSidebarItems(state.user));
    setAuthHeader(state.token ? "Bearer " + state.token : undefined);
  }, [state.user, state.token]);

  const login = async (loginName: string, password: string): Promise<{ message: string }> => {
    try {
      const response = await loginRequest(loginName, password);
      setState((pre) => ({
        ...pre,
        user: response.user,
        token: response.token
      }))
      setAuthHeader("Bearer " + response.token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      return { message: "Sikeres bejelentkezés!" };
    } catch(err) {
      throw err;
    }
  }

  const signup = async (newUser: NewUser): Promise<{ message: string }> => {
    try {
      const response = await signupRequest(newUser);
      return response;
    } catch(err) {
      throw err;
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState((pre) => ({
      ...initValue,
      backendLocation: pre.backendLocation,
    }));
    setAuthHeader(undefined);
    navigate("/login");
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
      signup,
      setBackendLocation,
      logout,
      sidebarItems,
      getActiveBackendName
    }}>
      {children}
    </AuthContext.Provider>
  )
}