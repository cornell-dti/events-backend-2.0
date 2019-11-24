import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org } from "./types"
import { EventRequest } from "./requestTypes";

export function doTestPut(db: firestore.Firestore, req: Request, res: Response) {
  let cityRef = db.collection('cities').doc('LA');
  cityRef.collection('yeets').get().then(snapshot => {
    let insArr: firestore.DocumentReference[] = [];
    snapshot.forEach(element => {
      insArr.push(element.ref);
    })
    let event: Event = {
      name: 'Los Angeles',
      id: 2,
      ref: cityRef,
      collectionRef: insArr
      // nums: [2, 4, 3, 5, 9, 20]
    }

    // Add a new document in collection "cities" with ID 'LA'
    let setDoc = db.collection('testEvent').doc(`${event.id}`).set(event);

    res.send(event)
  });
}

export function doTestGet(db: firestore.Firestore, req: Request, res: Response) {
  // Get event with id 2
  let eventRef = db.collection('testEvent').doc('2');
  // Get the data from the ref
  eventRef.get().then(doc => {
    // If it doesn't exist, return an error
    if (!doc.exists) {
      console.log('No such document!');
      res.send({ error: "No such document" });
    } else {
      console.log('Document data:', doc.data());
      // Else, cast the returned data as an Event
      let yk: Event = doc.data() as Event;
      // Get the sub collection 'yeets'
      // Then get the specific doc and print its id
      yk.ref.collection('yeets').doc('k35acfeDKtg75z8hh02r').get().then(yeet => {
        res.send(yeet.id);
      })
    }
  });
}


export function doTestGet2(db: firestore.Firestore, req: Request, res: Response) {
  // Get event with id 2
  let eventRef = db.collection('testEvent').doc('2');
  // Get the data from the ref
  eventRef.get().then(doc => {
    // If it doesn't exist, return an error
    if (!doc.exists) {
      console.log('No such document!');
      res.send({ error: "No such document" });
    } else {
      console.log('Document data:', doc.data());
      // Else, cast the returned data as an Event
      let yk: Event = doc.data() as Event;
      // Get the sub collection 'yeets'
      // Then get the specific doc and print its id
      res.send(yk);
    }
  });
}