// Request Types
import { firestore } from "firebase";

// Users Requests --------------------------------------------------------------
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

// Organization Requests -------------------------------------------------------
export type UpdateOrgRequest = {
  name: string;
  bio: string;
  website: string;
  email: string;
  media: string;
  tags: string[];
}

export interface CreateOrgRequest extends UpdateOrgRequest {
  userEmail: string;
} 

export type GetOrgRequest = {
  id: string;
  // since we are using uid instead of email for orgs
  // when we fire get ORG how can we know the uid before hand
  // won't we have to query the name field of every documen?
}

export type GetAllOrgsRequest = {
  id:string;
  // id should be the name of the collection
  // which in this case is organizations
}
export type EventRequest = {
  uuid: string;
}

// Event Requests --------------------------------------------------------------
export type CreateEventRequest = {
  orgId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    room: string;
    placeId: string;
    building: string;
  }
  tags: string[];
  media: string; 
}

export type EditEventRequest = {
  eventId: string;
  event: {
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    location?: {
      room: string;
      placeId: string;
      building: string;
    }
    tags?: string[];
    media?: string; 
  }
}

export type GetEventRequest = {
  eventId: string;
}

export type GetEventsRequest = {
  orgId: string;
}

// Do I need to verify the org deleting?
export type DeleteEventRequest = {
  eventId: string;
  orgId: string;
}