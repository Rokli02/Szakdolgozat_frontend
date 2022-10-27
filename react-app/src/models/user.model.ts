
export type User = {
  id?: number;
  name: string;
  username: string;
  email: string;
  role: Role
  created: string;
  password?: string;
  birthdate?: string;
  active?: boolean;
};

export type Role = {
  id: number;
  name?: string;
}

export type UserTableElement = {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  role: string;
  active: boolean;
  created: string;
}

export type LoginData = {
  token: string,
  user: User
};

export type NewUser = {
  name: string;
  birthdate: string;
  username: string;
  email: string;
  password?: string;
  role?: Role;
  active?: boolean;
};

export type UserPageModel = {
  users: User[];
  count: number;
}