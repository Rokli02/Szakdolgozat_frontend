import { DropdownItem } from '../models/menu.model';
import { NewUser, Role, User, UserPageModel } from '../models/user.model';
import http from './axiosConfig';

export const getUsersRequest = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<UserPageModel> => {
  let params: any = { size };

  if(order && order !== '') {
    params.ordr = order;
  }
  if(direction === true) {
    params.dir = direction
  }

  if(filter && filter !== '') {
    params.filt = filter
  }

  return await http.get<UserPageModel>(`users/page/${page}`, {
      params
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export const getUserRequest = async (id: number): Promise<User> => {
  return await http.get<{ user: User }>(`users/${id}`)
    .then((res) => res.data.user)
    .catch((err) => {
      throw err;
    });
}

export const updateUserRequest = async (id: number, updatedUser: NewUser): Promise<string> => {
  return await http.put<{ message: string }>(`users/${id}`, {
    ...updatedUser
  })
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}

export const deleteUserRequest = async (id: number): Promise<string> => {
  return await http.delete<{ message: string }>(`users/${id}`)
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}

export const gerRolesRequest = async (): Promise<Role[]> => {
  return await http.get<{ roles: Role[] }>("auth/roles")
    .then((res) => res.data.roles)
    .catch((err) => {
      throw err;
    });
}

export const getOrders = (): DropdownItem[] => {
  return [
    { shownValue: "Nincs", value: "" },
    { shownValue: "Név", value: "name" },
    { shownValue: "Felhasználónév", value: "username"},
    { shownValue: "Email", value: "email"},
    { shownValue: "Születésnap", value: "birthdate"},
    { shownValue: "Létrehozás dátuma", value: "created"},
  ]
}