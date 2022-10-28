import { BackendLocationNames, SidebarItem } from './menu.model';
import { NewUser, User } from './user.model';

export type AuthContextStatesType = {
  backendLocation: string;
  token?: string;
  user?: User;
}

export type AuthContextType = {
  backendLocation: string;
  user?: User;
  login: (loginName: string, password: string) => Promise<{ message: string }>;
  signup: (newUser: NewUser) => Promise<{ message: string }>;
  setBackendLocation: (name: BackendLocationNames) => void;
  logout: () => void;
  sidebarItems: SidebarItem[] | undefined;
  getActiveBackendName: () => string;
}

export type LoginType = {
  login?: string;
  password?: string;
}