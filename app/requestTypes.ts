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

export type UpdateOrgRequest = {
  name: string;
  bio: string;
  website: string;
  email: string;
  media: string;
}

export interface CreateOrgRequest extends UpdateOrgRequest {
  userEmail: string;
} 

export type GetOrgRequest = {
  id: string;
}

export type EventRequest = {
  uuid: string;
}