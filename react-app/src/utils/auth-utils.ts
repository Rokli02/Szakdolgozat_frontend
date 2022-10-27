import { SidebarItem, StoredSidebarItem } from '../models/menu.model';
import { LoginData, NewUser, User } from '../models/user.model';
import http from './axiosConfig';

export const loginRequest = async (loginName: string, password: string): Promise<LoginData> => {
  return await http.post<LoginData>("auth/login", {
    usernameOrEmail: loginName, 
    password
  }).then((res) => res.data);
};

export const signupRequest = async(newUser: NewUser): Promise<{ message: string }> => {
  return await http.post<{ message: string }>("auth/signup", {
    ...newUser
  }).then((res) => res.data);
}

const hasRight = (user: User, rights: string[]): boolean => {
  if(!user) {
    return false;
  }

  for(let right of rights) {
    if(right === user?.role.name) {
      return true;
    }
  }

  return false;
}

export const getSidebarItems = (user?: User): SidebarItem[] | undefined => {
  if(!user) {
    return undefined;
  }

  const items: SidebarItem[] = SidebarItems.filter((item) => item.right.length === 0 || hasRight(user, item.right))
    .sort((a, b) => a.order - b.order)
    .map((item) => ({ name: item.name, link: item.link }) as SidebarItem);

  return items;
}

const SidebarItems: StoredSidebarItem[] = [
  {
    name: "Sorozataim",
    link: "/user/series",
    order: 1,
    right: ["user"]
  },
  {
    name: "Híreim",
    link: "/user/newsfeed",
    order: 2,
    right: ["user"]
  },
  {
    name: "Sorozat módosítás",
    link: "/user/handle/series",
    order: 3,
    right: ["user"]
  },
  {
    name: "Kijelentkezés",
    link: "/logout",
    order: 99,
    right: []
  },
  {
    name: "Felhasználó kezelés",
    link: "/admin/user",
    order: 1,
    right: ["admin"]
  },
  {
    name: "Sorozat kezelés",
    link: "/admin/series",
    order: 2,
    right: ["admin", "siteManager"]
  },
  {
    name: "Újdonság kezelés",
    link: "/admin/newsfeed",
    order: 3,
    right: ["admin", "siteManager"]
  },
  {
    name: "Egyéb tulajdonság kezelés",
    link: "/admin/misc",
    order: 4,
    right: ["admin", "siteManager"]
  }
]