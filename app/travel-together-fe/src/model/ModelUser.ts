export interface UserModel {
  fullName?: string;
  username?: string;
  phone: string;
  email?: string;
  password: string;
  accessToken?: string;
}

export interface UserModelLogin {
  data: {
    id?: string;
    username?: string;
    email?: string;
    accessToken?: string;
  };
}
