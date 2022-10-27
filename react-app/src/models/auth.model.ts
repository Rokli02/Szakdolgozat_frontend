import { BackendLocationNames, SidebarItem } from './menu.model';
import { User } from './user.model';

export type AuthContextStatesType = {
  backendLocation: string;
  token?: string;
  user?: User;
}

export type AuthContextType = {
  backendLocation: string;
  user?: User;
  login: (loginName: string, password: string) => unknown;
  setBackendLocation: (name: BackendLocationNames) => void;
  logout: () => void;
  sidebarItems: SidebarItem[] | undefined;
  getActiveBackendName: () => string;
}