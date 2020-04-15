import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org, UserInfo } from "../types"
import { CreateEventRequest, DeleteEventRequest } from "../requestTypes";
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
    startDate: request.startDate,
    endDate: request.endDate,
    numAttendees: 0,
    organizer: orgRef,
    location: {
      room: request.location.room,
      placeId: request.location.placeId,
      building: request.location.building
    },
    tags: request.tags || [],
    media: request.media || ""
  }

  let eventRef : firestore.DocumentReference = db.collection('events').doc('event');
  return eventRef.set(event).then(
    async doc => {
      // const eventDoc = doc;
      // return { eventID : eventDoc.id };
      return "Event successfully created!";
    }).catch(
    async error => {
     return { error : error} ;
    });
}

export async function getEvent(db: firestore.Firestore, req: Request, res: Response): Promise<any> {

}

export async function deleteEvent(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as DeleteEventRequest;
  let id = request.id;
  let eventDocRef = db.collection('events').doc(id);
  return eventDocRef.delete().then((val) => {
    return { deleted: true };
  });
}