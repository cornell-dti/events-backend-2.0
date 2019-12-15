// Request Types

export type CreateUserRequest = {
  name: string;
  email: string;
  isOrgUser: boolean;
  password: string;
  confirm_password: string;
}

export type DeleteUserRequest = {
  email: string;
  isOrgUser: boolean;
  token: string;
}

export type GetUserRequest = {
  email: string;
  password: string;
  isOrgUser: boolean;
}

export type EventRequest = {
  uuid: string;
}