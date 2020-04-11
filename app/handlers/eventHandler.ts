import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org, UserInfo } from "../types"
import { CreateEventRequest, CreateUserRequest, GetUserRequest, DeleteUserRequest } from "../requestTypes";
import { v4 as uuid } from 'uuid';
import { materialize } from "../util/commonOps";
import { auth } from '../util/firebase';

export async function createEvent(db: firestore.Firestore, req: Request, res:Response): Promise<any> {
  let request = req.body as CreateEventRequest;
  let id = request.email.toLowerCase();
  let orgRef: firestore.DocumentReference = db.collection('users').doc(id);

  let event: Event = {
    name: request.name,
    description: request.description || "",
    startDate: request.endDate,
    endDate: request.endDate,
    numAttendees: 0,
    organizer: orgRef,
    location: {
      room: request.location.room,
      place_id: request.location.place_id,
      building: request.location.building
    },
    tags: request.tags || [],
    media: request.media || ""
  }




}