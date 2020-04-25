// Models

import { firestore } from "firebase";

export type Event = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  numAttendees: number;
  organizer: firestore.DocumentReference;
  location: {
    room: string;
    placeId: string;
    building: string;
  }
  tags: string[];
  media: string;
}

export type Org = {
  name: string;
  bio: string;
  website: string;
  email: string;
  media: string;
  orgUser: firestore.DocumentReference;
  tags: string[];
  // do we not need org tags?
  // should we also include useremail here?
}

export type UserInfo = {
  tags: string[];
}