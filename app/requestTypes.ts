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
  email: string;
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
  email: string;
}
export type DeleteEventRequest = {
  id: string;
  email: string;
}