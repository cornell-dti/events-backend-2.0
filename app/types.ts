// Models
import { firestore } from "firebase";


export class Event {

  name: string;
  id: number;
  ref: firestore.DocumentReference;

  constructor(name: string, id: number, ref: firestore.DocumentReference) {
    this.name = name;
    this.id = id;
    this.ref = ref;
  }
}

export class Org {

  name: string;
  id: number;

  constructor(name: string, id: number, refs: firestore.DocumentReference) {
    this.name = name;
    this.id = id;
  }
}