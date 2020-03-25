// Request Types

export type CreateUserRequest = {
  email: string;
  tags: string[]
}

export type DeleteUserRequest = {
  email: string;
}

export type GetUserRequest = {
  email: string;
}

export type EventRequest = {
  uuid: string;
}