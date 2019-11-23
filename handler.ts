import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org } from "./types"

export function doTestPut(db: firestore.Firestore, req: Request, res: Response) {
  let event: Event = {
    name: 'Los Angeles',
    id: 2,
    yeet: "yeet"
  };

  // Add a new document in collection "cities" with ID 'LA'
  let setDoc = db.collection('testEvent').doc(`${event.id}`).set(event);

  res.send(event)
}

export function doTestGet(db: firestore.Firestore, req: Request, res: Response) {
  let cityRef = db.collection('testEvent').doc('2');
  let getDoc = cityRef.get().then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
      res.send({ error: "No such document" });
    } else {
      console.log('Document data:', doc.data());
      res.send(doc.data());
    }
  })
}