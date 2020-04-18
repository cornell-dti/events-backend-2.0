// Request Types
import { firestore } from "firebase";

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

// when do you put question mark when its optional?
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