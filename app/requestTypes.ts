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

export type CreateEventRequest = {
  email: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  organizer: firestore.DocumentReference;
  location: {
    room: string;
    place_id: string;
    building: string;
  }
  tags: string[];
  media: string; 
}