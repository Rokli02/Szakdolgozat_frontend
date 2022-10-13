
export type User = {
  name: string;
  username: string;
  role: {
    id: number;
    name: string;
  }
  email: string;
  created: string;
};

export type LoginData = {
  token: string,
  user: User
};

export type NewUser = {
  name: string;
  birthdate: string;
  username: string;
  email: string;
  password: string;
};
