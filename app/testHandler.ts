// // This file contains the firebase implementations of the endpoints.

// import { Request, Response } from "express-serve-static-core";
// import { firestore } from "firebase";
// import { Event, Org } from "./types"
// import { EventRequest } from "./requestTypes";
// import * as commonOps from "./util/commonOps";


// /***
//  * Tests adding a doc with references to other docs
//  */
// export async function doTestPut(db: firestore.Firestore, req: Request, res: Response) {
//   // Get the reference to the city 'LA'  
//   let cityRef = db.collection('cities').doc('LA');
//   // Create an event containing the 'LA' reference and the collection 'yeets'
//   // that exists only under the 'LA' reference
//   let event: Event = {
//     name: 'Event 1 Name',
//     id: 2,
//     ref: cityRef,
//     // Get an array of the doc references from the collection 'yeets'
//     collectionRef: await commonOps.docRefArrayFromCollectionRef(cityRef.collection('yeets')),
//     nums: [2, 4, 3, 5, 9, 20]
//   }

//   // Add a new document in collection "cities" with ID 'LA'
//   let setDoc = db.collection('testEvent').doc(`${event.id}`).set(event);

//   res.send(event)
// }

// /**
//  * Tests getting a doc, then getting another doc from a subcollection of the
//  * original doc
//  */
// export function doTestGet(db: firestore.Firestore, req: Request, res: Response) {
//   // Get event with id 2
//   let eventRef = db.collection('testEvent').doc('2');
//   // Get the data from the ref
//   eventRef.get().then(doc => {
//     // If it doesn't exist, return an error
//     if (!doc.exists) {
//       console.log('No such document!');
//       res.send({ error: "No such document" });
//     } else {
//       // Else, cast the returned data as an Event
//       let yk: Event = doc.data() as Event;
//       // Get the sub collection 'yeets'
//       // Then get the specific doc and print its id
//       yk.ref.collection('yeets').doc('yeet1id').get().then(yeet => {
//         res.send(yeet.id);
//       })
//     }
//   });
// }

// /**
//  * Tests returning the doc's data entirely
//  */
// export function doTestGet2(db: firestore.Firestore, req: Request, res: Response) {
//   // Get event with id 2
//   let eventRef = db.collection('testEvent').doc('2');
//   // Get the data from the ref
//   eventRef.get().then(async doc => {
//     // If it doesn't exist, return an error
//     if (!doc.exists) {
//       console.log('No such document!');
//       res.send({ error: "No such document" });
//     } else {
//       // Else, cast the returned data as an Event
//       let yk: Event = doc.data() as Event;
//       // Send back the entire event
//       res.send(yk);
//     }
//   });
// }

// /**
//  * Tests returning the doc's data entirely materialized
//  */
// export function doTestGet3(db: firestore.Firestore, req: Request, res: Response) {
//   // Get event with id 2
//   let eventRef = db.collection('testEvent').doc('2');
//   // Get the data from the ref
//   eventRef.get().then(async doc => {
//     // If it doesn't exist, return an error
//     if (!doc.exists) {
//       console.log('No such document!');
//       res.send({ error: "No such document" });
//     } else {
//       // Else, cast the returned data as an Event
//       let yk: Event = doc.data() as Event;
//       // Send back the entire event
//       res.send(await commonOps.materialize(yk));
//     }
//   });
// }