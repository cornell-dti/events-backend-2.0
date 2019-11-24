// This file contains common operations that will need to be performed often.

import { firestore } from "firebase";

export function docRefArrayFromCollectionRef(coll: firestore.CollectionReference) {
  // Init array
  let insArr: firestore.DocumentReference[] = [];
  // Go through each doc and add their reference
  coll.get().then(snapshot => {
    snapshot.forEach(element => {
      insArr.push(element.ref);
    })
  });
  // Return the array
  return insArr;
}