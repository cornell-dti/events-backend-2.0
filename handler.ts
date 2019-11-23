import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";

export function doTestPut(db: firestore.Firestore, req: Request, res: Response) {
  let data = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
  };

  // Add a new document in collection "cities" with ID 'LA'
  let setDoc = db.collection('cities').doc('LA').set(data);

  res.send(data)
}

export function doTestGet(db: firestore.Firestore, req: Request, res: Response) {
  let cityRef = db.collection('cities').doc('LA');
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