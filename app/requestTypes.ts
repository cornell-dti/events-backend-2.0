// Request Types

export type CreateUserRequest = {
  name: string;
  email: string;
  isOrgUser: boolean;
}

export type DeleteUserRequest = {
  email: string;
  isOrgUser: boolean;
}

export type GetUserRequest = {
  email: string;
  isOrgUser: boolean;
}

export type EventRequest = {
  uuid: string;
}