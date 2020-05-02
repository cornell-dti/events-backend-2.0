import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org, UserInfo } from "../types"
import { CreateEventRequest, EditEventRequest, GetEventRequest, GetEventsRequest, DeleteEventRequest } from "../requestTypes";
import { materialize } from "../util/commonOps";
import { auth } from '../util/firebase';

export async function createEvent(db: firestore.Firestore, req: Request, res:Response): Promise<any> {
  let request = req.body as CreateEventRequest;
  let id = request.orgId;
  let orgRef: firestore.DocumentReference = db.collection('organizations').doc(id);

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

  let eventRef : firestore.DocumentReference = db.collection('events').doc();
  return eventRef.set(event).then(
    async doc => {
      return { eventId : eventRef.id };
    }).catch(
    async error => {
     return { error : error} ;
    });
}

// Must Pass In The Whole Event Or Pass In Whole Location if Changed
export async function editEvent(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as EditEventRequest;
  let event_id = request.eventId;
  let eventDocRef = db.collection('events').doc(event_id);
  return eventDocRef.get().then( doc => {
    if (!doc.exists) {
      throw `Event with id: ${event_id} not found!`;
    }
    return eventDocRef.update(request.event).then(function() {
      return request.event;
    });
  })
  .catch(error => {
    console.log('Error editing event: ', error);
    return { error: error };
  })
} 


export async function getEvent(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as GetEventRequest;
  let event_id = request.eventId;
  let eventDocRef = db.collection('events').doc(event_id);
  return eventDocRef.get().then( doc => {
    if (!doc.exists) {
      throw `Event with id: ${event_id} not found!`;
    }
    return materialize(doc.data());
  })
  .catch(error => {
    console.log('Error fetching event: ', error);
    return { error: error };
  }) 
}

export async function getEvents(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as GetEventsRequest;
  let orgId = request.orgId;
  let orgDocRef = db.collection('organizations').doc(orgId); // check to ensure that there is an email for it?
  return db.collection('events').where("organizer", "==", orgDocRef).get().then(
    async (eventSnapshot) => {
      if (eventSnapshot.empty) {
        return "There are no events for this organization";
      } else {
        const docs = eventSnapshot.docs.map(doc => materialize(doc.data()));
        return Promise.all(docs);
      }
  })
  .catch(error => {
    return { error: error }; 
  });
}

export async function deleteEvent(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as DeleteEventRequest;
  let event_id = request.eventId;
  let eventDocRef = db.collection('events').doc(event_id);
  return eventDocRef.delete().then((val) => {
    return { deleted: true };
  })
  .catch(error => {
    console.log("Error deleting event: ", error);
    return { error: error }; 
  });
}

export async function getEventFeed(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let currentDate = new Date();
  return db.collection('events').where("startDate", ">=", currentDate).get().then(
    async (eventFeedSnapshot) => {
      if (eventFeedSnapshot.empty) {
        return "There are no upcoming events";
      } else {
        const docs = eventFeedSnapshot.docs.map(doc => materialize(doc.data()));
        return Promise.all(docs);
      }
  })
  .catch(error => {
    return { error: error }; 
  });
}