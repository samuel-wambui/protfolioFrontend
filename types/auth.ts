export type AuthUser = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  roles: string[];
  loggedIn?: boolean;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  username: string;
  firstName?: string;
  firstname?: string;
  email?: string;
  lastName?: string;
  lastname?: string;
  loggedIn?: boolean;
  roles?: string[];
  role?: unknown;
  authorities?: unknown;
  authority?: unknown;
  passwordChangeRequired?: boolean;
  entity?: LoginResponse;
  user?: LoginResponse;
};

export type LoginResult = {
  passwordChangeRequired: boolean;
};
